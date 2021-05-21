export default class EditorUtils {
    static editor = document.getElementById("editor");
    
    static getRangeInfoFromIndex(index) {
        if (!this.editor) this.editor = document.getElementById("editor");
        let result = {
            container: this.editor,
            offsetIdx: index,
            childFound: true
        }
        for(let tmp=result;tmp.outOfBounds || !tmp.isTextNode;tmp=this.findChildContainingIndex(result.container, result.offsetIdx)) {
            if (tmp.outOfBounds || tmp.isLineBreak) return tmp;
            result = tmp;
        }
        delete result.isTextNode;
        return result;
    }

    static findChildContainingIndex(parent, index) {
        if (index<0) throw new Error("negative index attempted");
        const childNodes = parent.childNodes;

        let runningLen = 0;
        let childText;
        for (let child of childNodes) {
            childText = child.innerText || child.textContent;
            if (index<runningLen+childText.length) {
                return {
                    container: child,
                    offsetIdx: index-runningLen,
                    isTextNode: child.nodeType===3,
                    outOfBounds: false,
                    isLineBreak: childText==="\n"
                }
            }
            runningLen += childText.length;
        }
        return {outOfBounds: true};
    }

    static unwrapElement(element) {
        if (!element.matches("#editor > *")) return false;
        const parent = element.parentNode;
        while(element.firstChild) parent.insertBefore(element.firstChild, element);
        parent.removeChild(element); 
    }
}