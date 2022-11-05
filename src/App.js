import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Coins from './components/Coins'
import CoinDetails from './components/CoinDetails'
import Exchanges from './components/Exchanges'
import Header from './components/Header'
import Home from './components/Home'


function App() {
  return (
    <BrowserRouter>
    <Header />
  <Routes>
    <Route exact path="/" element={<Home />}/>
    <Route exact path="/exchanges" element={<Exchanges />}/>
    <Route exact path="/coin/:id" element={<CoinDetails />}/>
    <Route exact path="/coins" element={<Coins />}/>
  </Routes>
    </BrowserRouter>
  )
}

export default App