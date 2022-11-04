import './Editor.css';
import { useEffect, useRef } from "react";
import { basicSetup, EditorView } from "codemirror"
import { TabLanguage, ASTParser } from "@tab-edit/ast";
import { parser } from "@tab-edit/parse";
import { LRLanguage } from '@codemirror/language';

export let editorViewForDebug: EditorView;
function Editor(props:any) {
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        editorViewForDebug = new EditorView({
            doc: "",
            extensions: [
                basicSetup,
                tablatureASTLanguage,
                rawTabLanguage
            ],
            parent: editorRef.current!
        })
    }, [])

    return <div id="editor" ref={editorRef} />
}

export default Editor;

export const tablatureASTLanguage = TabLanguage.define({
    parser: new ASTParser()
});

export const rawTabLanguage = LRLanguage.define({
    parser: parser.configure({
        props: []
    })
})
