import React from 'react'
import { Link } from 'react-router-dom'

import {
  Alignment,
  Breadcrumbs,
  Card,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

class Student extends React.Component {
  constructor() {
    super()

    this.state = {
      studentName: '',
      documents: [],
      isLoading: true,
    }
  }

  getDocuments = () => {
    fetch(`${REACT_APP_SERVER_BASE_URL}/documents`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoadingDocuments: false,
          documents: data || [],
        })
      })
  }

  renderDocuments = () => {
    if (this.state.isLoadingDocuments) return <div>Cargando...</div>

    if (this.state.documents.length < 1) return <div>Aún no tienes ningun documento.</div>

    return this.state.documents.map(document => (
      <li key={document._id}>
        <Card
          style={{
            padding: '8px',
            marginBottom: '12px',
          }}
        >
            <Link to={`/alumno/documento/${document._id}`}>{document.name}</Link>
        </Card>
      </li>
    ))
  }

  componentDidMount = () => {
    const studentName = localStorage.getItem('studentName') || window.prompt('¿Cómo te llamas?')

    fetch(`${REACT_APP_SERVER_BASE_URL}/student/${studentName}`)
      .then(response => response.json())
      .then(data => {
        if (!!data[0]?.name) {
          this.setState({
            isLoading: false,
            studentName: data[0].name,
            documents: data[0].documents || [],
          })
          localStorage.setItem('studentName', data[0].name)
        }
      })
  }

  render() {
    return (
      <div
        className='App'
        style={{
          display: 'flex',
          overflow: 'hidden',
          cursor: this.props.dragging ? 'grabbing' : 'default',
        }}
      >
        <div
          style={{
            width: '100%',
            cursor: this.props.dragging ? 'grabbing' : 'default',
          }}
        >
          <Navbar fixedToTop={true}>
            <NavbarGroup align={Alignment.LEFT}>
              <NavbarHeading
                style={{
                  marginRight: '8px'
                }}
              >
                <div style={{
                  maxHeight: '44px'
                }}>
                  <img 
                    style={{
                      maxHeight: '44px'
                    }}
                    src="/assets/images/logo-seltools.png"
                    alt= "Seltools"
                  />
                </div>
              </NavbarHeading>
              <NavbarDivider />
              <div
                style={{marginLeft: '8px'}}
              >
                <Breadcrumbs
                  // currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
                  items={[
                    { icon: 'folder-open',
                      text: 'Documentos',
                    },
                  ]}
                />
              </div>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
              {/* <NavbarDivider />
              <Button className={Classes.MINIMAL} icon="user" /> */}
            </NavbarGroup>
          </Navbar>
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              paddingTop: '70px',
            }}
          >
            <h1>Hola, {this.state.studentName}</h1>
            <p>Tus documentos:</p>
            <ul style={{
              margin: '32px 0',
              padding: '0',
              listStyle: 'none'
            }}>
              {this.renderDocuments()}
            </ul>

          </div>
        </div>
      </div>
    )
  }
}

export default Student