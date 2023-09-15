import React from 'react'
import { Routes, Route, } from 'react-router-dom';
import AddEmployee from './AddEmployee';

function AppRouter  ()  {
    
  return (
    <Routes>
    <Route path="/addEmployee" element={<AddEmployee />} />
  </Routes>
  )
}

export default AppRouter
