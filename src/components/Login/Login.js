import React from 'react'
import {
  withRouter
} from "react-router-dom"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

import {
  Button,
  Card,
  Callout,
  Elevation,
  FormGroup,
  InputGroup,
  Intent,
} from "@blueprintjs/core"

class Login extends React.Component {
  constructor() {
    super()

    this.state = {
      isWaitingResponse: false,
      email: '',
      password: '',
      loginFailed: false,
      errorMessage: '',
    }
  }

  handleLogin = (e) => {
    e.preventDefault()

    this.setState({isWaitingResponse: true})

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
        this.setState({isWaitingResponse: false})

        if (data.message === 'ok') {
          localStorage.setItem('seltoolstoken', data.token)
          localStorage.setItem('seltoolsuserid', data.user._id)
          localStorage.setItem('seltoolsuserfolder', data.user.userfolder)
  
          this.props.history.push(`/documentos/${data.user.userfolder}`)
        } else {
          this.setState({
            loginFailed: true,
            errorMessage: data.message,
          })
        }

      })
  }

  componentDidMount = () => {
    if (window.goatcounter.count) {
      window.goatcounter.count({
        path: this.props.location.pathname + this.props.location.search + this.props.location.hash,
      })
    }
    
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
            Entrar en Seldocs
          </h3>
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
              label="Contraseña"
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
            {this.state.loginFailed &&
              <Callout
                intent={Intent.DANGER}
                title='Hubo un problema al entrar:'
                style={{
                  marginTop: '16px',
                }}
              >
                <p>{this.state.errorMessage}</p>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(0, 0, 0, .7)',
                  }}
                >Si necesitas ayuda escríbenos a <a href="mailto:hola@seldocs.com">hola@seldocs.com</a>.</p>
              </Callout>
            }
            <Button
              type='submit'
              intent={Intent.PRIMARY}
              loading={this.state.isWaitingResponse}
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
              <a href="/recuperar">¿Olvidaste tu contraseña?</a>
            </p>
          </form>
        </Card>
      </div>
    )
  }
};

export default withRouter(Login)