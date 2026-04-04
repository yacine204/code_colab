import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

//pages
import Home from './pages/home'
import CodeSpace from './pages/codeSpace'
import Login from './pages/login'
import Signup from './pages/signup'

//components (testing)
import Terminal from './components/terminal'
import Button from './components/button'
import Input from './components/input_field'

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>} ></Route>
        <Route path="/codespace" element={<CodeSpace></CodeSpace>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
        {/* testing components */}
        <Route path="/coding" element={<Terminal language="" theme="" height="" width="" />}></Route>
        <Route path="/button" element={<Button context='hi lol'  color="#6366f1" trigger={()=>console.log('hi lol')}></Button>}></Route>
        <Route path='/input' element={<>
                                        <Input label="Email" type="email" placeholder="you@example.com" />
                                        <Input label="Password" type="password" error="Invalid password" />
                                      </>}>
                                    </Route>
      </Routes>
      
    </>

  )
}

export default App
