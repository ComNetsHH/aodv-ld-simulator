import Aodv, { MESSAGES } from '../aodv/Aodv';
import PositionUtils from '../../../../../utils/PositionUtils';
import { ADDRESSES } from '../../../../../models/Message';
import Rreq from './Rreq';
import Rrep from '../aodv/Rrep';
import PathDurationUtils from '../../../../../utils/PathDurationUtils';

const EVENTS = {
    SEND_RREP: 'SEND_RREP',
    FORWARD_RREQ: 'FORWARD_RREQ'
};

export const STRATEGIES = {
    DETERMINISTIC: 'AODV_LD_D',
    STOCHASTIC: 'AODV_LD_S'
}

export default class AodvLd extends Aodv {
    constructor(options) {
        super(options);

        this.rrepDelay = 30;//options.rrepDelay || 1;
        this.rreqForwardDelay = 0;
        this.direction = options.direction;
        this.radioRange = options.radioRange;
        this.answeredRreqs = new Set();

        this.scheduledRreqs = new Set();
        this.lifetimeBias = 0;
        this.rreqMap = new Map();
        this.awaitingRrep = new Map();
        this.epd = [];

        this.bestRreq = new Map();
        this.strategy = options.strategy

        this.skipCount = 0;
    }

    getExpectedLifetimeFromRREQ(rreq, isDestination) {
        if (this.strategy === STRATEGIES.DETERMINISTIC) {
            const lifetimes = [];
            const {
                positions,
                velocities
            } = rreq;
            for (let i = 1; i < positions.length; i++) {
                const l = PositionUtils.getLinkDuration(positions[i - 1], positions[i], velocities[i - 1], velocities[i], this.radioRange);
                lifetimes.push(l)
            }
            const lt = Math.min(...lifetimes);
            return lt;
        }

        if (this.strategy === STRATEGIES.STOCHASTIC) {
            const {
                linkDurations
            } = rreq;

            const linksA2A = isDestination ? linkDurations.slice(0, linkDurations.length - 2) : linkDurations;
            const linkA2G = isDestination ? linkDurations[linkDurations.length - 1] : null;

            const ld = PathDurationUtils.getExpectedResidualPathDuration(linksA2A, linkA2G, this.direction, this.radioRange);
            //isDestination && console.log(ld);
            return ld;
        }


    }

    createRREQ(destAddress) {
        const rreq = new Rreq({
            srcAddress: this.host.address,
            destAddress,
            seqNo: this.seqNo
        });
        const positionXYZ = this.host.getPositionXYZ();
        const velocityXYZ = this.host.getVelocityVectorXYZ();
        rreq.addMobilityInfo(positionXYZ, velocityXYZ);
        this.seqNo++;
        return rreq;
    }

    async onEvent(eventType, payload) {
        if (eventType === EVENTS.FORWARD_RREQ) {
            const rreqIdentifier = payload;

            if (this.answeredRreqs.has(rreqIdentifier)) {
                return;
            }
            const rreq = this.bestRreq.get(rreqIdentifier);

            this.lowerLayer.receiveFromUpper(rreq, ADDRESSES.BROADCAST);
            this.numCtrlPacketsSent++;
            this.ctrlPacketBytesSent += rreq.getSize(this.strategy);
            this.answeredRreqs.add(rreqIdentifier);
            return;
        }
        if (eventType === EVENTS.SEND_RREP) {
            const rreqIdentifier = payload;
            const {
                nextHop,
                rrep
            } = this.awaitingRrep.get(rreqIdentifier);
            this.lowerLayer.receiveFromUpper(rrep, nextHop);
            this.numCtrlPacketsSent++;
            this.ctrlPacketBytesSent += rrep.getSize();
            this.answeredRreqs.add(rreqIdentifier);
            this.epd.push(this.rreqMap.get(rreqIdentifier));

            // this.establishedPaths.push({
            //     ts: this.kernel.getSimTime(),
            //     path: [...this.bestRreq.path, this.host.name],
            //     expectedDuration: this.getExpectedLifetimeFromRREQ(this.bestRreq)
            // });
            return;
        }
        return super.onEvent(eventType, payload);
    }

    receiveFromLower(message, linkLayerSrcAddress) {
        if (this.kernel.getSimTime() > this.host.applicationStopTime) {
            return;
        }
        const { type } = message;

        switch (type) {
            case MESSAGES.RREQ: {
                const rreq = message.copy();
                const {
                    srcAddress,
                    destAddress,
                    path,
                    seqNo
                } = rreq;

                if (path.length > this.maxTTL) {
                    break
                }

                const rreqIdentifier = `${srcAddress}-${seqNo}`;
                if (this.answeredRreqs.has(rreqIdentifier)) {
                    break;
                }
                if (srcAddress === this.host.address) {
                    break;
                }
                this.rreqsReceived.add(rreqIdentifier);


                rreq.addHop(linkLayerSrcAddress);

                if (this.strategy === STRATEGIES.DETERMINISTIC) {
                    const positionXYZ = this.host.getPositionXYZ();
                    const velocityXYZ = this.host.getVelocityVectorXYZ();
                    rreq.addMobilityInfo(positionXYZ, velocityXYZ);
                }

                if (this.strategy === STRATEGIES.STOCHASTIC) {
                    const linkDurationEntry = this.neighbors.get(linkLayerSrcAddress);
                    if (!linkDurationEntry || (this.kernel.getSimTime() - linkDurationEntry.lastSeenAt) > 3 * this.helloInterval) {
                        rreq.addLinkDuration(3600000 / 2);
                    } else {
                        let ld = 0;
                        // I'm the IGW, i must calc effective ld
                        if (destAddress === this.host.address) {
                            const p1 = this.host.getPositionXYZ();
                            const v1 = this.host.getVelocityVectorXYZ();
                            const p2 = linkDurationEntry.position;
                            const v2 = linkDurationEntry.velocity;


                            const residualLd = PositionUtils.getLinkDuration(p1, p2, v1, v2, this.radioRange);
                            const maxDuration = this.direction === 'EAST' ? 3600000 : 4000000;
                            // 2 * this.radioRange / PositionUtils.norm(v2);


                            ld = maxDuration - residualLd;
                            const ld2 = this.kernel.getSimTime() - linkDurationEntry.firstSeenAt;
                        } else {
                            ld = this.kernel.getSimTime() - linkDurationEntry.firstSeenAt;
                        }

                        rreq.addLinkDuration(ld);
                    }
                }

                const prevLifeTime = this.rreqMap.get(rreqIdentifier);
                const currentLifeTime = this.getExpectedLifetimeFromRREQ(rreq, destAddress === this.host.address);

                const bias = destAddress === this.host.address ? 0 : this.lifetimeBias;

                if (prevLifeTime && prevLifeTime + bias >= currentLifeTime) {
                    break;
                } 

                this.rreqMap.set(rreqIdentifier, currentLifeTime);
                this.bestRreq.set(rreqIdentifier, rreq);

                // I'm the destination, must answer
                if (destAddress === this.host.address) {
                    const reversePath = [...path].reverse();
                    const [nextHop, ...rest] = reversePath;
                    const rrep = new Rrep({
                        srcAddress: this.host.address,
                        destAddress: srcAddress,
                        reversePath: rest,
                        path: [this.host.name],
                        expectedLifetime: currentLifeTime
                    });

                    //console.log(currentLifeTime);

                    if (!this.awaitingRrep.get(rreqIdentifier)) {
                        const ts = this.kernel.getSimTime();
                        this.schedule(ts + this.rrepDelay, EVENTS.SEND_RREP, rreqIdentifier);
                    }
                    this.awaitingRrep.set(rreqIdentifier, { rrep, nextHop });
                    //this.lowerLayer.receiveFromUpper(rrep, nextHop);
                    break;
                } else {
                    if (!this.scheduledRreqs.has(rreqIdentifier)) {
                        const ts = this.kernel.getSimTime();
                        this.schedule(ts + this.rreqForwardDelay, EVENTS.FORWARD_RREQ, rreqIdentifier);
                        this.scheduledRreqs.add(rreqIdentifier);
                    }
                }
                // this.lowerLayer.receiveFromUpper(rreq, ADDRESSES.BROADCAST);
                // this.numCtrlPacketsSent++;
                // this.ctrlPacketBytesSent += rreq.getSize(this.strategy);
                break;
            }

            default: {
                super.receiveFromLower(message, linkLayerSrcAddress);
            }
        }
    }

};