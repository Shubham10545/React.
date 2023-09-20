
import React,{useRef} from 'react'
function Ref() {
  let inputRef=useRef(null);
  function controlInput()
  {
  //  inputRef.current.value="abc"
  // inputRef.current.style.display="none"
  inputRef.current.focus()
  }
  return (
    <div className="Ref">
      <h1>useRef in React </h1>
      <input type="text" ref={inputRef} />
      <button onClick={controlInput}>Handle Input</button>
    </div>
  );

}

export default Ref;