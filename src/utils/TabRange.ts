export default class TabRange {
    #start:number;
    #end:number;
    #length:number;
    #startPad!:number;
    #endPad!:number;
    #padUp:number;
    #padDown:number

    get start() : number {return this.#start }
    get end() : number {return this.#end }
    get length() : number { return this.#length }

    constructor(start:number, end:number, padUp?:number, padDown?:number) {
        this.#start = start;
        this.#end = end;
        this.#padUp = padUp || 0;
        this.#padDown = padDown===undefined ? (padUp || 0) : padDown;
        this.#length = this.#end-this.#start;
        this.setStart(this.#start);
    }

    setStart(startIdx:number) {
        this.#start = startIdx;
        this.#end = this.#start + this.#length;
        this.#startPad = this.#start - this.#padUp;
        this.#endPad = this.#end + this.#padDown;
    }

    compareTo(other:TabRange|number, withPadding?:boolean) {
        let myStart = withPadding ? this.#startPad : this.#start;
        if (other instanceof TabRange) {
            let otherStart = withPadding ? other.#startPad : other.#start;
            if (this.overlaps(other, true)) return 0;
            return myStart-otherStart;
        }
        if (this.contains(other, true)) return 0;
        return myStart-other;
    }

    overlaps(other:TabRange, withPadding?:boolean) : boolean {
        let myStart = withPadding ? this.#startPad : this.#start;
        let myEnd = withPadding ? this.#endPad : this.#end;
        let otherStart = withPadding ? other.#startPad : other.#start;
        let otherEnd = withPadding ? other.#endPad : other.#end;
        return (myEnd<=otherEnd && myEnd>otherStart) || (myStart>=otherStart && myStart<otherEnd) || this.contains(other, withPadding) || other.contains(this, withPadding);
    }
    contains(other:TabRange|number, withPadding?:boolean) : boolean {
        if (other instanceof TabRange) {
            let otherStart = withPadding ? other.#startPad : other.#start;
            let otherEnd = withPadding ? other.#endPad : other.#end;
            return this.contains(otherStart, withPadding) && this.contains(otherEnd, withPadding);
        }
        let myStart = withPadding ? this.#startPad : this.#start;
        let myEnd = withPadding ? this.#endPad : this.#end;
        return other >= myStart && other < myEnd;
    }
}