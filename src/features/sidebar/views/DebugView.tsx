import { syntaxTree } from "@codemirror/language";
import { useState } from "react";
import { tabSyntaxTree, TabTree } from "tab-ast";
import { editorViewForDebug } from "../../editor/Editor";

function DebugView() {
    const [tree, setTree] = useState<any|null>(null);

    return (
        <div className='sheet-view'>
            <button 
                onClick={() => setTree(editorViewForDebug ? tabSyntaxTree(editorViewForDebug.state) : tree)}
            >
                Refresh Syntax Tree
            </button>
            <br/>
            <code style={{whiteSpace: "pre"}}>{prettyPrint(tree?.toString() || "Nothing!")}</code>
        </div>
    )
}

function prettyPrint(str:string) {
    let spaces = 0;
    let spaceConst = "  ";
    let newStr = "";
    for (let char of str) {
        if (char!==")") newStr+=char;
        if (char==="(") {
            spaces++;
            newStr += "\n";
        }
        if (char===")") {
            spaces--;
            newStr+="\n";
            for (let i=0; i<spaces; i++) {
                newStr+=spaceConst;
            }
            newStr+=char;
            newStr+="\n"
        }
        if (char==="(" || char==="\n" || char===")") {
            for (let i=0; i<spaces; i++) {
                newStr+=spaceConst;
            }
        }
    }
    return newStr;
}

export default DebugView;