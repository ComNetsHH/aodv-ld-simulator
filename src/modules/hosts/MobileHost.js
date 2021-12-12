import BaseModule from '../../core/BaseModule';
import PositionUtils from '../../utils/PositionUtils';

export default class MobileHost extends BaseModule {
    constructor(options) {
        super(options);
        this.initialPosition = options.initialPosition;
        this.trajectory = options.trajectory;
        if(this.trajectory) {
            this.tMax = this.trajectory[this.trajectory.length - 1].t
            this.tMin = this.trajectory[0].t
        }
    }

    getPositionXYZ() {
        const p = this.getPosition();
        return PositionUtils.latLngAltToXYZ(p.lat, p.lng);
    }

    getVelocityVectorXYZ() {
        if(!this.trajectory) {
            return {
                x:0,
                y:0,
                z:0,
            }
        }
        const ts = this.kernel.getSimTime();
        const refTime = Math.max(this.tMin +1, ts - 60000 * 10);
        const lastPosition = this.getPositionAtMoment(refTime);
        const currentPosition = this.getPosition();
        const lastPosKart = PositionUtils.latLngAltToXYZ(lastPosition.lat, lastPosition.lng);
        const currentPosKart = PositionUtils.latLngAltToXYZ(currentPosition.lat, currentPosition.lng);

        const diffVector = PositionUtils.diff(currentPosKart, lastPosKart);
        const deltaT = ts - refTime;

        return {
            x: diffVector.x / deltaT,
            y: diffVector.y / deltaT,
            z: diffVector.z / deltaT
        };
    }

    getPosition() {
        if (!this.trajectory) {
            return this.initialPosition;
        }
        const ts = this.kernel.getSimTime();
        return this.getPositionAtMoment(ts);
    }

    getFinalPosition() {
        if (!this.trajectory) {
            return this.initialPosition;
        }
        const ts = this.kernel.getSimTime();
        const tMax = this.trajectory[this.trajectory.length - 1].t;
        if (ts >= tMax) {
            return this.trajectory[this.trajectory.length - 1];
        }
        return this.getPositionAtMoment(ts);

    }

    getPositionAtMoment(ts) {
        if (!this.trajectory) {
            return this.initialPosition;
        }
        if (ts > this.tMax || ts < this.tMin) {
            //console.log(Object.keys(this).map(key => this[key]));
            console.log(this.tMax, this.tMin, ts, this.startTime, this.endTime, this.linkLayer.isActive())
            throw "ERROR";
        }
        const nextPositionIndex = this.trajectory.findIndex(v => v.t >= ts);
        const prevPositionIndex = nextPositionIndex - 1;
        const prevPosition = this.trajectory[prevPositionIndex];
        const nextPosition = this.trajectory[nextPositionIndex];

        if (nextPosition.t === ts) {
            return nextPosition;
        }
        
        const timeDiff = nextPosition.t - prevPosition.t;
        const deltaT = ts - prevPosition.t;

        const scale = deltaT / timeDiff

        const diff = {
            x: nextPosition.x - prevPosition.x,
            y: nextPosition.y - prevPosition.y,
            lat: nextPosition.lat - prevPosition.lat,
            lng: nextPosition.lng - prevPosition.lng
        }

        return {
            x: prevPosition.x + diff.x * scale,
            y: prevPosition.y + diff.y * scale,
            lat: prevPosition.lat + diff.lat * scale,
            lng: prevPosition.lng + diff.lng * scale
        }
    }

}