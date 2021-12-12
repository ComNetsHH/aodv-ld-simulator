import Projector from 'ecef-projector';

const FL01 = 10000; // 10km

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

export default class PositionUtils {
    static getDistance(p1, p2) {
        if (p1.lat) {
            return PositionUtils.getDistanceFromLatLng(p1, p2);
        }

        return PositionUtils.getDistanceFromXY(p1, p2);

    }
    static getDistanceFromXY(p1, p2) {
        const {
            x: x1,
            y: y1
        } = p1;

        const {
            x: x2,
            y: y2
        } = p2;
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
    static getDistanceFromXYZ(p1, p2) {
        const {
            x: x1,
            y: y1,
            z: z1
        } = p1;

        const {
            x: x2,
            y: y2,
            z: z2
        } = p2;
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
    }
    static getDistanceFromLatLng(p1, p2) {
        const {
            lat: lat1,
            lng: lng1
        } = p1;

        const {
            lat: lat2,
            lng: lng2
        } = p2;

        return getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) * 1000;
    }

    static latLngAltToXYZ(lat, lng, alt = FL01) {
        const [x, y, z] = Projector.project(lat, lng, alt);
        return {
            x,
            y,
            z
        }
    }

    static getDistanceFromLatLngAlt(p1, p2) {
        const pKart1 = PositionUtils.latLngAltToXYZ(p1.lat, p1.lng);
        const pKart2 = PositionUtils.latLngAltToXYZ(p2.lat, p2.lng);
        return PositionUtils.getDistanceFromXYZ(pKart1, pKart2);
    }

    static getSpeed(p1, p2) {
        const deltaT = p2.t - p1.t;
        const dist = PositionUtils.getDistanceFromLatLngAlt(p1, p2);
        return dist / deltaT;
    }

    static getLinkDuration(p1, p2, v1, v2, R = 400000) {
        const {
            x: x1,
            y: y1,
            z: z1
        } = p1;
        const {
            x: x2,
            y: y2,
            z: z2
        } = p2;
        const {
            x: vx1,
            y: vy1,
            z: vz1
        } = v1;
        const {
            x: vx2,
            y: vy2,
            z: vz2
        } = v2;

        const dX = (x1 - x2);
        const dY = (y1 - y2);
        const dZ = (z1 - z2);

        const dVX = (vx1 - vx2);
        const dVY = (vy1 - vy2);
        const dVZ = (vz1 - vz2);

        const A = dVX ** 2 + dVY ** 2 + dVZ ** 2;
        const B = 2 * (dX * dVX + dY * dVY + dZ * dVZ);
        const C = dX ** 2 + dY ** 2 + dZ ** 2 - R ** 2;

        const p = B / A;
        const q = C / A;

        const t1 = -p / 2 + Math.sqrt((p / 2) ** 2 - q) || 0;
        const t2 = -p / 2 - Math.sqrt((p / 2) ** 2 - q) || 0;

        return Math.max(t1, t2, 0);

    }

    static diff(p1, p2) {
        const {
            x: x1,
            y: y1,
            z: z1
        } = p1;
        const {
            x: x2,
            y: y2,
            z: z2
        } = p2;

        return {
            x: x1 - x2,
            y: y1 - y2,
            z: z1 - z2
        };
    }

    static norm(p) {
        const { x, y, z } = p;
        return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    }
}