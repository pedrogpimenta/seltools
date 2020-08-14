import React from 'react'
import { Link } from 'react-router-dom'
// import './Landing.css'

class Landing extends React.Component {
  render() {
    return (
      <div>
        <div>
          Eres profesor? <Link to='/documentos'>Entra aqui</Link>
        </div>
        <div>
          Eres alumno? <Link to='/alumno/documentos'>Entra aqui</Link>
        </div>
      </div>
    )
  }
}

export default Landing
