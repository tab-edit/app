import { useState } from "react";
import { TabTree } from "tab-ast";

function DebugView() {
    const [tree, setTree] = useState<TabTree|null>(null);

    //onClick={() => setTree(editorState.view ? tabSyntaxTree(editorState.view.state) : tree)}
    return (
        <div className='sheet-view'>
            <button>Refresh Syntax Tree</button> <br/>
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