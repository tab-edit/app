import EditorUtils from '../utils/EditorUtils';
import TabRange from '../utils/TabRange';

export default class TabFragment {
    #position!: number;
    #content:string;
    #padding = 0;
    #range!:TabRange;
    #domRange!:Range;
    #originText:string;

    constructor(origin:string, content:string, position:number, padding?:number) {
        this.#originText = origin;
        this.#content = content;
        this.#padding = padding || 0;
        this.#position = position;
        this.#range = new TabRange(this.#position, this.#position+this.#content.length, this.getPadUp(), this.getPadDown());
        console.log("djdj");
        //this.#domRange = EditorUtils.getRange(position, this.length);
    }

    get content() : string { return this.#content }

    get length() { return this.#range.length }
    get innerLength() { return this.#content.length }

    getPadUp() {
        let stringAbove = this.#originText.substring(0, this.#position);
        let match1 = stringAbove.match(/\n *\n$/);
        if (match1) {
            return this.#position-match1.index!;
        }
        let match2 = stringAbove.match(/^( *\n)?$/);    // a tab fragment should only ever NOT have two newlines before it (match1) when it is at the start of the string.
        if (!match2) {
            throw new Error("This tab fragment was not created properly. There might be a problem with the regex for selecting this fragment because the spacing before this tab fragment is not as expected.");
        }
        return match2[0].length! + 2; //plus 2 because we still do not have the full two newlines that is expected, so if something is added before this fragment, it is bound to overlap (match.index is the start of the string. adding two makes sure that the padding is big enough that adding anything before will definitely overlap).
    }

    getPadDown() {
        let stringBelow = this.#originText.substring(this.#position+this.innerLength);
        let match = stringBelow.match(/^\n *\n/);
        if (match) {
            return match[0].length;
        }
        let match2 = stringBelow.match(/^(\n *)?$/);        // a tab fragment should only ever NOT have two newlines after it (match1) when it is at the end of the string.
        if (!match2) {
            throw new Error("This tab fragment was not created properly. There might be a problem with the regex for selecting this fragment because the spacing after this tab fragment is not as expected.");
        }
        return match2[0].length! + 2; //plus 2 because we still do not have the full two newlines that is expected, so if something is added after this fragment, it is bound to overlap (the match's end index is the end of the string. adding two makes sure that the padding is big enough that adding anything after will definitely overlap).
    }

    get position() { return this.#position }
    
    set position(position:number) {
        this.#position = position;
        this.#range.setStart(position);
    }

    get domRange() {
        if (!this.#domRange) this.#domRange = EditorUtils.getRange(this.#position, this.length);
        return this.#domRange;
    }

    compareTo(other:TabFragment|TabRange|number, withPadding?:boolean) {
        if (other instanceof TabFragment) {
            return this.#range.compareTo(other.#range, withPadding);
        }
        return this.#range.compareTo(other, withPadding);
    }
}