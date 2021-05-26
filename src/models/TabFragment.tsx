import EditorUtils from '../utils/EditorUtils';
import TabRange from '../utils/TabRange';

export default class TabFragment {
    #position!: number;
    #content:string;
    #padding = 0;
    #range!:TabRange;
    #domRange!:Range;

    constructor(content:string, position:number, padding?:number) {
        this.#content = content;
        this.#padding = padding || 0;
        this.position = position;
    }

    get content() : string { return this.#content }

    get length() { return this.#range.length }

    set position(position:number) {
        this.#position = position;
        this.#range = new TabRange(this.#position, this.#position+this.#content.length, this.#padding);
        this.#domRange = EditorUtils.getRange(position, this.length);
    }

    get position() { return this.#position }

    get domRange() {
        if (!this.#domRange) this.#domRange = EditorUtils.getRange(this.#position, this.length);
        return this.#domRange;
    }

    compareTo(other:TabFragment|TabRange|number, padding?:boolean) {
        if (other instanceof TabFragment) {
            return this.#range.compareTo(other.#range, padding);
        }
        return this.#range.compareTo(other, padding);
    }
}