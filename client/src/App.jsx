import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import { useLocation } from 'react-router-dom'
import Login from './components/Login'
import CreatePR from './components/CreatePR'

function App() {
  const path = useLocation().pathname;

  return (
    <>
      {path !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreatePR />} />
        <Route path="/edit/:id" element={<CreatePR />} />
      </Routes>
    </>
  )
}

export default App
