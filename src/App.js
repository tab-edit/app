import './App.css';
import EditorUtils from './utils/EditorUtils'

function App() {
  return (
    <div className="App">
      <div id="editor" contentEditable="true" suppressContentEditableWarning={true}>
      <b>h</b>fuwi    griog<em>shigru<strong>giori</strong>igrueg</em>heirgeirgneio<strong>jfioerjieo</strong>
      </div>
      <input type="number" id="index-field" onChange={doThing}/>
      <div id="display"></div>
      <div id="dummy"></div>
      <button onClick={doThing}>Run JS code</button>
    </div>
  );
}

//uses quicksearch to find the node and the offset of the text at this index in the provided parameter element
function doThing() {
  let index = document.getElementById("index-field").value;
  console.log(index);
  if (!index && index!==0) return;
  let rangeInfo = EditorUtils.getRangeInfoFromIndex(index);
  //console.log(rangeInfo.container.textContent);

  let container = rangeInfo.container;
  container.style.backgroundColor = "red";
  document.getElementById("display").innerText = `Offset Index: ${rangeInfo.offsetIdx}`
  setTimeout(() => {
    container.style.backgroundColor = "transparent";
  }, 500)
}

export default App;
