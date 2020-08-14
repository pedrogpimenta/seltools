import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"
import './App.css'

import Landing from '../Landing/Landing'
import Documents from '../Documents/Documents'
import Document from '../Document/Document'
import Student from '../Student/Student'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/alumno">
            <Student />
          </Route>
          <Route path="/documento/:id">
            <Document />
          </Route>
          <Route path="/documento">
            <Document isNew={true} />
          </Route>
          <Route path="/documentos">
            <Documents />
          </Route>
          <Route path="/">
            <Landing />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App
