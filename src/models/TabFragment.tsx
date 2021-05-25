import EditorUtils from '../utils/EditorUtils';

export default class TabFragment {
    position: number;
    length: number;
    content:string;
    #end:number;
    range;

    constructor(content:string, position:number) {
        this.position = position;
        this.content = content;
        this.length = this.content.length;
        this.#end = this.position+this.length;
        this.range = EditorUtils.getRange(position, this.length)
    }

    set start(position:number) {
        this.position = position;
        this.#end = this.position+this.length;
    }
    get end() { return this.#end }

    get domRange() {
        if (!this.range) this.range = EditorUtils.getRange(this.position, this.length);
        return this.range;
    }

    compareTo(other:TabFragment|number) {
        if (other instanceof TabFragment) {
            if (this.overlaps(other)) return 0;
            return this.position-other.position;
        }
        if (this.contains(other)) return 0;
        return this.position-other;
    }

    overlaps(other:TabFragment) : boolean {
        
        return (this.end<=other.end && this.end>other.start) || (this.start>=other.start && this.start<other.end) || this.contains(other) || other.contains(this);
    }
    contains(other:TabFragment|number) : boolean {
        if (other instanceof TabFragment) {
            return this.contains(other.start) && this.contains(other.end);
        }
        return other >= this.position && other <= this.end;
    }
}