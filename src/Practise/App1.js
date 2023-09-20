import React from 'react'
import Form from './Form'


const App1 = () => {
    const getData=(data)=>{
        console.log("Coming from AppJs",data)
    }
  return (
    <div>
      <Form onSubmit={getData} />
    </div>
  )
}

export default App1
