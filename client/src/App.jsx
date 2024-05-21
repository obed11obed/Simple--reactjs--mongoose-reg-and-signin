import {Routes, BrowserRouter, Route} from 'react-router-dom'
import './App.css'
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';


function App() {

  return (
    <>
       <BrowserRouter>
            <div className="App">
                <Routes>
                <Route path="/" element={<Login/>} />
                    <Route path="/register" element={<Register/>} />
                    
                    <Route path="/profile" element={<Profile/>} />
                </Routes>
            </div>
        </BrowserRouter>
    </>
  )
}

export default App
