import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { store } from '../../store/store'
import { cloneDeep } from 'lodash'

import {
  Alignment,
  AnchorButton,
  Button,
  Classes,
  Card,
  Icon,
  Intent,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Spinner,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

import MoveDialog from '../MoveDialog/MoveDialog'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import IconSel from '../IconSel/IconSel'

class Documents extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoadingDocuments: true,
      user: {},
      userFolders: [],
      userDocuments: [],
      students: [],
      isUserAllowed: false,
      selectedDocumentId: null,
      selectedDocumentName: null,
      isMoveDialogOpen: false,
      breadcrumbs: [
        { icon: 'folder-open',
          text: 'Selen',
        },
      ],
    }
  }

  auth = () => {
    if (this.state.isUserAllowed) return null

    const pass = window.prompt('¿Cuál es tu contraseña?')

    if (pass === 'amor') {
      this.setState({isUserAllowed: true})
      localStorage.setItem('isUserAllowed', true)
    }
  }

  getUser = () => {
    fetch(`${REACT_APP_SERVER_BASE_URL}/user/Selen`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          user: data.user,
        })

        // this.getDocuments(this.props.match.params.folder || data.user.userfolder)
        this.props.history.push(`/documentos/${this.props.match.params.folder || data.user.userfolder}`)
      })

  }
  
  getDocuments = (folderId) => {
    this.setState({
      isLoadingDocuments: true,
    })

    fetch(`${REACT_APP_SERVER_BASE_URL}/user/${this.state.user._id}/documents/${folderId}`)
      .then(response => response.json())
      .then(data => {
        let newBreadcrumbs = [{
          icon: <IconSel />,
          text: this.state.user.name,
          id: this.state.user._id,
          type: 'folder'
        }]

        if (newBreadcrumbs.length > 0) {
          newBreadcrumbs = data.breadcrumbs.map(crumb => {
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
          newBreadcrumbs.unshift({icon: 'folder-open', text: this.state.user.username, id: this.state.user.userfolder, type: 'folder'})
        }

        const folders = data.documents.filter(doc => doc.type === 'folder')
        const documents = data.documents.filter(doc => doc.type === 'document')

        this.setState({
          isLoadingDocuments: false,
          students: data.students || [],
          userFolders: folders || [],
          userDocuments: documents || [],
          breadcrumbs: newBreadcrumbs,
        })

        document.title = `${data.folder.name} -- Seltools`;
        // this.props.history.push(`/documentos/${folderId}`)
      })
  }

  handleDeleteDocument = (documentId, documentName, documentType) => {
    const confirmDelete = window.confirm(`¿Quieres eliminar "${documentName}"?`)

    if (confirmDelete) {
      const requestOptions = {
        method: 'DELETE',
      }

      const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${documentId}`

      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.ok !== 1) return false

          const updatedDocs = documentType === 'document' ?
            this.state.userDocuments.filter((doc) => doc._id !== documentId) :
            documentType === 'folder' ?
              this.state.userFolders.filter((doc) => doc._id !== documentId) :
              this.state.students.filter((doc) => doc._id !== documentId)

          if (documentType === 'document') {
            this.setState({
              userDocuments: updatedDocs
            })
          } else if (documentType === 'folder') {
            this.setState({
              userFolders: updatedDocs
            })
          } else {
            this.setState({
              students: updatedDocs
            })
          }
        })
    }
  }

  handleShareDocument = (documentId, documentShared, documentType) => {
    const documentObject = {
      shared: !documentShared,
    }

    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    let fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${documentId}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.ok !== 1) return false

        const updatedDocs = documentType === 'document' ? [...this.state.userDocuments] : documentType === 'folder' ? [...this.state.userFolders] : [...this.state.students]

        const docIndex = updatedDocs.findIndex((doc) => doc._id === documentId)
        updatedDocs[docIndex].shared = !updatedDocs[docIndex].shared

        if (documentType === 'document') {
          this.setState({
            userDocuments: updatedDocs
          })
        } else if (documentType === 'folder') {
          this.setState({
            userFolders: updatedDocs
          })
        } else {
          this.setState({
            students: updatedDocs
          })
        }
      })
  }

  handleMoveDocument = (folderId, documentId) => {
    const documentObject = {
      parentId: folderId,
    }

    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    let fetchUrl = `${REACT_APP_SERVER_BASE_URL}/documentmove/${this.state.selectedDocumentId}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
          if (data.ok !== 1) return false
          const documents = this.state.userDocuments.filter((doc) => doc._id !== documentId)

          this.setState({
            userDocuments: documents
          })
      })
  }

  handleAddFolder = () => {
    const folderName = window.prompt('¿Qué nombre tiene la nueva carpeta?')

    if (!!folderName && folderName.length > 0) {
      const parent = this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: folderName,
          parent: parent,
          type: 'folder',
        })
      }

      const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/folder/`

      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then((data) => {

          this.getDocuments(parent)
          // this.props.history.push(`/documentos/${parent}`)
        })
    }
  }

  handleAddStudent = () => {
    const studentName = window.prompt('¿Cómo se llama tu nuevo alumno?')

    if (!!studentName && studentName.length > 0) {
      const parent = this.state.breadcrumbs[0].id

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: studentName,
          parent: parent,
          type: 'student',
        })
      }

      const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/folder/`

      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then((data) => {

          this.setState({
            students: data,
          })
        })
    }
  }

  handleRename = (documentId, documentName, documentType) => {
    const newName = window.prompt('Cambia el nombre:', documentName)

    if (!!newName) {
      const documentObject = {
        parentId: this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id,
        name: newName,
      }
  
      const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(documentObject)
      }
  
      let fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${documentId}`
  
      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.ok !== 1) return false

          const updatedDocs = documentType === 'document' ? [...this.state.userDocuments] : documentType === 'folder' ? [...this.state.userFolders] : [...this.state.students]

          const docIndex = updatedDocs.findIndex((doc) => doc._id === documentId)
          updatedDocs[docIndex].name = newName
  
          if (documentType === 'document') {
            this.setState({
              userDocuments: updatedDocs
            })
          } else if (documentType === 'folder') {
            this.setState({
              userFolders: updatedDocs
            })
          } else {
            this.setState({
              students: updatedDocs
            })
          }
        })
    }

  }

  handleColorChange = (color, documentId, documentType) => {
    const documentObject = {
      color: color.hex,
    }

    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    let fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${documentId}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.ok !== 1) return false

        const updatedDocs = documentType === 'document' ? [...this.state.userDocuments] : documentType === 'folder' ? [...this.state.userFolders] : [...this.state.students]

        const docIndex = updatedDocs.findIndex((doc) => doc._id === documentId)
        updatedDocs[docIndex].color = color.hex

        if (documentType === 'document') {
          this.setState({
            userDocuments: updatedDocs
          })
        } else if (documentType === 'folder') {
          this.setState({
            userFolders: updatedDocs
          })
        } else {
          this.setState({
            students: updatedDocs
          })
        }

      })
  }

  handleCloneDocument = (documentId) => {
    const requestOptions = {
      method: 'POST',
    }

    let fetchUrl = `${REACT_APP_SERVER_BASE_URL}/documentclone/${documentId}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (!data.id) return false

        const updatedDocs = [...this.state.userDocuments]
        const docIndex = updatedDocs.findIndex((doc) => doc._id === documentId)
        const newDoc = cloneDeep(updatedDocs[docIndex])
        newDoc._id = data.id
        newDoc.name = newDoc.name + ' Clone'
        newDoc.shared = false
        updatedDocs.unshift(newDoc)

        this.setState({userDocuments: updatedDocs})
      })
  }

  handleMoveDialogOpen = (documentId, documentName) => {
    this.setState({
      isMoveDialogOpen: true,
      selectedDocumentId: documentId,
      selectedDocumentName: documentName,
    })
  }

  renderMoveDialog = () => {
    if (!this.state.isMoveDialogOpen) return false

    return(
      <MoveDialog
        initialFolder={this.state.breadcrumbs[0].id}
        user={this.state.user}
        selectedDocumentId={this.state.selectedDocumentId}
        selectedDocumentName={this.state.selectedDocumentName}
        handleCloseButton={() => this.setState({isMoveDialogOpen: false})}
        handleMoveDocument={(folderId, documentId) => this.handleMoveDocument(folderId, documentId)}
      >
      </MoveDialog>
    )
  }

  renderDocuments = () => {
    const renderDocument = (document) => {
      return (
        <li
          key={document._id}
          className='document-item'
          style={{
            position: 'relative',
            listStyle: 'none',
          }}
        >
          <Card
            className='document-item-card bp3-elevation-1'
            style={{
              padding: '0',
            }}
          >
            <Link
              style={{
                position: 'relative',
                display: 'flex',
                height: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '8px',
                overflow: 'hidden',
              }}
              to={`/${document.type === 'document' ? 'documento' : 'documentos'}/${document._id}`}
            >
              {document.type === 'student' &&
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center', 
                    width: '18px',
                    height: '18px',
                    backgroundColor: document.color || 'black',
                    color: 'white',
                    borderRadius: '50%',
                    marginRight: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    userSelect: 'none',
                  }}
                >
                  {document.name.substr(0, 1).toUpperCase()}
                </div>
              }
              {document.type !== 'student' &&
                <Icon
                  icon={document.type === 'document' && document.shared === true ? 'document-share' :
                        document.type === 'document' ? 'document' :
                        document.type === 'folder' && document.shared === true ? 'folder-shared' :
                        document.type === 'folder' ? 'folder-close' :
                        'user'}
                  color={document.color || '#888'}
                  style={{
                    marginRight: '6px',
                    // pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                />
              }
              <h4
                style={{
                  flex: '1',
                  fontWeight: '300',
                  margin: '0 0 0 4px',
                  // pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {!!document.name.trim().length ? document.name : 'Documento sin nombre' }
              </h4>
            </Link>
          </Card>
            <Popover
              autoFocus={false}
              content={<DropdownMenu
                documentId={document._id}
                documentName={document.name}
                documentType={document.type}
                documentShared={document.shared}
                breadcrumbs={this.state.breadcrumbs}
                handleShareDocument={this.handleShareDocument}
                handleRename={this.handleRename}
                handleColorChange={this.handleColorChange}
                handleCloneDocument={this.handleCloneDocument}
                handleDeleteDocument={this.handleDeleteDocument}
                handleMoveDialogOpen={this.handleMoveDialogOpen}
              />}
            >
              <div
                className={'card-actions'}
                style={{
                  background: 'rgb(197, 197, 197)',
                  padding: '4px',
                  borderRadius: '3px',
                  lineHeight: '0',
                }}
              >
                <Icon
                  icon='more'
                  color='white'
                />
              </div>
            </Popover>
        </li>
      )
    }

    const students = () => {
      return (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 0 .5rem 0',
          }}>
            <div style={{
              fontSize: '.8rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}>
              Alumnos
            </div>
            <div>
              <Button
                type='button'
                icon='new-person'
                className={Classes.MINIMAL}
                intent={Intent.PRIMARY}
                text='Nuevo alumno'
                onClick={this.handleAddStudent}
              />
            </div>
          </div>
          <ul
            className='documents__students'
            style={{
              margin: '.5rem 0 2rem 0',
              padding: '0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              gridGap: '16px',
            }}
          >
            {this.state.students.map(student => renderDocument(student))}
          </ul>
        </>
      )
    }

    const folders = () => {
      return (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 0 .5rem 0',
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
            <div>
              <Button
                type='button'
                icon='folder-new'
                className={Classes.MINIMAL}
                intent={Intent.PRIMARY}
                text='Nueva carpeta'
                onClick={this.handleAddFolder}
              />
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
      return (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 0 .5rem 0',
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
            <div>
              <AnchorButton
                type='button'
                icon='add'
                className={Classes.MINIMAL}
                intent={Intent.PRIMARY}
                text='Nuevo documento'
                href={`/documento?parent=${this.props.match.params.folder}`}
                style={{marginRight: '8px'}}
              />
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
        {this.state.breadcrumbs.length === 1 && students()}
        {folders()}
        {documents()}
      </div>
    )
  }

  componentDidMount = () => {
    
    store.dispatch({
      type: 'CHANGE_DOCUMENT_BREADCRUMBS',
      breadcrumbs: [],
    })

    store.dispatch({
      type: 'LOAD_FILES',
      files: [],
      filesOnLoad: [],
    })

    if (!localStorage.getItem('isUserAllowed')) {
      this.auth()
    }

    if (localStorage.getItem('isUserAllowed')) {
      this.getUser()
    }
    
    this.props.history.listen((location, action) => {
      if (action !== 'PUSH') return false
      const locationArray = location.pathname.split('/')
      const docId = locationArray[locationArray.length - 1]
      this.getDocuments(docId)
    })
  }

  render() {
    if (!localStorage.getItem('isUserAllowed')) return <div>No eres Selen!</div>

    return (
      <div
        className='App'
        style={{
          display: 'flex',
          minHeight: '100vh',
          overflow: 'hidden',
          backgroundColor: '#f8f8f8',
          // cursor: this.props.dragging ? 'grabbing' : 'default',
        }}
      >
        <div
          style={{
            width: '100%',
            // cursor: this.props.dragging ? 'grabbing' : 'default',
          }}
        >
          <Navbar
            fixedToTop={true}
            style={{
              background: 'var(--c-primary-lightest)',
            }}
          >
            <NavbarGroup align={Alignment.LEFT}>
              <NavbarHeading
                style={{
                  marginRight: '8px'
                }}
              >
                <div style={{
                  maxHeight: '44px',
                  overflow: 'hidden',
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
                    const icon = crumb.type === 'folder' ? 'folder-open' : <IconSel />
                    return (
                      <li key={`crumb-${crumb.id}`}>
                        <span
                          className={`bp3-breadcrumb ${this.state.breadcrumbs.length - 1 === i ? 'bp3-breadcrumb-current' : ''}`}
                          onClick={() => {
                            this.state.breadcrumbs.length - 1 !== i && this.props.history.push(`/documentos/${crumb.id}`)
                          }}
                        >
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
                                fontWeight: '700',
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
                    )}
                  )}
                </ul>
              </div>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
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
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
              >
              <div
                style={{
                  width: '100%',
                }}
              >
                <div style={{
                  margin: '0 0 32px',
                }}>
                  {!this.state.isLoadingDocuments &&
                    this.renderDocuments()
                  }
                </div>
              </div>
            </div>
          </div>
          {this.state.isLoadingDocuments &&
            <Spinner 
              style={{
                background: 'red',
              }}
            />
          }
          {this.renderMoveDialog()}
        </div>
      </div>
    )
  }
}

export default withRouter(Documents)