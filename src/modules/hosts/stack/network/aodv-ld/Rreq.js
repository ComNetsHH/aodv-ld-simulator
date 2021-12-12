import BaseRreq from '../aodv/Rreq';

export default class Rreq extends BaseRreq {
    constructor(options) {
        super(options);

        this.positions = options.positions || [];
        this.velocities = options.velocities || [];
        this.linkDurations = options.linkDurations || [];
    }

    addMobilityInfo(p, v) {
        this.positions.push(p);
        this.velocities.push(v)
    }

    addLinkDuration(ld) {
        this.linkDurations.push(ld)
    }

    copy() {
        return new Rreq({
            ...this,
            path: [...this.path],
            positions: [...this.positions],
            velocities: [...this.velocities],
            linkDurations: [...this.linkDurations]
        });
    }

    getSize(type) {
        if(type == 'AODV_LD_S') {
            return this.size + this.linkDurations.length * 1;
        }

        if(type == 'AODV_LD_D') {
            return this.size + this.positions.length * 1 * 6;
        }
    }

}