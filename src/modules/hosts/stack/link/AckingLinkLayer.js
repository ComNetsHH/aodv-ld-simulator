import BaseModule from '../../../../core/BaseModule';
import Message, { ADDRESSES } from '../../../../models/Message';

const EVENTS = {
    ACK_TIMEOUT: 'ACK_TIMEOUT',
    ON_RECEIVE: 'ON_RECEIVE',
    ON_SEND_COMPLETE: 'ON_SEND_COMPLETE'
};

const MESSAGES = {
    ACK: 'LL_ACK',
    DATA: 'LL_DATA'
};


const TRANSMITTER_STATES = {
    IDLE: 'TX_IDLE',
    BUSY: 'TX_BUSY',
}

export default class AckingLinkLayer extends BaseModule {
    constructor(options) {
        super(options)
        this.ackTimeout = options.ackTimeout || 100;
        this.transmissionRate = options.transmissionRate || 100000;
        this.radioMedium = options.radioMedium;
        this.address = options.address;
        this.host = options.host;
        this.upperLayer = options.upperLayer;
        this.inFlightMessages = [];
        this.packetsSent = 0;
        this.packetsReceived = 0;
        this.queue = [];
        this.txState = TRANSMITTER_STATES.IDLE;
    }

    init() {
        this.radioMedium.registerHost(this);
    }

    getPosition() {
        return this.host.getPosition();
    }

    isActive() {
        const ts = this.kernel.getSimTime();
        return (ts >= this.host.startTime) && (ts <= this.host.applicationStopTime);
    }

    registerUpperLayer(upperLayer) {
        this.upperLayer = upperLayer;
    }

    receiveFromUpper(message, destAddress) {
        const linkLayerMessage = new Message({
            srcAddress: this.address,
            destAddress,
            type: MESSAGES.DATA,
            payload: message,
        });
        if (this.txState === TRANSMITTER_STATES.IDLE) {
            this.transmit(linkLayerMessage);
        } else {
            this.queue.push(linkLayerMessage);
        }
    }

    transmit(message) {
        const ts = this.kernel.getSimTime();
        this.packetsSent++;
        this.radioMedium.transmit(this, message);
        this.txState = TRANSMITTER_STATES.BUSY;
        if (message.destAddress !== ADDRESSES.BROADCAST) {
            this.inFlightMessages.push(message);
            this.schedule(ts + this.ackTimeout, EVENTS.ACK_TIMEOUT, message);
        }

        const transmissionDelay = (message.getSize() * 8 / this.transmissionRate)  * 1000; // ms
        this.schedule(ts + transmissionDelay, EVENTS.ON_SEND_COMPLETE);
    }

    transmitUnacked(message) {
        this.radioMedium.transmit(this, message);        
    }

    async onEvent(eventType, message = {}) {
        const {
            destAddress,
            type,
            id,
            srcAddress,
            payload: encapsulatedMessage,
        } = message;

        switch (eventType) {
            case EVENTS.ON_RECEIVE: {
                if (destAddress !== ADDRESSES.BROADCAST && destAddress !== this.address) {
                    return;
                }
                if (type === MESSAGES.ACK) {
                    const ackedMessageId = message.payload;
                    this.inFlightMessages = this.inFlightMessages.filter(m => m.id !== ackedMessageId);
                } else {
                    this.packetsReceived++;
                    this.upperLayer.receiveFromLower(encapsulatedMessage, srcAddress);

                    if (destAddress !== ADDRESSES.BROADCAST) {
                        this.transmitUnacked(new Message({
                            srcAddress: this.address,
                            destAddress: srcAddress,
                            type: MESSAGES.ACK,
                            payload: id
                        }));
                    }
                }
                break;
            }

            case EVENTS.ACK_TIMEOUT: {
                if (this.inFlightMessages.some(m => m.id === id)) {
                    this.upperLayer.reportLinkBreak(destAddress);
                }

                this.inFlightMessages = this.inFlightMessages.filter(m => m.id !== id);
                break;
            }

            case EVENTS.ON_SEND_COMPLETE: {
                if (this.queue.length == 0) {
                    this.txState = TRANSMITTER_STATES.IDLE;
                    break;
                }
                const [msg, ...rest] = this.queue;
                this.queue = rest;
                this.transmit(msg);
            }
        }
    }
}