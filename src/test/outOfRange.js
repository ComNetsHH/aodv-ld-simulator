import Rng from 'seeded-rand';
import Kernel from '../core/Kernel';
import WirelessHost from '../modules/hosts/WirelessHost';
import RadioMedium from '../modules/RadioMedium';

const hour = 1000 * 60 * 60;

const kernel = new Kernel({
    simTime: hour * 2
});

async function main() {
    const rng = new Rng(1337);
    const radioMedium = new RadioMedium({
        delay: 10,
        radioRange: 400000,
        transmissionRate: 100000 //bps 
    });

    const receiver = new WirelessHost({
        address: '10.0.0.1',
        radioMedium,
        initialPosition: { x: 500000, y: 0 },
    });
    const sender = new WirelessHost({
        startTime: 10,
        sendInterval: 1000,
        destAddress: '10.0.0.1',
        initialPosition: { x: 0, y: 0 },
        address: '10.0.0.4',
        radioMedium
    });

    kernel.registerModule(radioMedium);
    kernel.registerModule(sender);
    kernel.registerModule(receiver);
    await kernel.run();
}

main();