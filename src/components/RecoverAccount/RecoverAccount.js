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

class RecoverAccount extends React.Component {
  constructor() {
    super()

    this.state = {
      email: '',
      recoverDone: false,
    }
  }

  handleRecover = (e) => {
    e.preventDefault()
    const registerRequestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.email,
      })
    }

    const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/recover`

    fetch(fetchUrl, registerRequestOptions)
      .then(response => response.json())
      .then((data) => {
        if (data.message !== 'ok') return false
        this.setState({
          recoverDone: true,
        })
      })
  }

  componentDidMount = () => {
    if (window.goatcounter.counter) {
      window.goatcounter.count({
        path: this.props.location.pathname + this.props.location.search + this.props.location.hash,
      })
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
          {!this.state.recoverDone &&
            <>
              <h3
                className="bp3-heading"
                style={{
                  margin: '0 0 24px 0',
                }}
              >
                Recuperar cuenta
              </h3>
              <Callout
                style={{
                  marginBottom: '16px',
                }}
              >
                <p>Has olvidado tu contraseña. ¡No te preocupes!</p>
                <p>Escribe tu dirección de email. Enseguida recibirás un mensaje con un enlace para poder restablecer la contraseña.</p>
              </Callout>
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
                <Button
                  type='submit'
                  intent={Intent.PRIMARY}
                  text='Enviar email'
                  style={{
                    alignSelf: 'center',
                    width: '140px',
                    padding: '10px',
                    margin: '24px 0 0 0',
                  }}
                  onClick={this.handleRecover}
                />
              </form>
            </>
          }
          {this.state.recoverDone &&
            <>
              <p>
                ¡Hecho! Ahora abre tu email. Deberías tener un email de nuestra parte para confirmar que eres tu y poder restablecer tu contraseña.
              </p>
              <p style={{margin: 0}}>
                Si tienes alguna duda, escribenos: <a href="mailto:hola@seldocs.com">hola@seldocs.com</a>.
              </p>
            </>
          }
        </Card>
      </div>
    )
  }
};

export default withRouter(RecoverAccount)