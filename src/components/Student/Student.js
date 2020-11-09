import React from 'react'
import { withRouter } from 'react-router-dom'

import {
  Alignment,
  Card,
  Icon,
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
      studentId: null,
      studentName: null,
      breadcrumbs: [],
      documents: [],
      isLoading: true,
    }
  }

  renderDocuments = () => {
    if (this.state.isLoadingDocuments) return <div>Cargando...</div>

    if (this.state.documents.length < 1) return <div>Aún no tienes ningún documento.</div>

    return this.state.documents.map(document => (
      <li
        className='document-item'
        key={document._id}
        style={{
          listStyle: 'none',
        }}
      >
        <Card
          className='document-item-card bp3-elevation-2'
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            height: '100%',
            overflow: 'hidden',
            padding: '12px',
          }}
          onClick={() => {
            if (document.type === 'document') {
              window.open(`/alumno/documento/${document._id}`, '_blank')
            } else {
              this.getDocuments(document._id)
            }
          }}
        >
          {document.type === 'document' &&
            <Icon
              icon='document'
              iconSize={Icon.SIZE_LARGE} 
              color={document.color}
              style={{
                marginRight: '6px',
                pointerEvents: 'none',
              }}
            />
          }
          {document.type === 'folder' &&
            <Icon
              icon='folder-close'
              iconSize={Icon.SIZE_LARGE} 
              color={document.color}
              style={{
                marginRight: '6px',
                pointerEvents: 'none',
              }}
            />
          }
          <h3 style={{
            fontWeight: '400',
            margin: '8px 0 0 0',
            pointerEvents: 'none'
          }}>
            {!!document.name.trim().length ? document.name : 'Documento sin nombre' }
          </h3>
        </Card>
      </li>
    ))
  }

  getDocuments = (folderId) => {
    fetch(`${REACT_APP_SERVER_BASE_URL}/user/${this.state.studentId}/documents/${folderId}`)
      .then(response => response.json())
      .then(data => {
        let newBreadcrumbs = [{icon: 'folder-open', text: this.state.studentName, id: this.state.studentId, type: 'folder'}]

        if (newBreadcrumbs.length > 0) {
          newBreadcrumbs = data.breadcrumbs.map((crumb, i) => {
            return({
              icon: 'folder-open',
              id: crumb._id,
              text: crumb.name,
              type: crumb.type,
            })
          })
        }
        
        newBreadcrumbs.push({icon: 'folder-open', text: data.folder.name, id: data.folder._id, type: data.folder.type})
      
        if (newBreadcrumbs[0].type === 'student') {
          newBreadcrumbs.unshift({icon: 'folder-open', text: this.state.studentName, id: this.state.studentFolderId, type: 'folder'})
        }

        this.setState({
          isLoadingDocuments: false,
          documents: data.documents || [],
          breadcrumbs: newBreadcrumbs,
        })

        this.props.history.push(`/alumno/documentos/${folderId}`)
      })
  }

  componentDidMount = () => {
    const studentName = localStorage.getItem('studentName') || window.prompt('¿Cómo te llamas?')

    fetch(`${REACT_APP_SERVER_BASE_URL}/student/${studentName}`)
      .then(response => response.json())
      .then(userData => {
        this.setState({
          studentName: userData.name,
          studentId: userData._id,
          studentFolderId: userData.folderId,
        })
        localStorage.setItem('studentName', userData.name)
        localStorage.setItem('studentId', userData._id)
        localStorage.setItem('studentFolderId', userData.folderId)

        this.getDocuments(this.props.match.params.folderId || userData.folderId)
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
                <ul className='bp3-overflow-list bp3-breadcrumbs'>
                  {this.state.breadcrumbs.map((crumb, i) => {
                    const icon = crumb.type === 'folder' ? 'folder-open' : 'user'

                    if (i === 0) return false
                    
                    if (this.state.breadcrumbs.length - 1 === i) {
                      return (
                        <li>
                          <span className={`bp3-breadcrumb bp3-breadcrumb-current`}>
                            <Icon style={{position: 'relative', top: '1px',}} icon={icon} className='bp3-icon' />
                            {crumb.text}
                          </span>
                        </li>
                      )
                    } else {
                      return (
                        <li style={{cursor: 'pointer'}}>
                          <span className='bp3-breadcrumb' onClick={() => {
                            this.getDocuments(crumb.id)
                          }}>
                            <Icon style={{position: 'relative', top: '1px',}} icon={icon} className='bp3-icon' />
                            {crumb.text}
                          </span>
                        </li>
                      )

                    }}
                  )}
                </ul>
              </div>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
              {/* <NavbarDivider />
              <Button className={Classes.MINIMAL} icon="user" /> */}
            </NavbarGroup>
          </Navbar>
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              paddingTop: '70px',
            }}
          >
            <h1
              style={{
                margin: '0 0 2rem 0',
              }}
            >
              ¡Hola, {this.state.studentName}!
            </h1>
            <ul style={{
              margin: '.5rem 0 3rem 0',
              padding: '0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gridGap: '20px',
              justifyItems: 'stretch',
            }}>
              {this.renderDocuments()}
            </ul>

          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Student)