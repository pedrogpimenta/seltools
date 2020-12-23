import React from 'react'
import {
  withRouter
} from "react-router-dom"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

import {
  Button,
  Card,
  Elevation,
  FormGroup,
  InputGroup,
  Intent,
} from "@blueprintjs/core"

class Login extends React.Component {
  constructor() {
    super()

    this.state = {
      email: '',
      password: '',
      loginFailed: false,
    }
  }

  handleLogin = (e) => {
    e.preventDefault()

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      })
    }

    const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/login`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then((data) => {
        if (data.message === 'ok') {
          localStorage.setItem('seltoolstoken', data.token)
          localStorage.setItem('seltoolsuserid', data.user._id)
          localStorage.setItem('seltoolsuserfolder', data.user.userfolder)
  
          this.props.history.push(`/documentos/${data.user.userfolder}`)
        } else {
          this.setState({
            loginFailed: true,
          })
        }

      })
  }

  componentDidMount = () => {
    if (localStorage.getItem('seltoolsuserfolder')) {
      this.props.history.push(`/documentos/${localStorage.getItem('seltoolsuserfolder')}`)
    }
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          minHeight: '100vh',
          padding: '48px',
          backgroundColor: 'var(--c-primary-lightest)',
        }}
      >
        <Card
          elevation={Elevation.TWO}
          style={{
            width: '380px',
            padding: '26px',
            boxShadow: '0px 3px 11px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.08)',
            borderRadius: '5px',
          }}
        >
          <h3
            className="bp3-heading"
            style={{
              margin: '0 0 16px 0',
            }}
          >
            Entrar
          </h3>
          {this.state.loginFailed &&
            <>
              <p>Hubo un problema al entrar. Verifica que tus datos son correctos.</p>
              <p>Si tienes alguna duda, escribenos: <a href="mailto:hola@seldocs.com">hola@seldocs.com</a>.</p>
            </>
          }
          <form
            action="submit"
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <FormGroup
              label="Email"
              labelFor="email-input"
              style={{
                margin: '8px 0',
              }}
            >
              <InputGroup
                id="email-input"
                type="email"
                placeholder="email@ejemplo.com"
                onChange={(e) => this.setState({email: e.target.value})}
              />
            </FormGroup>
            <FormGroup
              label="Password"
              labelFor="password-input"
              style={{
                margin: '8px 0',
              }}
            >
              <InputGroup
                id="password-input"
                type="password"
                onChange={(e) => this.setState({password: e.target.value})}
              />
            </FormGroup>
            <Button
              type='submit'
              intent={Intent.PRIMARY}
              disabled={!this.state.email || !this.state.password}
              text='Entrar'
              style={{
                alignSelf: 'center',
                width: '140px',
                padding: '10px',
                margin: '24px 0 0 0',
              }}
              onClick={this.handleLogin}
            />
            <p
              style={{
                margin: '34px 0 0 0',
                fontSize: '12px',
                textAlign: 'center',
                color: '#5c7080',
              }}
            >
              <a href="/recuperar">¿Olvidaste tu password?</a>
            </p>
          </form>
        </Card>
      </div>
    )
  }
};

export default withRouter(Login)