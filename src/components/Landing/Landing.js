import React from 'react'
import {
  AnchorButton,
  Card,
  Intent,
} from "@blueprintjs/core"

class Landing extends React.Component {
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
                alt= "Seltools"
              />
            </div>
            <div>
              <AnchorButton
                type='button'
                intent={Intent.PRIMARY}
                text='Área de profe'
                href='/documentos'
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
            <div>
              <Card
                style={{
                  width: '300px',
                  padding: '4px 16px 24px',
                  marginBottom: '12px',
                  border: 'none',
                  boxShadow: 'none',
                }}
              >
                <h2
                  style={{
                    marginBottom: '30px',
                  }}
                >¿Eres alumno?</h2>
                <AnchorButton
                  type='button'
                  intent={Intent.PRIMARY}
                  text='Entra en el área de alumno'
                  href='/alumno/documentos'
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Landing
