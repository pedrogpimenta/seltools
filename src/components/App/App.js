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
      connectedUsers: [],
    }

    // this.socket = io(REACT_APP_SERVER_WS_URL)
  }

  socket = ''

  setUser = (user) => {
    this.setState({
      user: user,
    })

    localStorage.setItem('userId', user._id)
    localStorage.setItem('userName', user.username)
    localStorage.setItem('userType', user.type)

    this.socket = io(REACT_APP_SERVER_WS_URL, {query: `userId=${user._id}`})
  }

  setLocation = (breadcrumbs) => {
    this.setState({
      breadcrumbs: breadcrumbs,
    })

  }

  // componentDidMount = () => {
    // console.log( 'mount:', this.state.user.name)
    // this.socket = io(REACT_APP_SERVER_WS_URL)
  // }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  render() {
    return (
      <Router>
        <Switch>
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
              breadcrumbs={this.state.breadcrumbs}
              connectedUsers={this.state.connectedUsers}
              setUser={this.setUser}
              setLocation={this.setLocation}
            />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App
