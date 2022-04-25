import { EditorState, EditorView } from "@codemirror/basic-setup"
import { useEffect, useRef } from "react"
import './Editor.css';

function Editor(props:any) {
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const state = EditorState.create({
            doc: '',
            extensions: []
        })
        new EditorView({
            state: state,
            parent: editorRef.current!
        })
    }, [])

    return <div id="editor" ref={editorRef} />
}

export default Editor;