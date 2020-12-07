import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import './App.css'

import io from 'socket.io-client'

import { REACT_APP_SERVER_BASE_URL, REACT_APP_SERVER_WS_URL } from '../../CONSTANTS'
import Landing from '../Landing/Landing'
import Documents from '../Documents/Documents'
import Document from '../Document/Document'
import Student from '../Student/Student'
import TestFile from '../TestFile/TestFile'

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      user: {},
      breadcrumbs: [],
    }

    // this.socket = io(REACT_APP_SERVER_WS_URL)
  }

  socket = io(REACT_APP_SERVER_WS_URL)

  setUser = (user) => {
    this.setState({
      user: user,
    })

    localStorage.setItem('userId', user._id)
    localStorage.setItem('userName', user.username)
    localStorage.setItem('userType', user.type)

    this.socket.emit('user login', user)
  }

  setLocation = (breadcrumbs) => {
    console.log('doin:', breadcrumbs)
    this.setState({
      breadcrumbs: breadcrumbs,
    })

  }

  componentDidMount = () => {
    // console.log( 'mount:', this.state.user.name)
    // this.socket = io(REACT_APP_SERVER_WS_URL)
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <Landing 
              studentLogin={this.studentLogin}
            />
          </Route>
          <Route path="/testfile">
            <TestFile />
          </Route>
          <Route path="/alumno/documento/:id">
            <Document isStudent={true} />
          </Route>
          {/* <Route path="/alumno/documentos/:folder">
            <Student />
          </Route> */}
          <Route path="/alumno/documentos">
            <Student />
          </Route>
          <Route path="/alumno">
            <Redirect to="/alumno/documentos" />
          </Route>
          <Route path="/documento/:id">
            <Document
              socket={this.socket}
            />
          </Route>
          <Route path="/documento">
            <Document isNew={true} />
          </Route>
          {/* <Route path="/documentos/:folder">
            <Documents />
          </Route> */}
          <Route path="/documentos">
            <Documents
              socket={this.socket}
              user={this.state.user}
              setUser={this.setUser}
              breadcrumbs={this.state.breadcrumbs}
              setLocation={this.setLocation}
            />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App
