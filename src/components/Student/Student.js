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
      userDocuments: [],
      userFolders: [],
      isLoading: true,
      user: {},
    }
  }

  renderDocuments = () => {
    if (this.state.isLoadingDocuments) return <div>Cargando...</div>

    const renderDocument = (document) => {
      return (
        <li
          className='document-item'
          key={document._id}
          style={{
            listStyle: 'none',
          }}
        >
          <Card
            className='document-item-card bp3-elevation-1'
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '12px',
              overflow: 'hidden',
            }}
            onClick={() => {
              if (document.type === 'document') {
                this.props.history.push(`/alumno/documento/${document._id}`)
              } else {
                this.getDocuments(document._id)
              }
            }}
          >
              <Icon
                icon={document.type === 'document' ? 'document' : document.type === 'folder' ? 'folder-close' : 'user'}
                color={document.color || '#666'}
                style={{
                  marginRight: '6px',
                  pointerEvents: 'none',
                }}
              />
            <h4 style={{
              fontWeight: '400',
              margin: '0 0 0 4px',
              pointerEvents: 'none'
            }}>
              {!!document.name.trim().length ? document.name : 'Documento sin nombre' }
            </h4>
          </Card>
        </li>
      )
    }

    const folders = () => {
      if (this.state.userFolders.length === 0) return null

      return (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 0 .6rem 0',
          }}>
            <div
              style={{
                fontSize: '.8rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              Carpetas
            </div>
          </div>
          <ul
            className='documents__documents'
            style={{
              margin: '.5rem 0 2rem 0',
              padding: '0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              gridGap: '16px',
              justifyItems: 'stretch',
            }}
          >
            {this.state.userFolders.map(folder => renderDocument(folder))}
          </ul>
        </>
      )
    }

    const documents = () => {
      if (this.state.userDocuments.length === 0) return null

      return (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 0 .6rem 0',
          }}>
            <div
              style={{
                fontSize: '.8rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              Documentos
            </div>
          </div>
          <ul
            className='documents__documents'
            style={{
              margin: '.5rem 0 2rem 0',
              padding: '0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              gridGap: '16px',
              justifyItems: 'stretch',
            }}
          >
            {this.state.userDocuments.map(document => renderDocument(document))}
          </ul>
        </>
      )
    }

    return (
      <div>
        {folders()}
        {documents()}
      </div>
    )
  }

  getDocuments = (folderId) => {
    fetch(`${REACT_APP_SERVER_BASE_URL}/user/${this.state.user._id}/documents/${folderId}`)
      .then(response => response.json())
      .then(data => {
        let newBreadcrumbs = [{icon: 'folder-open', text: this.state.user.username, id: this.state.user._id, type: 'folder'}]

        if (newBreadcrumbs.length > 0) {
          newBreadcrumbs = data.breadcrumbs.map((crumb, i) => {
            return({
              icon: 'folder-open',
              id: crumb._id,
              text: crumb.name,
              type: crumb.type,
              color: crumb.color,
            })
          })
        }
        
        newBreadcrumbs.push({icon: 'folder-open', text: data.folder.name, id: data.folder._id, type: data.folder.type, color: data.folder.color})
      
        if (newBreadcrumbs[0].type === 'student') {
          newBreadcrumbs.unshift({icon: 'folder-open', text: this.state.user.username, id: this.state.user._id, type: 'folder'})
        }

        const folders = data.documents.filter(doc => doc.type === 'folder')
        const documents = data.documents.filter(doc => doc.type === 'document')

        this.setState({
          isLoadingDocuments: false,
          userFolders: folders || [],
          userDocuments: documents || [],
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
          user: userData,
        })
        localStorage.setItem('studentName', userData.username)
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
          minHeight: '100vh',
          overflow: 'hidden',
          backgroundColor: '#f8f8f8',
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
                            {crumb.type === 'student' && 
                              <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', 
                                width: '18px',
                                height: '18px',
                                backgroundColor: crumb.color || 'black',
                                color: 'white',
                                borderRadius: '50%',
                                marginRight: '6px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                              }}
                            >
                              {crumb.text.substr(0, 1).toUpperCase()}
                            </div>
                            }
                            {crumb.type !== 'student' && 
                              <Icon
                                icon={icon}
                                color={crumb.color || '#666'}
                                className='bp3-icon'
                              />
                            }
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
                            {crumb.type === 'student' && 
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center', 
                                  width: '18px',
                                  height: '18px',
                                  backgroundColor: crumb.color || 'black',
                                  color: 'white',
                                  borderRadius: '50%',
                                  marginRight: '6px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                }}
                              >
                                {crumb.text.substr(0, 1).toUpperCase()}
                              </div>
                            }
                            {crumb.type !== 'student' && 
                              <Icon
                                icon={icon}
                                color={crumb.color || '#666'}
                                className='bp3-icon'
                              />
                            }
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
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <h1
              style={{
                margin: '0 0 2rem 0',
              }}
            >
              ¡Hola, {this.state.user.username}!
            </h1>
            <div style={{
              margin: '0 0 32px',
            }}>
              {this.renderDocuments()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Student)