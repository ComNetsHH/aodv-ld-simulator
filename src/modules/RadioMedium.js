import BaseModule from '../core/BaseModule';
import PositionUtils from '../utils/PositionUtils';
import {ADDRESSES} from '../models/Message';

export const EVENTS = {
    DELIVER_MESSAGE: 'DELIVER_MESSAGE'
};

export default class RadioMedium extends BaseModule {
    constructor(options) {
        super(options);
        const { delay, radioRange } = options;
        this.delay = delay;
        this.radioRange = radioRange;
        this.transmissionRate = options.transmissionRate;
        this.propagationSpeed = 299792458; // m/s
        this.hosts = [];


        this.transmissions = 0;
    }

    init() {
        super.init();
    }

    registerHost(host) {
        this.hosts.push(host);
    }

    transmit(source, message) {
        if(!source.isActive()) {
            console.log(source.host.name,this.kernel.getSimTime());
            //console.log(message);
            // throw "ERROR, whats happening here?"
            // Stop shut down modules from transmitting
            return;
        }
        const startPosition = source.getPosition();
        const ts = this.kernel.getSimTime();

        const availableHosts = this.hosts.filter(h => h.isActive());

        for (let i = 0; i < availableHosts.length; i++) {
            const host = availableHosts[i];

            const dist = PositionUtils.getDistance(startPosition, host.getPosition());
            if(host.id === source.id) {
                continue;
            }

            if (dist > this.radioRange) {
                continue;
            }
            const propagationDelay = (dist / this.propagationSpeed)* 1000; // ms
            const transmissionDelay = (message.getSize() * 8 / this.transmissionRate)  * 1000; // ms
            const delay = propagationDelay + transmissionDelay;

            
            this.schedule(ts + delay, EVENTS.DELIVER_MESSAGE, {
                message,
                dest: host
            });
            this.transmissions++;

        }
    }

    async onEvent(eventType, payload) {
        switch (eventType) {
            case EVENTS.DELIVER_MESSAGE: {
                const {
                    dest,
                    message
                } = payload;

                await dest.onEvent('ON_RECEIVE', message);
                break;
            }

            default: {
                super.onEvent(eventType, payload);
            }

        }
    }
}