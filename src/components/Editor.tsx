import { basicSetup, EditorView } from '@codemirror/basic-setup';
import React, { useState, useEffect, useRef } from 'react';
import { EditorState, Compartment, StateEffect } from '@codemirror/state';
import { linter } from '@codemirror/lint';
import { tablature, tabLint } from 'lang-tablature';
import './editor.css';

type Props = {
    delay?: number
}

let defaultProps = {
    delay: 500
}

let tablintrc = {};
function createLinterExtension(tablintrc:any) {
    return linter(tabLint(tablintrc), {
        delay: 500
    });
}

let lintCompartment = new Compartment();
let langCompartment = new Compartment();

function Editor(props:Props = defaultProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState<EditorView>();

    useEffect(() => {
        const s = EditorState.create({
            doc: "hello! ",
            extensions: [
                basicSetup,
                langCompartment.of(tablature()),
            ]
        });
        const v = new EditorView({
            state: s,
            parent: editorRef.current!
        });
        setView(v);
        return () => {
            v?.destroy();
        }
    }, []);

    //updating linter configuration
    useEffect(() => {
        let lintExtension = createLinterExtension(tablintrc);
        if (view && lintCompartment.get(view.state)) {
            view?.dispatch({
                effects: lintCompartment.reconfigure(lintExtension)
            });
        }else {
            view?.dispatch({
                effects: StateEffect.appendConfig.of(lintExtension)
            })
        }
    }, [view, tablintrc]);

    return (
        <div className='editor' ref={editorRef} />
    )
}

export default Editor;