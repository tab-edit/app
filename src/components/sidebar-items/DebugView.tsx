import { syntaxTree } from "@codemirror/language";
import { editorState } from "../Editor";

function DebugView() {
    let tree = editorState.view ? syntaxTree(editorState.view?.state) : "";
    return (
        <div className='sheet-view'>
            <code style={{whiteSpace: "pre"}}>{prettyPrint(tree.toString())}</code>
        </div>
    )
}

function prettyPrint(str:string) {
    let spaces = 0;
    let spaceConst = "  ";
    let newStr = "";
    for (let char of str) {
        if (char!=")") newStr+=char;
        if (char=="(") {
            spaces++;
            newStr += "\n";
        }
        if (char==")") {
            spaces--;
            newStr+="\n";
            for (let i=0; i<spaces; i++) {
                newStr+=spaceConst;
            }
            newStr+=char;
            newStr+="\n"
        }
        if (char=="(" || char=="\n" || char==")") {
            for (let i=0; i<spaces; i++) {
                newStr+=spaceConst;
            }
        }
    }
    return newStr;
}

export default DebugView;