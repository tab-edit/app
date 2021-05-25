import './App.css';
import EditorUtils from './utils/EditorUtils'
import TabTree from './models/TabTree';
import TabFragment from './models/TabFragment';
import ModelInstance from './models/EditorToModelLink';
import {Timeout, Interval} from './utils/CallBacks';
import Model from './models/Model';
import $ from 'jquery'
import { tokenToString } from 'typescript';

function App() {
  return (
    <div className="App">
      <div id="editor" contentEditable="true" suppressContentEditableWarning={true} spellCheck={false}>
      <b>h</b>fuwi    griog<em>shigru<strong>giori</strong>igrueg</em>heirgeirgneio<strong>jfioerjieo</strong>
      </div>
      {/* <input type="number" id="index-field" onChange={testGetRangeFromIndex}/>
      <input type="number" id="len-field" onChange={testGetRangeFromIndex}/> */}
      <div id="display"></div>
      {/* <div id="displayn">
        <div id="childDisplay"></div>
      </div>
      <div id="dummy"></div> */}
      <button id="button" onClick={doThing}>Run JS code</button>
      {/* <button id="button2" onClick={callbackTest}>anim test</button> */}
    </div>
  );
}

const model = new Model();
let doThing = ((model) => () => tst(model))(model);
function tst(model) {
  let editor = document.getElementById("editor");
  if (editor) console.log(model.update(editor.innerText));
}

// function treeSortTest() {
//   let arr = [];
//   for (let i = 0; i<10; i++) {
//     arr.push(i);
//   }
//   arr = arr.sort((a, b) => 0.5 - Math.random())
//   document.getElementById("display").innerText = `Shuffuled Array: ${arr.toString()}`;

//   setTimeout(() => {
//     let tree = new TabTree();
//     for (const e of arr) {
//       console.log(tree.add(new TabFragment(e, 1)));
//     }

//     //document.getElementById("displayn").innerText = `Sorted Array: ${tree.inorder().map(item => item.position)}`;
//   }, 1000)
// }

// function testSelectIndex() {
//   let index = document.getElementById("index-field").value;
//   if (!index && index!==0) return;

//   let len = document.getElementById("len-field").value;
//   if (!len) return;

//   let range = EditorUtils.getRange(index, len);
//   let wrapper = document.createElement("div");
//   wrapper.classList.add("the-wrap");

//   let wholeRange = document.createRange();
//   wholeRange.selectNodeContents(document.getElementById("editor"));
//   EditorUtils.clearStylingInRange(wholeRange);
//   setTimeout(() => {
//     EditorUtils.wrapRange(range, wrapper);
//   }, 500)
// }

// function testGetRangeFromIndex() {
//   let index = document.getElementById("index-field").value;
//   if (!index && index!==0) return;
//   let rangeInfo = EditorUtils.getRangeInfoFromIndex(index);
//   //console.log(rangeInfo.container.textContent);

//   let container = rangeInfo.container;
//   if (container.nodeType===3) container = container.parentElement;
//   container.style.backgroundColor = "red";
//   document.getElementById("display").innerText = `Offset Index: ${rangeInfo.offsetIdx}`
//   setTimeout(() => {
//     container.style.backgroundColor = "transparent";
//   }, 500)
// }

// function callbackTest() {
//   let display = document.getElementById("displayn");
//   let childDisplay = document.getElementById("childDisplay");
//   childDisplay.setAttribute("style","width:30%");
//   childDisplay.setAttribute("style","height:30%");
//   let button = document.getElementById("button");

//   let callBack = new Timeout(() => {
//     let duration = 2000;
//     let end = performance.now()+duration;
//     while(performance.now()<end) {}
//   }, 2000);

//   const state = {
//     isInitial:true,
//     delay:true,
//     callback:callBack,
//     buttonClicked:false,
//     display:display,
//     childDisplay:childDisplay,
//   }
  
//   button.onClick = ((state) => {
//     state.buttonClicked = true;
//     return () => {};
//   })(state)

//   let animate = (state) => {
//     if (!state.isInitial && state.delay) return;
//     if (state.buttonClicked) {
//       state.buttonClicked = false;
//       if (state.callback.isDead) {
//         state.isInitial = true;
//       }else {
//         state.callback.stop();
//       }
//       if (state.isInitial) {
//         state.isInitial = false;
//         display.style.backgroundColor = "green";
//         state.delay = true;
//         setTimeout((()=> {
//           state.delay = false;
//           state.callback.start();
//         }).bind(state), 1000);
//       }
//     }
//     display.style.backgroundColor = "transparent";
//     if (state.callback.stopped) {
//       display.style.backgroundColor = "orange";
//     }
//     if (state.callback.isDead) {
//       display.style.backgroundColor = "red";
//     }
//     if (state.callback._callActive) {
//       state.childDisplay.style.backgroundColor = "blue";
//     }

//     requestAnimationFrame(() => animate(this))
//   };
//   requestAnimationFrame(() => animate(state));
// }

export default App;
