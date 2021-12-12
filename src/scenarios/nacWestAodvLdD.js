import Rng from 'seeded-rand';
import Kernel from '../core/Kernel';
import WirelessHost from '../modules/hosts/WirelessHost';
import RadioMedium from '../modules/RadioMedium';
import MathUtils from '../utils/MathUtils';
import ResultUtils from '../utils/ResultUtils';
import TrajectoryService from '../services/TrajectoryService';
import { STRATEGIES } from '../modules/hosts/stack/network/aodv-ld/AodvLd';
import config from './config.json';

const hour = 1000 * 60 * 60;
const hours = Number(process.argv[2]) || 0;
const simTime =  hour * hours

const day = Number(process.argv[3]) || 0;
const trajectories = TrajectoryService.getTrajectories('west', day);

const kernel = new Kernel({
    simTime
});

const {
    transmissionRate,
    rreqTimeout,
    helloInterval,
    radioRange,
    sendInterval,
    startTime
} = config;

const linkLayerOptions = {
    transmissionRate
};
const networkLayerOptions = {
    radioRange,
    radioRange,
    helloInterval,
    helloStartDelay: 0,
    rreqTimeout,
    strategy: STRATEGIES.DETERMINISTIC
};

async function main() {
    const rng = new Rng(1337);
    const radioMedium = new RadioMedium({
        radioRange,
        transmissionRate
    });
    const igwAmerica = new WirelessHost({
        address: '10.0.0.1',
        radioMedium,
        networkLayerType: 'AODV-LD',
        applicationStopTime: simTime,
        name: 'IGW_LABRADOR',
        initialPosition: {
            lat: 54.50,
            lng: -57.10
        },
        networkLayer: networkLayerOptions,
        linkLayer: linkLayerOptions

    });
    const igwEurope = new WirelessHost({
        address: '10.0.0.1',
        radioMedium,
        networkLayerType: 'AODV-LD',
        applicationStopTime: simTime,
        name: 'IGW_SCOTLAND',
        initialPosition: {
            lat: 57.55,
            lng: -7.55
        },
        networkLayer: networkLayerOptions,
        linkLayer: linkLayerOptions
    });
    const hosts = trajectories.map((t, i) => new WirelessHost({
        address: `ac-${i}`,
        trajectory: t.map(p => ({ ...p, t: p.t * 1000 })),
        radioMedium,
        networkLayerType: 'AODV-LD',
        applicationStartTime: Math.max(t[0].t * 1000 + rng.inRange(1, sendInterval), startTime + rng.inRange(1, sendInterval)),
        applicationStopTime: t[t.length-1].t * 1000,
        startTime: t[0].t * 1000,
        sendInterval,
        destAddress: '10.0.0.1',
        networkLayer: {
            ...networkLayerOptions,
            helloStartDelay: rng.inRange(0, helloInterval)
        },
        linkLayer: linkLayerOptions
    }));

    hosts.forEach(h => kernel.registerModule(h));
    kernel.registerModule(radioMedium);
    kernel.registerModule(igwEurope);
    kernel.registerModule(igwAmerica);

    const resultDir = `./results/v${config.version}/west/aodv-ld-d`;
    ResultUtils.createDirectory(resultDir);
    kernel.setLogFile(`${resultDir}/progress-${hours}h-${day}.log`);

    try {
        await kernel.run();
    } catch (error) {
        console.log(error);
    }

    /* =============== Results =============== */
    let totalPacketsSent = 0;
    let totalPacketsReceived = igwAmerica.packetsReceived + igwEurope.packetsReceived;
    let queuedPackets = 0;
    let pathUpdates = 0;
    let establishedPaths = [];

    let numCtrlPackets = 0;
    let numDataPackets = 0;
    let ctrlPacketBytes = 0;
    let dataPacketBytes = 0;
    let numHelloMessages = 0;

    const linkDurationsA2A = [];
    const linkDurationsA2G = [];

    const e2eDelays = [...igwAmerica.e2eDelays, ...igwEurope.e2eDelays];
    establishedPaths = [...igwAmerica.networkLayer.establishedPaths, ...igwEurope.networkLayer.establishedPaths];

    hosts.forEach(h => {
        totalPacketsSent += h.packetsSent;
        totalPacketsReceived += h.packetsReceived;
        queuedPackets += h.networkLayer.queue.length;
        pathUpdates += h.networkLayer.pathUpdatedByLaterRrep;
        establishedPaths = [...establishedPaths, ...h.networkLayer.establishedPaths];
    });

    [igwAmerica, igwEurope, ...hosts].forEach(h => {
        h.networkLayer.neighbors.forEach((value, key)=> {
            const {
                firstSeenAt,
                lastSeenAt,
            } = value;
            if(simTime - lastSeenAt < 3 * helloInterval) {
                return;
            }
            const duration = lastSeenAt - firstSeenAt;
            if(h.address === igwEurope.address || key === igwEurope.address ) {
                linkDurationsA2G.push(duration);
            }
            linkDurationsA2A.push(duration);
        });

        numCtrlPackets += h.networkLayer.numCtrlPacketsSent;
        numDataPackets += h.networkLayer.numDataPacketsSent;
        ctrlPacketBytes += h.networkLayer.ctrlPacketBytesSent;
        dataPacketBytes += h.networkLayer.dataPacketBytesSent;

        numHelloMessages += h.networkLayer.numHelloMessagesSent;

    });

    const { pathDurations, expectedPathDurations, completePathDurations, errors, brokenA2A, brokenA2G } = ResultUtils.getPathDurations({ radioRange, trajectories, establishedPaths, simTime: 5 * hour });

    ResultUtils.writeFile(`${resultDir}/summary-${hours}h-${day}.json`, {
        description: 'Westbound, AODV-LD, deterministic',
        config,
        stats: kernel.getStats(),
        packetsReceived: totalPacketsReceived,
        packetsSent: totalPacketsSent,
        pdr: totalPacketsReceived / totalPacketsSent,
        plr: (totalPacketsSent - queuedPackets - totalPacketsReceived) / totalPacketsSent,
        queuedPackets,
        avgDelay: MathUtils.mean(e2eDelays),
        avgPathDuration: MathUtils.mean(pathDurations),
        avgExpectedPathDuration: MathUtils.mean(expectedPathDurations),
        pathUpdates,
        avgLinkDurationsA2A: MathUtils.mean(linkDurationsA2A),
        avgLinkDurationsA2G: MathUtils.mean(linkDurationsA2G),
        numCtrlPackets,
        numDataPackets,
        ctrlPacketBytes,
        dataPacketBytes,
        numHelloMessages,
        brokenA2A, 
        brokenA2G
    });
    ResultUtils.writeFileUnformatted(`${resultDir}/e2eDelays-${hours}h-${day}.json`, e2eDelays);
    ResultUtils.writeFileUnformatted(`${resultDir}/establishedPaths-${hours}h-${day}.json`, establishedPaths);
    ResultUtils.writeFileUnformatted(`${resultDir}/completeEstablishedPaths-${hours}h-${day}.json`, completePathDurations);
    ResultUtils.writeFileUnformatted(`${resultDir}/linkDurationsA2A-${hours}h-${day}.json`, linkDurationsA2A);
    ResultUtils.writeFileUnformatted(`${resultDir}/linkDurationsA2G-${hours}h-${day}.json`, linkDurationsA2G);
    ResultUtils.writeFileUnformatted(`${resultDir}/pathDurations-${hours}h-${day}.json`, pathDurations);
    ResultUtils.writeFileUnformatted(`${resultDir}/expectedPathDurations-${hours}h-${day}.json`, expectedPathDurations);
    ResultUtils.writeFileUnformatted(`${resultDir}/estimationErrors-${hours}h-${day}.json`, errors);

}

main();