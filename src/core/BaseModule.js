const EVENTS = {
    STARTUP: 'STARTUP',
    SHUTDOWN: 'SHUTDOWN'
};

export default class BaseModule {
    constructor() {
        this.isUp = true;
    }

    setKernel(kernel) {
        this.kernel = kernel;
    }

    setId(id) {
        this.id = id;
    }

    init() {
        //throw "Not implemented"
    }

    schedule(ts, eventType, payload) {
        this.kernel.scheduleEvent(ts, this, eventType, payload);
    }

    async onEvent(eventType, playload) {
        switch(eventType) {
            case EVENTS.STARTUP: {
                this.isUp = true;
                break;
            }
            case EVENTS.SHUTDOWN: {
                this.isUp = true;
                break;
            }
        }
    }

    onDestroy() {
        // console.log('DESTROY');
    }
}