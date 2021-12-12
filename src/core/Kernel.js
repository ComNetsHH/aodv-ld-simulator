import { v4 as uuid } from 'uuid';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';
import ResultUtils from '../utils/ResultUtils';

const getMin = arr => arr.reduce((min, v) => min <= v ? min : v, Infinity);

const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: "shortEn",
    languages: {
        shortEn: {
            y: () => "y",
            mo: () => "mo",
            w: () => "w",
            d: () => "d",
            h: () => "h",
            m: () => "m",
            s: () => "s",
            ms: () => "ms",
        },
    },
});
export default class Kernel {
    constructor(options) {
        this.simTime = options.simTime;
        this.ts = 0;
        this.eventQueue = [];
        this.modules = new Map();
        this.eventCount = 0;
        this.startTime = moment();
        this.lastLog = 0;
    }

    registerModule(module) {
        const id = uuid();
        module.setKernel(this);
        module.setId(id)
        module.init();
        this.modules.set(id, module);
    }

    getSimTime() {
        return this.ts;
    }

    scheduleEvent(ts, module, eventType, payload) {
        if (ts > this.simTime) {
            return;
        }
        this.eventCount++;
        const id = uuid();
        this.eventQueue.push({
            id,
            ts,
            module,
            eventType,
            payload
        });

        return id;
    }

    scheduleCallback(ts, callback) {
        throw "Not implemented"
    }

    isComplete() {
        return this.eventQueue.length == 0;
    }

    setLogFile(path) {
        this.logFile = path;
    }

    log() {
        ResultUtils.appendToFile(this.logFile, this.report());
    }

    async execute() {
        const timestamps = this.eventQueue.map(e => e.ts);
        const min = getMin(timestamps);
        this.ts = min;
        const currentEvents = this.eventQueue.filter(e => e.ts === min);
        this.eventQueue = this.eventQueue.filter(e => e.ts !== min);

        for (let i = 0; i < currentEvents.length; i++) {
            const {
                module,
                eventType,
                payload
            } = currentEvents[i];
            await module.onEvent(eventType, payload);
        }
    }

    async run() {
        return new Promise(async (resolve, reject) => {
            try {
                this.log();
                while (!this.isComplete()) {
                    await this.execute();
                    const clockTime = moment().diff(this.startTime, 's') * 1000;
                    if ((clockTime - this.lastLog) >= 10000) {
                        this.log();
                        this.lastLog = clockTime;
                    }
                }
            } catch (error) {
                reject(error);
            }
            this.log();
            this.modules.forEach(h => h.onDestroy())
            const clockTime = moment().diff(this.startTime, 's') * 1000;
            console.log(`Simulation of ${Math.round(this.simTime)}ms finished in ${shortEnglishHumanizer(clockTime, { spacer: '' })}`);
            resolve();
        });
    }

    getStats() {
        const clockTime = moment().diff(this.startTime, 's') * 1000;
        const percent = ((this.ts / this.simTime) * 100).toFixed(2);
        return {
            simTime: this.simTime,
            startTime: this.startTime.format('LLL'),
            startTimeUnix: this.startTime.unix(),
            duration: moment().diff(this.startTime, 's'),
            durationFormatted: shortEnglishHumanizer(clockTime, { spacer: '' }),
            eventCount: this.eventCount,
            progress: percent,
        }
    }

    report() {
        const clockTime = moment().diff(this.startTime, 's') * 1000;
        const elapsed = Math.floor(this.ts);
        const percent = ((this.ts / this.simTime) * 100).toFixed(2);
        return `ClockTime: ${shortEnglishHumanizer(clockTime, { spacer: '' })}, Elapsed: ${elapsed}/${this.simTime}, Events: ${this.eventCount}, ${percent}%\n`;
    }

}