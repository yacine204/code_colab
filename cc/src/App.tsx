import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

//pages
import Home from './pages/home'
import CodeSpace from './pages/codeSpace'

//components (testing)
import Terminal from './components/terminal'
import Button from './components/button'

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>} ></Route>
        <Route path="/codespace" element={<CodeSpace></CodeSpace>}></Route>
        {/* testing components */}
        <Route path="/coding" element={<Terminal language="" theme="" height="" width="" />}></Route>
        <Route path="/button" element={<Button context='hi lol'  color="#6366f1" trigger={()=>console.log('hi lol')}></Button>}></Route>
      </Routes>
      
    </>

  )
}

export default App
