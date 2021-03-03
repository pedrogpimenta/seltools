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

class Register extends React.Component {
  constructor() {
    super()

    this.state = {
      isWaitingResponse: false,
      email: '',
      password: '',
      secret: '',
      name: '',
      type: '',
      teacher: '',
      teacherFolder: '',
      hasError: false,
      errorMessage: '',
    }
  }

  handleRegister = (e) => {
    e.preventDefault()

    this.setState({isWaitingResponse: true})

    const registerRequestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        name: this.state.name,
        type: 'teacher',
      })
    }

    const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/register`

    fetch(fetchUrl, registerRequestOptions)
      .then(response => response.json())
      .then((data) => {
        this.setState({isWaitingResponse: false})

        if (data.message === 'ok') {
          const loginRequestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              email: this.state.email,
              password: this.state.password,
            })
          }
          const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/login`

          fetch(fetchUrl, loginRequestOptions)
            .then(response => response.json())
            .then((data) => {
              if (data.message !== 'ok') return false
      
              localStorage.setItem('seltoolstoken', data.token)
              localStorage.setItem('seltoolsuserid', data.user._id)
              localStorage.setItem('seltoolsuserfolder', data.user.userfolder)
      
              this.props.history.push(`/documentos/${data.user.userfolder}`)
            })
        } else {
          this.setState({
            hasError: true,
            errorMessage: data.details,
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
              margin: '0 0 24px 0',
            }}
          >
            Registro
          </h3>
          <form
            action="submit"
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <FormGroup
              label="Nombre"
              labelFor="name-input"
              helperText="El nombre que elijas es el que verán los demás."
              style={{
                margin: '8px 0',
              }}
            >
              <InputGroup
                id="name-input"
                type="text"
                placeholder="Sel"
                onChange={(e) => this.setState({name: e.target.value})}
              />
            </FormGroup>
            <FormGroup
              label="Email"
              labelFor="email-input"
              helperText="Tu email será usado únicamente para poder acceder a tus documentos."
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
            <FormGroup
              label="Código secreto"
              labelFor="secret-input"
              helperText="Puedes encontrar tu código secreto junto a tu invitación a Seldocs."
              style={{
                margin: '8px 0',
              }}
            >
              <InputGroup
                id="secret-input"
                type="text"
                onChange={(e) => this.setState({secret: e.target.value})}
              />
            </FormGroup>
            {this.state.hasError &&
              <Callout
                intent={Intent.DANGER}
                title='Hubo un error al registrar:'
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
              disabled={this.state.secret !== '12345'}
              loading={this.state.isWaitingResponse}
              // className={Classes.MINIMAL}
              text='Regístrate'
              style={{
                alignSelf: 'center',
                width: '140px',
                padding: '10px',
                margin: '24px 0 0 0',
              }}
              onClick={this.handleRegister}
            />
            <p
              style={{
                margin: '28px 0 0 0',
                fontSize: '12px',
                color: '#5c7080',
              }}
            >
              Seldocs no está listo todavía. Si quieres probarlo, <a href="mailto:hola@seldocs.com">mandame un email y hablamos</a>.
            </p>
          </form>
        </Card>
      </div>
    )
  }
};

export default withRouter(Register)