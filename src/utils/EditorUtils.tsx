import $ from 'jquery';
type DOMPosition = {
    container: Node,
    offset: number,
    isTextNode?: boolean,
    isLineBreak?: boolean,
    isOutOfBounds?: boolean
}

export default class EditorUtils {
    static editorRef:HTMLElement;

    static get editor() : HTMLElement {
        if (!this.editorRef) this.editorRef = document.getElementById("editor")!;
        return this.editorRef;
    }
    
    static getRange(startIdx:number, length:number) : Range {
        let startIdxRangeInfo = this.getPositionFromIndex(startIdx);
        let endIdxRangeInfo = this.getPositionFromIndex(startIdx+length);
        
        let range = document.createRange();
        if (startIdxRangeInfo.isOutOfBounds || endIdxRangeInfo.isOutOfBounds) {
            range.collapse();
            return range;
        }
        
        range.setStart(startIdxRangeInfo.container, startIdxRangeInfo.offset);
        range.setEnd(endIdxRangeInfo.container, endIdxRangeInfo.offset);
        return range;
    }
    
    static getPositionFromIndex(index:number) : DOMPosition {
        let result:DOMPosition = {
            container: this.editor,
            offset: index,
        }
        for(let tmp=result;;tmp=this.findChildContainingIndex(result.container, result.offset)) {
            if (tmp.isOutOfBounds || tmp.isTextNode || tmp.isLineBreak) return tmp;
            result = tmp;
        }
    }

    static findChildContainingIndex(parent:Node, index:number) : DOMPosition {
        if (index<0) throw new Error("negative index attempted");
        const childNodes = parent.childNodes;

        let runningLen = 0;
        let child:Node;
        let childText:string;
        for (child of childNodes) {
            childText = this.getTextFrom(child);
            if (index<runningLen+childText.length) {
                return {
                    container: child,
                    offset: index-runningLen,
                    isTextNode: child.nodeType===3,
                    isLineBreak: childText==="\n"
                }
            }
            runningLen += childText.length;
        }
        return {
            container: parent,
            offset: 0,
            isOutOfBounds: true
        };
    }

    
    //wraps the given range with the specified wrapping node. BEWARE: this function delets all children nodes of the wrapping node, leaving its only children as the contents of the range
    static wrapRange(range:Range, wrapper:HTMLElement) {
        wrapper.innerHTML = "";
        //not sure, may want to remove this line later. marking them as edit wrappers so we can selectively remove them.
        wrapper.classList.add("edit-wrapper");
        wrapper.appendChild(range.extractContents());
        range.insertNode(wrapper);
    }

    
    static clearStylingInRange(range:Range) {
        
        // let contents = range.extractContents;
        // contents.querySelectorAll('.edit-wrapper').forEach(e => e.replaceWith(...e.childNodes));
    }

    static unwrapElement(element:HTMLElement) {
        if (!element.matches("#editor > *")) return false;
        const parent = element.parentNode!;
        while(element.firstChild) parent.insertBefore(element.firstChild, element);
        parent.removeChild(element); 
    }

    static getText() : string {
        return this.getTextFrom(this.editor);
    }
    static getTextFrom(node:Node) : string {
        let element:any = node;
        let html:string = element.innerHTML;
        let initialTextMatch = html.match("^[^<]*");
        let initialText = initialTextMatch ? initialTextMatch[0] : ""
        let remainingHTML = initialTextMatch ? html.substring(initialTextMatch.index!+initialText.length, html.length) : html;
        if (remainingHTML) initialText += '\n';
        let text = initialText + remainingHTML;
        text = EditorUtils.htmlDecode(text);
        if (remainingHTML) text = text.substring(0, text.length-1);
        return text.substring(0, text.length);
    }

    // static htmlEncode(text:string){
    //     return $('<div/>').text(text).html();
    // }
    
    static htmlDecode(html:string){
        html = html.replace(/<\/div>/ig, '\n');
        return $('<div/>').html(html).text();
    }
}