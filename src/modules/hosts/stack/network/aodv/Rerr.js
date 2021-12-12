import Message from '../../../../../models/Message';
import { MESSAGES } from './Aodv';

export default class Rerr extends Message {
    constructor(options) {
        super(options);
        this.unreachableList = options.unreachableList;
        this.type = MESSAGES.RERR;
    }

    copy() {
        return new Rerr({
            ...this,
            unreachableList: [...this.unreachableList]
        });
    }

    getSize() {
        return 4 + this.unreachableList.length * 8;
    }
}