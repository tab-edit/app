import './Editor.css';
import { useEffect, useRef } from "react";
import { basicSetup, EditorView } from "codemirror"
import { ASTLanguage } from "@tab-edit/ast";
import { TabModelSupport } from "@tab-edit/model";
import { parser } from "@tab-edit/parse";
import { LanguageSupport, LRLanguage } from '@codemirror/language';

export let editorViewForDebug: EditorView;
function Editor(props:any) {
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const tab = new TabModelSupport(ASTLanguage.define({}), rawTabLanguage)
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

export function rawTablature() {
    return new LanguageSupport(rawTabLanguage)
}

export const rawTabLanguage = LRLanguage.define({
    parser: parser.configure({
        props: []
    })
})
