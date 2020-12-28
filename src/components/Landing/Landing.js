import React from 'react'
import {
  withRouter
} from "react-router-dom"
import {
  Button,
  Intent,
} from "@blueprintjs/core"

class Landing extends React.Component {
  componentDidMount = () => {
    if (window.goatcounter) {
      window.goatcounter.count({
        path: this.props.location.pathname + this.props.location.search + this.props.location.hash,
      })
    }
  }
  
  render() {
    return (
      <div>
        <div
          style={{
            backgroundColor: '#FFE8E6',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: '900px',
              margin: '0 auto 30px',
              padding: '16px',
            }}
          >
            <div>
              <img
                style={{
                  height: '80px',
                }}
                src="/assets/images/logo-seltools.png"
                alt= "Seldocs"
              />
            </div>
            <div>
              <Button
                type='button'
                intent={Intent.PRIMARY}
                text='Registro'
                onClick={() => this.props.history.push('/registro')}
              />
            </div>
            <div>
              <Button
                type='button'
                intent={Intent.PRIMARY}
                text='Entrar'
                onClick={() => this.props.history.push('/entrar')}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              maxWidth: '900px',
              margin: '0 auto 30px',
              padding: '0 16px 80px',
            }}
          >
            <div
              style={{
                // width: '60%',
              }}
            >
              <h1
                style={{
                  fontSize: '3em',
                  maxWidth: '400px',
                  margin: '0',
                }}
              >
                Una ayudita para profes y alumnos online
              </h1>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Landing)
