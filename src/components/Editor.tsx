import React, { Component } from 'react';
import { init } from 'pell';
import 'pell/dist/pell.css'
import Model from '../models/Model';
import EditorUtils from '../utils/EditorUtils';
type MyProps = {  };
type MyState = { 
  html: string
  model: Model
};
class Editor extends Component<MyProps, MyState> {
  editor:HTMLElement|null = null;
  
    onChangeFunc = (e:any) => {
      this.setState({ html: e.currentTarget.innerHTML });
      setTimeout(() => {
          this.state.model.update(EditorUtils.getText());
      }, 500);
    }

    constructor(props:MyProps) {
      super(props);
      this.state = { 
        html: "",
        model: new Model(),
      }
    }
  
    componentDidMount() {
      this.editor = document.getElementById('editor');
      this.editor?.addEventListener("input", this.onChangeFunc);
      this.editor?.addEventListener("paste", function(e:any) {
        e.preventDefault();
        let text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand("insertText", false, text);
      });
    }
  
    render() {
      return (
        <React.Fragment>
          <div id="editor" contentEditable="true" />
          <div id="html-output">{this.state.html}</div>
        </React.Fragment>
      );
    }

}


export default Editor;