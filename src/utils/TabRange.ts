export default class TabRange {
    #start:number;
    #end:number;
    #length:number;
    #padding:number;
    #startPad:number;
    #endPad:number;

    get start() : number {return this.start }
    get end() : number {return this.end }
    get length() : number { return this.#end }
    get padding() : number { return this.padding }

    constructor(start:number, end:number, padding?:number) {
        this.#start = start;
        this.#end = end;
        this.#length = this.#end-this.#start;
        this.#padding = padding || 0;
        this.#startPad = this.#start-this.#padding;
        this.#endPad = this.#end+this.#padding;
    }

    compareTo(other:TabRange|number, padding?:boolean) {
        let myStart = padding ? this.#startPad : this.start;
        if (other instanceof TabRange) {
            let otherStart = padding ? other.#startPad : other.start;
            if (this.overlaps(other)) return 0;
            return myStart-otherStart;
        }
        if (this.contains(other)) return 0;
        return myStart-other;
    }

    overlaps(other:TabRange, padding?:boolean) : boolean {
        let myStart = padding ? this.#startPad : this.start;
        let myEnd = padding ? this.#endPad : this.end;
        let otherStart = padding ? other.#startPad : other.start;
        let otherEnd = padding ? other.#endPad : other.end;
        return (myEnd<=otherEnd && myEnd>otherStart) || (myStart>=otherStart && myStart<otherEnd) || this.contains(other, padding) || other.contains(this, padding);
    }
    contains(other:TabRange|number, padding?:boolean) : boolean {
        if (other instanceof TabRange) {
            let otherStart = padding ? other.#startPad : this.start;
            let otherEnd = padding ? other.#endPad : this.end;
            return this.contains(otherStart, padding) && this.contains(otherEnd, padding);
        }
        let myStart = padding ? this.#startPad : this.start;
        let myEnd = padding ? this.#endPad : this.end;
        return other >= myStart && other <= myEnd;
    }
}