abstract class CallBack {
    _id:any;
    _func:Function;
    _duration:number;
    _dead:boolean;
    _interrupted:boolean;
    _callActive:boolean;
    get stopped() { return this._interrupted }
    get isDead() { return this._dead }
    
    constructor(func:Function, duration:number) {
        this._func = func;
        this._duration = duration;

        this._interrupted = false;
        this._callActive = false;
        this._dead = true;
    }
    
    start() {
        if (!this._dead) return;
        this._interrupted = false;
        this._callActive = false;
        this._dead = false;

        this._id = this._setCallback();
    }

    abstract _setCallback():unknown;
    abstract _clearCallback():unknown;

    stop() {
        if (this._dead) return;
        this._clearCallback();
        this._interrupted = true;
    }
}

export class Interval extends CallBack{
    _setCallback() : ReturnType<typeof setInterval> {
        return setInterval((() => {
            this._interrupted = false;
            this._callActive = true;
            this._func();
            this._callActive = false;
        }).bind(this), 1/this._duration);
    }
    _clearCallback() {
        clearInterval(this._id);
        new Promise(((_:any,_1:any) => {
            while(this._callActive) {}
        }).bind(this)).then(() => {
            this._dead = true;
        });
    }
}

export class Timeout extends CallBack{
    _setCallback() {
        return setTimeout((() => {
            this._callActive = true;
            this._func();
            this._callActive = false;
            this._dead = true;
        }).bind(this), 1/this._duration);
    }
    _clearCallback() {
        clearTimeout(this._id);
        if (!this._callActive) this._dead = true;
    }
}