import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
import React, { useEffect, useRef } from 'react';

function Editor(props:any) {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const state = EditorState.create({
            doc: "hello! ",
            extensions: [
                basicSetup
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