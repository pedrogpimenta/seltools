import React from 'react'
import {
  withRouter
} from "react-router-dom"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

import {
  AnchorButton,
  Button,
  Classes,
  Card,
  Elevation,
  FormGroup,
  Icon,
  InputGroup,
  Intent,
  Popover,
  Spinner,
} from "@blueprintjs/core"

class ResetPass extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoading: true,
      canReset: false,
      password: '',
      confirmPassword: '',
      resetDone: false,
      resetSuccessful: false,
    }
  }

  handleReset = (e) => {
    e.preventDefault()
    const registerRequestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        password: this.state.password,
      })
    }

    const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/resetpass/${this.props.match.params.recoveryId}`

    fetch(fetchUrl, registerRequestOptions)
      .then(response => response.json())
      .then((data) => {
        this.setState({
          resetDone: true,
          resetSuccessful: true,
        })
      })
  }

  componentDidMount = () => {
    const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/resetexists/${this.props.match.params.recoveryId}`
    fetch(fetchUrl)
      .then(response => response.json())
      .then((data) => {
        this.setState({
          isLoading: false,
        })

        if (data.message !== 'ok') return false
        
        this.setState({
          canReset: true,
        })
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        })
      })
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
          {!this.state.resetDone &&
            <>
              {this.state.isLoading &&
                <Spinner 
                  style={{
                    background: 'red',
                  }}
                />
              }
              {!this.state.isLoading &&
                this.state.canReset ?
                  <>
                    <h3
                      className="bp3-heading"
                      style={{
                        margin: '0 0 24px 0',
                      }}
                    >
                    Restablecer contraseña
                    </h3>
                    <p>Escribe tu nueva contraseña:</p>
                    <form
                      action="submit"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
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
                      <FormGroup
                        label="Confirma contraseña"
                        labelFor="confirmPassword-input"
                        style={{
                          margin: '8px 0',
                        }}
                      >
                        <InputGroup
                          id="confirmPassword-input"
                          type="password"
                          onChange={(e) => this.setState({confirmPassword: e.target.value})}
                        />
                      </FormGroup>
                      <Button
                        type='submit'
                        intent={Intent.PRIMARY}
                        disabled={this.state.password !== this.state.confirmPassword}
                        text='Cambiar contraseña'
                        style={{
                          alignSelf: 'center',
                          width: '200px',
                          padding: '10px',
                          margin: '24px 0 0 0',
                        }}
                        onClick={this.handleReset}
                      />
                    </form>
                  </>
                  :
                  <p style={{margin: 0}}>
                    Este enlace no existe. Si crees que es un error, escríbenos: <a href='mailto:hola@seldocs.com'>hola@seldocs.com</a>
                  </p>
              }
            </>
          }
          {this.state.resetDone && this.state.resetSuccessful &&
            <>
              <p>
                ¡Bien! Tu contraseña se ha cambiado correctamente. Ahora ya puedes entrar con la nueva
              </p>
              <Button
                type='submit'
                intent={Intent.PRIMARY}
                text='Entrar'
                style={{
                  alignSelf: 'center',
                  width: '140px',
                  padding: '10px',
                  margin: '24px 0 0 0',
                }}
                onClick={() => this.props.history.push(`/entrar`)}
              />
            </>
          }
        </Card>
      </div>
    )
  }
};

export default withRouter(ResetPass)