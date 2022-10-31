import './Editor.css';
import { useEffect, useRef } from "react";
import { basicSetup, EditorView } from "codemirror"
import { TabLanguage, TabLanguageSupport, ASTParser } from "@tab-edit/ast";
import { parser } from "@tab-edit/parse";
import { LanguageSupport, LRLanguage } from '@codemirror/language';

export let editorViewForDebug: EditorView;
function Editor(props:any) {
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const tab = tablatureAST()
        editorViewForDebug = new EditorView({
            doc: "",
            extensions: [
                basicSetup,
                tab
            ],
            parent: editorRef.current!
        })
    }, [])

    return <div id="editor" ref={editorRef} />
}

export default Editor;

export function tablatureAST() {
    return new TabLanguageSupport(tablatureASTLanguage, rawTablature());
}


export const tablatureASTLanguage = TabLanguage.define({
    parser: new ASTParser()
});

export const rawTabLanguage = LRLanguage.define({
    parser: parser.configure({
        props: []
    })
})

export function rawTablature() {
    return new LanguageSupport(rawTabLanguage)
}