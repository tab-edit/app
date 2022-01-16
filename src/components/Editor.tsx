import { basicSetup, EditorView } from '@codemirror/basic-setup';
import React, { useEffect, useRef } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
// import { tablature } from 'lang-tablature';
import './editor.css';

function Editor(props:any) {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let language = new Compartment();
        const state = EditorState.create({
            doc: "hello! ",
            extensions: [
                basicSetup
                // language.of(tablature())
            ]
        });
        const view = new EditorView({
            state,
            parent: editorRef.current!
        })

        return () => {
            view.destroy();
        }
    }, [])
    return (
        <div className='editor' ref={editorRef} />
    )
}

export default Editor;