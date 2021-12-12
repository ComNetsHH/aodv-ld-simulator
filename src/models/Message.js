import { v4 as uuid } from 'uuid';

export const ADDRESSES = {
    BROADCAST: 'BROADCAST'
};

export default class Message {
    constructor({ srcAddress, destAddress, payload, type, id, createdAt, size }) {
        this.srcAddress = srcAddress;
        this.destAddress = destAddress;
        this.payload = payload;
        this.type = type;
        this.createdAt = createdAt;
        this.id = id || uuid();
        this.size = size;
    }

    copy() {
        return new Message({ ...this });
    }

    getSize(type = 'BYTE') {
        return this.size || 100;
    }
}