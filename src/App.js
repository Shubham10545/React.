import React from 'react';
import {Routes, Route} from 'react-router-dom';
import AddEmployee from './AddEmployee'; 
import Main from './Main'; 

function App() {
  
  return (
    <>
    
        <Routes>
        <Route path="/" element={<Main />} />
          <Route path="/addEmployee/:id" element={<AddEmployee />} />
          <Route path="/addEmployee" element={<AddEmployee />} />
        </Routes>
      
    </>
  );
}

export default App;
