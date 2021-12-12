import Message from '../../../../../models/Message';
import { MESSAGES } from './Aodv';

export default class Rreq extends Message {
    constructor(options) {
        super(options);
        this.seqNo = options.seqNo;
        this.type = MESSAGES.RREQ;
        this.path = options.path || [];
        this.size = 24;
    }

    addHop(address) {
        this.path.push(address);
    }

    copy() {
        return new Rreq({ 
            ...this,
            path: [...this.path]
         });
    }
}