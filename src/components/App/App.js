import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import './App.css'

import Landing from '../Landing/Landing'
import Documents from '../Documents/Documents'
import Document from '../Document/Document'
import Student from '../Student/Student'
import TestFile from '../TestFile/TestFile'

class App extends React.Component {
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
          <Route path="/alumno/documentos">
            <Student />
          </Route>
          <Route path="/alumno">
            <Redirect to="/alumno/documentos" />
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
