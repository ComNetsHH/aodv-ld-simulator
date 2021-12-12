import fs from 'fs';
import PositionUtils from './PositionUtils';

const IGWs = [{
    "name": "Shannon Airport",
    "key": "IGW_SHANNON",
    "pos": {
        "lat": 52.6996573,
        "lng": -8.9168798
    }
},
{
    "name": "Gander Airport",
    "key": "IGW_GANDER",
    "pos": {
        "lat": 48.9418259,
        "lng": -54.5681016
    }
},
{
    "name": "Labrador",
    "key": "IGW_LABRADOR",
    "pos": {
        "lat": 54.50,
        "lng": -57.10
    }
},
{
    "name": "Scotland",
    "key": "IGW_SCOTLAND",
    "pos": {
        "lat": 57.55,
        "lng": -7.55
    }
}];

const interpolate = (trajectory, ts) => {
    const nextPositionIndex = trajectory.findIndex(v => v.t >= ts);
    const prevPositionIndex = nextPositionIndex - 1;
    const prevPosition = trajectory[prevPositionIndex];
    const nextPosition = trajectory[nextPositionIndex];

    const timeDiff = nextPosition.t - prevPosition.t;
    const deltaT = ts - prevPosition.t;

    const scale = deltaT / timeDiff

    const diff = {
        lat: nextPosition.lat - prevPosition.lat,
        lng: nextPosition.lng - prevPosition.lng
    }

    return {
        lat: prevPosition.lat + diff.lat * scale,
        lng: prevPosition.lng + diff.lng * scale
    }
}

const getPosition = (trajectories, key, ts) => {
    if (key.includes('IGW')) {
        const igw = IGWs.find(i => i.key === key);
        return igw.pos;
    }
    const idx = Number(key.split('-')[1]);
    return interpolate(trajectories[idx], ts);
}

const getDistance = (trajectories, key1, key2, ts) => {
    const p1 = getPosition(trajectories, key1, ts);
    const p2 = getPosition(trajectories, key2, ts);
    return PositionUtils.getDistanceFromLatLng(p1, p2);
}

const getBrokenLink = (trajectories, path, ts, radioRange) => {
    for (let i = 1; i < path.length; i++) {
        try {
            const dist = getDistance(trajectories, path[i - 1], path[i], ts / 1000);
            if (dist > radioRange) {
                return `${path[i - 1]}-${path[i]}`;
            }
        } catch (error) {
            //console.log(error)
            return `${path[i - 1]}-${path[i]}`;
        }

    }
    return true;
}


const pathExists = (trajectories, path, ts, radioRange) => {
    for (let i = 1; i < path.length; i++) {
        try {
            const dist = getDistance(trajectories, path[i - 1], path[i], ts / 1000);
            if (dist > radioRange) {
                return false;
            }
        } catch (error) {
            //console.log(error)
            return false;
        }

    }
    return true;
}

export default class ResultUtils {
    static createDirectory(dir) {
        fs.mkdirSync(dir, { recursive: true });
    }

    static appendToFile(path, data) {
        fs.appendFileSync(path, data);
    }

    static writeFile(path, data) {
        fs.writeFileSync(path, JSON.stringify(data, null, 4));
    }

    static writeFileUnformatted(path, data) {
        fs.writeFileSync(path, JSON.stringify(data));
    }

    static getPathDurations({ radioRange, trajectories, establishedPaths, simTime }) {
        const completePathDurations = [];
        const deltaT = 1000 * 1;
        let tMin = 0;
        let tMax = simTime || 5 * 3600 * 1000;
        const pathDurations = [];
        const errors = [];
        let activePaths = [];
        let brokenA2A = 0;
        let brokenA2G = 0;

        for (let t = tMin; t <= tMax; t += deltaT) {
            activePaths = activePaths.filter(p => {
                if (!pathExists(trajectories, p.path, t, radioRange)) {
                    const duration = t - p.ts;
                    const brokenLink = getBrokenLink(trajectories, p.path, t, radioRange);
                    completePathDurations.push({
                        ...p,
                        duration,
                        brokenLink
                    });
                    if (brokenLink.includes('IGW')) {
                        brokenA2G++;
                    } else {
                        brokenA2A++;
                    }
                    pathDurations.push(duration);
                    errors.push((p.expectedLifetime - duration));
                    return false;
                };
                return true;
            });

            const newPaths = establishedPaths.filter(p => p.ts >= t && p.ts < t + deltaT);
            activePaths = [...newPaths, ...activePaths];
        }

        const expectedPathDurations = establishedPaths.map(e => e.expectedLifetime);

        return {
            expectedPathDurations,
            pathDurations,
            completePathDurations,
            errors,
            brokenA2A,
            brokenA2G
        }
    }
}