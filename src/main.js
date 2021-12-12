import { spawn } from 'child_process';
import moment from 'moment';

let handle = 0;
const scripts = [
    './src/scenarios/nacEast.js',
    './src/scenarios/nacWest.js',
    './src/scenarios/nacEastAodvLdS.js',
    './src/scenarios/nacWestAodvLdS.js',
    './src/scenarios/nacEastAodvLdD.js',
    './src/scenarios/nacWestAodvLdD.js'
];
const durations = [4];
const days = [...Array(100).keys()].map(i => i);
//const days = [0]

let activeRuns = 0;
let runIdx = 0;
const MAX_RUNS = 14;

const runs = [];
durations.forEach(d => {
    days.forEach(day => {
        scripts.forEach(s => runs.push([s, d, day]))
    });
});

function monitor() {
    console.log(`Running ${runIdx} of ${runs.length}, Currently active: ${activeRuns}`)
    if (runIdx === runs.length) {
        //all runs started
        if (activeRuns === 0) {
            clearInterval(handle)
        }
    } else {
        while (activeRuns < MAX_RUNS && runIdx < runs.length) {
            const onExit = () => activeRuns--;
            const process = spawn('npx', ['babel-node', ...(runs[runIdx])]);
            process.on('exit', onExit);
            process.on('error', (error) => console.log('Error', error));
            process.stdout.on('data', data => console.log(moment().format('LLL'), `${data}`));
            process.stderr.on('data', data => console.log(moment().format('LLL'), `${data}`));
            runIdx++;
            activeRuns++;
        }
    }
}

async function main() {
    monitor();
    handle = setInterval(monitor, 10000);
}

main();