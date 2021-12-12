import { EVENTS as RADIO_MEDIUM_EVENTS } from '../RadioMedium';
import AckingLinkLayer from './stack/link/AckingLinkLayer';
import Aodv from './stack/network/aodv/Aodv';
import AodvLd from './stack/network/aodv-ld/AodvLd';
import MobileHost from './MobileHost';
import Message from '../../models/Message';
import MathUtils from '../../utils/MathUtils';

const EVENTS = {
    ...RADIO_MEDIUM_EVENTS,
    OUTGOING_MESSAGE: 'OUTGOING_MESSAGE'
};

const MESSAGES = {
    DATA: 'APP_DATA'
};

export default class WirelessHost extends MobileHost {
    constructor(options) {
        super(options);
        this.name = options.name || this.constructor.name;
        this.startTime = options.startTime || 0;

        this.sendInterval = options.sendInterval;
        this.applicationStartTime = options.applicationStartTime || 0;
        this.applicationStopTime = options.applicationStopTime || 0;

        this.address = options.address;
        this.destAddress = options.destAddress;

        this.linkLayer = new AckingLinkLayer({
            ...(options.linkLayer || {}),
            address: this.address,
            host: this,
            radioMedium: options.radioMedium,
            ackTimeout: options.ackTimeout,
        });
        if (options.networkLayerType === 'AODV-LD') {
            this.networkLayer = new AodvLd({
                ...(options.networkLayer || {}),
                host: this,
                upperLayer: this,
                lowerLayer: this.linkLayer
            });
        } else {
            this.networkLayer = new Aodv({
                ...(options.networkLayer || {}),
                host: this,
                upperLayer: this,
                lowerLayer: this.linkLayer
            });
        }


        this.linkLayer.registerUpperLayer(this.networkLayer);

        this.e2eDelays = [];
        this.packetsReceived = 0;
        this.packetsSent = 0;
        this.linkBreaks = 0;
    }

    init() {
        this.kernel.registerModule(this.networkLayer);
        this.kernel.registerModule(this.linkLayer);
        if (this.sendInterval) {
            if (this.applicationStartTime < this.applicationStopTime) {
                this.schedule(this.applicationStartTime, EVENTS.OUTGOING_MESSAGE);
            }
        }
    }

    receiveFromLower(message) {
        const ts = this.kernel.getSimTime();
        const delay = ts - message.createdAt;
        this.e2eDelays.push(delay);
        this.packetsReceived++;
    }

    async onEvent(type, payload) {
        const ts = this.kernel.getSimTime();
        switch (type) {
            case EVENTS.OUTGOING_MESSAGE: {
                const message = new Message({
                    srcAddress: this.address,
                    destAddress: this.destAddress,
                    type: MESSAGES.DATA,
                    createdAt: ts
                });
                this.networkLayer.receiveFromUpper(message, this.destAddress);
                this.packetsSent++;
                const nextPacketTime = ts + this.sendInterval
                if (nextPacketTime <= this.applicationStopTime) {
                    this.schedule(nextPacketTime, EVENTS.OUTGOING_MESSAGE);
                }
                break;
            }
        }
    }

    onDestroy() {
        // console.log(`${this.constructor.name} - ${this.address}`);
        // console.group();
        // console.log(`Sent: ${this.packetsSent}`);
        // console.log(`Received: ${this.packetsReceived}`);
        // console.log(`E2E-Delay (avg): ${MathUtils.mean(this.e2eDelays) || 0}`);
        // // console.log('Position:', this.getPosition());
        // // console.log('--- Submodules ---');
        // // this.networkLayer.onDestroy();

        // console.groupEnd();

        // if (MathUtils.mean(this.e2eDelays)) {
        //     //console.log(JSON.stringify(this.e2eDelays), null, 4);
        // }
    }
}