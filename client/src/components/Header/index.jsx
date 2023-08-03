import React from 'react'
import "./style.css"
import logo from "../../assets/logo.png"

function Header() {
  return (
    <header>
        <div>
        <img src={logo} alt="logo"/> 
        </div>
        <nav>
            <input placeholder='Plant Search...'/>
        </nav>
    </header>
  )
}

export default Header
