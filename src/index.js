import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'

// redux for state
import { Provider } from 'react-redux'
import { store } from './store/store'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"

import Landing from './components/Landing/Landing'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import RecoverAccount from './components/RecoverAccount/RecoverAccount'
import ResetPass from './components/ResetPass/ResetPass'
import App from './components/App/App'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route exact path="/registro">
            <Register />
          </Route>
          <Route exact path="/entrar">
            <Login />
          </Route>
          <Route exact path="/recuperar">
            <RecoverAccount />
          </Route>
          <Route exact path="/restablecer/:recoveryId">
            <ResetPass />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
