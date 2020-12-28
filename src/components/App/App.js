import React from 'react'
import {
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom"
import './App.css'

import io from 'socket.io-client'

import { REACT_APP_SERVER_BASE_URL, REACT_APP_SERVER_WS_URL } from '../../CONSTANTS'
import Documents from '../Documents/Documents'
import Document from '../Document/Document'

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoading: true,
      userHasToken: localStorage.getItem('seltoolstoken'),
      user: {},
      breadcrumbs: [],
      connectedStudents: [],
    }
  }

  socket = ''

  setUserInfo = (user, breadcrumbs, students) => {
    this.setState({
      user: user,
      breadcrumbs: breadcrumbs,
      connectedStudents: students,
      isLoading: false,
    })

    this.socket = io(REACT_APP_SERVER_WS_URL, {query: `userId=${user._id}`})
    // this.socket = user.type === 'teacher' ?
    // io(REACT_APP_SERVER_WS_URL, {query: `userId=${user._id}`}) :
    // io(REACT_APP_SERVER_WS_URL, {query: `userId=${user._id}&teacherId=${user.teacherId}`})
    
    if (this.state.user.type === 'teacher') {
      this.socket.on('connected students', (students) => {
        console.log('students:', students)
        this.setState({
          connectedStudents: students,
        })
      })
    }
  }

  setLocation = (breadcrumbs) => {
    this.setState({
      breadcrumbs: breadcrumbs,
    })
  }

  getUserInfo = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
      },
    }

    const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/user/${localStorage.getItem('seltoolsuserid')}`

    fetch(fetchUrl, requestOptions)
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then(data => {
        if (data.user) {
          const breadcrumbs = [
            { 
              _id: data.user.userfolder,
              name: data.user.username,
              icon: 'folder-open',
            },
          ]
  
          this.setUserInfo(data.user, breadcrumbs, data.students)
  
          if (!!this.props.match.params.folder) {
            this.props.history.push(`/documentos/${data.user.userfolder}`)
          }
        }
      })
      .catch((err) => {
        this.props.history.push(`/entrar`)
      })
  }

  componentWillMount = () => {
    if (!this.state.userHasToken) {
      this.props.history.push('/entrar')
    }
  }

  componentDidMount = () => {
    if (!this.state.userHasToken) return false
    
    this.getUserInfo()

    this.props.history.listen((location) => {
      if (window.goatcounter.counter) {
        window.goatcounter.count({
          path: location.pathname + location.search + location.hash,
        })
      }
    })

  }

  componentWillUnmount() {
    if (!!this.socket) {
      this.socket.disconnect()
    }
  }

  render() {
    return (
      <Switch>
        {!this.state.isLoading &&
          <>
            <Route exact path="/documento/:id?">
              <Document
                user={this.state.user}
                socket={this.socket}
                breadcrumbs={this.state.breadcrumbs}
                setLocation={this.setLocation}
                connectedStudents={this.state.connectedStudents}
              />
            </Route>
            <Route exact path="/documentos">
              <Redirect to="/entrar" />
            </Route>
            <Route exact path="/documentos/:folder">
              <Documents
                socket={this.socket}
                user={this.state.user}
                breadcrumbs={this.state.breadcrumbs}
                connectedStudents={this.state.connectedStudents}
                setLocation={this.setLocation}
              />
            </Route>
          </>
        }
      </Switch>
    )
  }
}

export default withRouter(App)
