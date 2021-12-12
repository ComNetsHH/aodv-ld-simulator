import Message from '../../../../../models/Message';
import { MESSAGES } from './Aodv';

export default class Rrep extends Message {
    constructor(options) {
        super(options);
        this.seqNo = options.seqNo;
        this.type = MESSAGES.RREP;
        this.reversePath = options.reversePath || [];
        this.path = options.path || [];
        this.expectedLifetime = options.expectedLifetime || 0;
        this.size = 20;
    }

    addHop(hop) {
        this.path.push(hop);
    }

    removeHop(address) {
        this.reversePath = this.reversePath.filter(h => h !== address);
    }

    copy() {
        return new Rrep({
            ...this,
            reversePath: [...this.reversePath],
            path: [...this.path]
        });
    }
}