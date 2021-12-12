import BaseModule from '../../../../../core/BaseModule';
import PositionUtils from '../../../../../utils/PositionUtils';
import MathUtils from '../../../../../utils/MathUtils';
import { ADDRESSES } from '../../../../../models/Message';
import Rreq from './Rreq';
import Rrep from './Rrep';
import Rerr from './Rerr';
import Hello from './Hello';

const EVENTS = {
    RREQ_TIMEOUT: 'RREQ_TIMEOUT',
    SEND_HELLO: 'SEND_HELLO',
};

export const MESSAGES = {
    RREQ: 'AODV_RREQ',
    RREP: 'AODV_RREP',
    RERR: 'AODV_RERR',
    HELLO: 'AODV_HELLO'
};

export default class Aodv extends BaseModule {
    constructor(options) {
        super(options);
        this.upperLayer = options.upperLayer;
        this.lowerLayer = options.lowerLayer;
        this.host = options.host;
        this.queue = [];
        this.helloInterval = options.helloInterval || 1000;
        this.helloStartDelay = options.helloStartDelay || 0;
        this.rreqTimeout = options.rreqTimeout || 30000;
        this.currentRreqTimeout = this.rreqTimeout;

        this.seqNo = 0;
        this.rreqsReceived = new Set();
        this.ongoingRouteDiscoveries = new Set();

        this.pathEstablishedAt = -1;
        this.pathDurations = [];

        this.numCtrlPacketsSent = 0;
        this.ctrlPacketBytesSent = 0;
        this.numDataPacketsSent = 0;
        this.dataPacketBytesSent = 0;

        this.numHelloMessagesSent = 0;

        this.pathUpdatedByLaterRrep = 0;
        this.failedRouteDiscoveries = 0;
        this.packetsDropped = 0;
        this.maxTTL = 20;
        this.currentRreqAttempts = 0;
        this.maxRreqAttempts = 200;
        // pairs desAddress, nextHop
        this.routingTable = new Map();

        this.establishedPaths = [];

        // address, firstSeenAt, lastSeenAt, position, velocity
        this.neighbors = new Map();
    }

    init() {
        if (this.helloInterval > 0) {
            this.schedule(this.host.startTime + this.helloStartDelay, EVENTS.SEND_HELLO);
        }
    }

    createRREQ(destAddress) {
        const rreq = new Rreq({
            srcAddress: this.host.address,
            destAddress,
            seqNo: this.seqNo
        });
        this.seqNo++;
        return rreq;
    }

    getNextHop(destAddress) {
        return this.routingTable.get(destAddress);
    }

    hasRoute(destAddress) {
        return !!this.getNextHop(destAddress);
    }

    async onEvent(eventType, payload) {
        const ts = this.kernel.getSimTime();
        if (ts >= this.host.applicationStopTime) {
            return;
        }
        switch (eventType) {
            case EVENTS.RREQ_TIMEOUT: {
                if (this.ongoingRouteDiscoveries.has(payload)) {
                    this.failedRouteDiscoveries++;
                    //this.currentRreqTimeout = this.currentRreqTimeout * 2;
                    this.startRouteDiscovery(payload);
                }
                break;
            }
            case EVENTS.SEND_HELLO: {
                const positionXYZ = this.host.getPositionXYZ();
                const velocityXYZ = this.host.getVelocityVectorXYZ();
                const helloMessage = new Hello({
                    srcAddress: this.host.address,
                    destAddress: ADDRESSES.BROADCAST,
                    position: positionXYZ,
                    velocity: velocityXYZ
                });

                this.lowerLayer.receiveFromUpper(helloMessage, ADDRESSES.BROADCAST);
                this.numHelloMessagesSent++
                //this.ctrlPacketBytesSent += helloMessage.getSize();
                this.schedule(ts + this.helloInterval, EVENTS.SEND_HELLO);
            }
        }
    }

    receiveFromUpper(message, destAddress) {
        if (this.hasRoute(destAddress)) {
            const nextHop = this.getNextHop(destAddress);
            this.dataPacketBytesSent += message.getSize();
            this.numDataPacketsSent++;
            this.lowerLayer.receiveFromUpper(message, nextHop);
            return;
        }
        if (this.ongoingRouteDiscoveries.has(destAddress)) {
            this.queue.push(message);
            return;
        }

        this.queue.push(message);
        this.startRouteDiscovery(message.destAddress);

    }
    startRouteDiscovery(destAddress) {
        if (this.currentRreqAttempts > this.maxRreqAttempts) {
            return;
        }
        this.currentRreqAttempts++;
        const rreq = this.createRREQ(destAddress);

        this.lowerLayer.receiveFromUpper(rreq, ADDRESSES.BROADCAST);
        this.numCtrlPacketsSent++;
        this.ctrlPacketBytesSent += rreq.getSize(this.strategy);

        if (!this.ongoingRouteDiscoveries.has(destAddress)) {
            this.ongoingRouteDiscoveries.add(destAddress);
        }
        this.schedule(
            this.kernel.getSimTime() + this.currentRreqTimeout,
            EVENTS.RREQ_TIMEOUT,
            destAddress
        );
    }

    receiveFromLower(message, linkLayerSrcAddress) {
        const { type } = message;

        switch (type) {
            case MESSAGES.RREQ: {
                const rreq = message.copy();
                const {
                    srcAddress,
                    destAddress,
                    seqNo,
                    path
                } = rreq;

                if (path.length > this.maxTTL) {
                    break
                }

                const rreqIdentifier = `${srcAddress}-${seqNo}`;
                if (srcAddress === this.host.address || this.rreqsReceived.has(rreqIdentifier)) {
                    break;
                }

                this.rreqsReceived.add(rreqIdentifier);
                rreq.addHop(linkLayerSrcAddress);

                // I'm the destination, must answer
                if (destAddress === this.host.address) {
                    const reversePath = path.reverse();
                    const [nextHop, ...rest] = reversePath;

                    const rrep = new Rrep({
                        resolvedAddress: this.host.address,
                        srcAddress: this.host.address,
                        destAddress: srcAddress,
                        reversePath: rest,
                        path: [this.host.name]
                    });
                    this.lowerLayer.receiveFromUpper(rrep, nextHop);
                    this.numCtrlPacketsSent++;
                    this.ctrlPacketBytesSent += rrep.getSize();
                    break;
                }

                // rebroadcast original rreq
                this.lowerLayer.receiveFromUpper(rreq, ADDRESSES.BROADCAST);
                this.numCtrlPacketsSent++;
                this.ctrlPacketBytesSent += rreq.getSize(this.strategy);
                break;
            }

            case MESSAGES.RREP: {
                const rrep = message.copy();
                const {
                    srcAddress,
                    destAddress,
                    reversePath,
                } = rrep;
                rrep.addHop(this.host.address);

                const [nextHop] = reversePath;
                if (this.getNextHop(srcAddress) !== linkLayerSrcAddress) {
                    // Paths are updated by later arriving RREPS.
                    // This is a good thing since old paths are refreshed for free
                    // It throws off the measurements though
                    // this.pathEstablishedAt = this.kernel.getSimTime();

                    if (this.pathEstablishedAt < 0) {
                        //this.pathEstablishedAt = this.kernel.getSimTime();
                    }
                    this.pathUpdatedByLaterRrep++;
                }

                if (!this.hasRoute(srcAddress)) {
                    this.establishedPaths.push({
                        ts: this.kernel.getSimTime(),
                        expectedLifetime: rrep.expectedLifetime,
                        path: rrep.path
                    });
                }
                this.routingTable.set(srcAddress, linkLayerSrcAddress);
                if (nextHop) {
                    // We dont need to have a reverse path set up in the routing tables
                    // this.routingTable.set(destAddress, nextHop);
                }
                rrep.removeHop(nextHop);

                if (destAddress === this.host.address) {
                    if (!this.ongoingRouteDiscoveries.has(srcAddress)) {
                        break;
                    }
                    this.pathEstablishedAt = this.kernel.getSimTime();
                    this.ongoingRouteDiscoveries.delete(srcAddress);
                    this.queue.forEach(m => {
                        const nextHop = this.getNextHop(m.destAddress);
                        this.lowerLayer.receiveFromUpper(m, nextHop);
                        this.numDataPacketsSent++;
                        this.dataPacketBytesSent += m.getSize();
                    });
                    this.queue = [];
                    break;
                }

                this.lowerLayer.receiveFromUpper(rrep, nextHop);
                this.numCtrlPacketsSent++;
                this.ctrlPacketBytesSent += rrep.getSize();
                break;
            }

            case MESSAGES.RERR: {
                const rerr = message.copy();

                const {
                    srcAddress,
                    unreachableList
                } = rerr;

                if (srcAddress === this.host.address) {
                    break;
                }

                let shouldForward = false;

                unreachableList.forEach(unreachable => {
                    const nextHop = this.routingTable.get(unreachable);
                    if (nextHop && nextHop === linkLayerSrcAddress) {
                        this.routingTable.delete(unreachable);
                        shouldForward = true;
                    }
                });

                if (shouldForward) {
                    this.lowerLayer.receiveFromUpper(rerr, ADDRESSES.BROADCAST);
                    this.numCtrlPacketsSent++;
                    this.ctrlPacketBytesSent += rerr.getSize();
                    if (this.pathEstablishedAt > 0) {
                        const pathDuration = this.kernel.getSimTime() - this.pathEstablishedAt;
                        this.pathDurations.push(pathDuration);
                        this.pathEstablishedAt = -1;
                    }
                }
                break;
            }

            case MESSAGES.HELLO: {
                const {
                    srcAddress,
                    position,
                    velocity
                } = message;
                const ts = this.kernel.getSimTime();
                const entry = this.neighbors.get(srcAddress);

                if (!entry) {
                    this.neighbors.set(srcAddress, {
                        firstSeenAt: ts,
                        lastSeenAt: ts,
                        position,
                        velocity
                    });
                    break;
                }
                this.neighbors.set(srcAddress, {
                    firstSeenAt: (ts - entry.lastSeenAt) > 3 * this.helloInterval ? ts : entry.firstSeenAt,
                    lastSeenAt: ts,
                    velocity,
                    position
                });
                break;
                //console.log(this.host.address, "HELLO!")
            }

            default: {
                if (message.destAddress === this.host.address) {
                    this.upperLayer.receiveFromLower(message);
                    break;
                }
                const nextHop = this.getNextHop(message.destAddress);
                if (nextHop) {
                    this.lowerLayer.receiveFromUpper(message, nextHop);
                    this.numDataPacketsSent++;
                    this.dataPacketBytesSent += message.getSize();
                    break;
                }
                if (message.type === MESSAGES.RREP) {
                    throw "RREP dropped";
                }
                // We must drop it
                this.packetsDropped++;
            }
        }
    }

    reportLinkBreak(linkDestAddress) {
        const unreachableList = [];
        this.routingTable.forEach((nextHop, dest) => {
            if (nextHop === linkDestAddress) {
                unreachableList.push(dest);
            }
        });

        if (unreachableList.length === 0) {
            return;
        }

        const rerr = new Rerr({
            srcAddress: this.host.address,
            destAddress: ADDRESSES.BROADCAST,
            unreachableList
        });

        this.lowerLayer.receiveFromUpper(rerr, ADDRESSES.BROADCAST);
        this.numCtrlPacketsSent++;
        this.ctrlPacketBytesSent += rerr.getSize();
        unreachableList.forEach(dest => this.routingTable.delete(dest));
        if (this.pathEstablishedAt > 0) {
            const pathDuration = this.kernel.getSimTime() - this.pathEstablishedAt;
            this.pathDurations.push(pathDuration);
            const p = this.host.getPosition();
            this.pathEstablishedAt = -1;
        }
    }


    onDestroy() {
        // console.log(`${this.constructor.name} - ${this.host.address}`);
        // console.group();
        // console.log(`Failed Route Discoveries: ${this.failedRouteDiscoveries}`);
        // console.log(`Queue Size: ${this.queue.length}`);
        // console.log(`PathDurations (avg): ${MathUtils.mean(this.pathDurations) || 0}`);
        // //console.log(this.pathDurations);
        // console.groupEnd();
    }


}