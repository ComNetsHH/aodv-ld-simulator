import Message from '../../../../../models/Message';
import { MESSAGES } from './Aodv';

export default class Hello extends Message {
    constructor(options) {
        super(options);
        this.type = MESSAGES.HELLO;
        this.size = 20;
        this.position = options.position;
        this.velocity = options.velocity;
    }

    copy() {
        return new Hello({
            ...this
        });
    }
}