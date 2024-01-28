import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import { useLocation } from 'react-router-dom'
import Login from './components/Login'

function App() {
  const path = useLocation().pathname;

  return (
    <>
      {path !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
