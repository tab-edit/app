import { basicSetup, EditorState, EditorView } from "@codemirror/basic-setup"
import { useEffect, useRef } from "react";
import { rawTablature, tablatureAST } from 'lang-tablature';
import './Editor.css';

export let editorViewForDebug: EditorView;
function Editor(props:any) {
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const state = EditorState.create({
            doc: '',
            extensions: [
                basicSetup,
                tablatureAST()
            ]
        })
        const view = new EditorView({
            state: state,
            parent: editorRef.current!
        })
        editorViewForDebug = view;
    }, [])

    return <div id="editor" ref={editorRef} />
}

export default Editor;