import PositionUtils from '../utils/PositionUtils';
import MathUtils from '../utils/MathUtils';
import TrajectoryService from '../services/TrajectoryService';

const radioRange = 400000;

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

function getDistance(trajectories, key1, key2, ts) {
    const p1 = getPosition(trajectories, key1, ts);
    const p2 = getPosition(trajectories, key2, ts);


    return PositionUtils.getDistanceFromLatLng(p1, p2);
}


function pathExists(trajectories, path, ts) {
    for (let i = 1; i < path.length; i++) {
        try {
            const dist = getDistance(trajectories, path[i - 1], path[i], ts / 1000);
            if (dist > radioRange) {
                //console.log(path[i - 1], path[i]);
                return false;
            }
        } catch (error) {
            return false;
        }

    }

    return true;
}

async function main(name, trajectories, establishedPaths) {
    const deltaT = 1000 * 1;
    let tMin = 0;
    let tMax = 1000 * 60 * 60 * 4; // half an hour
    const pathDurations = [];
    const errors = [];
    let activePaths = [];

    for (let t = 0; t <= tMax; t += deltaT) {
        activePaths = activePaths.filter(p => {
            if (!pathExists(trajectories, p.path, t)) {
                const duration = t-p.ts;
                pathDurations.push(duration);
                errors.push((p.expectedLifetime - duration));
                //console.log((p.expectedLifetime - duration), duration)
                return false;
            };
            return true;
        });

        const newPaths = establishedPaths.filter(p => p.ts >= t && p.ts < t + deltaT);
        activePaths = [...newPaths, ...activePaths];
    }
    console.log(name, establishedPaths.length, MathUtils.mean(pathDurations) / 1000)
    // console.log(Math.min(...pathDurations))
    console.log(JSON.stringify(pathDurations))
    console.log('\n')

    // const expectedPathDurations = establishedPaths.map(e => e.expectedLifetime);
    // console.log(JSON.stringify(expectedPathDurations))
    // console.log('\n')
    // console.log(JSON.stringify(errors))
    //console.log(MathUtils.mean(expectedPathDurations) / 1000)
}

const trajectoriesEast = TrajectoryService.getTrajectories('east', 0);
const trajectoriesWest = TrajectoryService.getTrajectories('west', 0);
const establishedPathsAODVLDD = require('../../results/v001/east/aodv-ld-d/establishedPaths-2h-0.json');

//const establishedPathsAODV = require('../../results/v001/east/aodv/establishedPaths-2h-0.json');

//console.log(establishedPathsAODV)
//main('AODV', trajectoriesEast, establishedPathsAODV);
main('AODV-LD-D', trajectoriesEast, establishedPathsAODVLDD);