import React from 'react'
import { withRouter } from 'react-router-dom'
import { store } from '../../store/store'
import { CirclePicker } from 'react-color';

import {
  Alignment,
  AnchorButton,
  Button,
  Classes,
  Card,
  Dialog,
  HTMLTable,
  Icon,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

class Documents extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoadingStudents: true,
      isLoadingDocuments: true,
      user: {},
      userFolders: [],
      userDocuments: [],
      // documents: [],
      students: [],
      isUserAllowed: false,
      currentDocumentOverId: null,
      selectedDocumentId: null,
      selectedDocumentName: null,
      isMoveDialogOpen: false,
      isLoadingDialogDocuments: false,
      dialogStudents: [],
      dialogFolder: {},
      dialogDocuments: [],
      dialogBreadcrumbs: [],
      showPopoverMenu: false,
      menuTop: 0,
      menuLeft: 0,
      currentPath: [],
      currentPathName: [],
      breadcrumbs: [
        { icon: 'folder-open',
          text: 'Documentos',
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

        this.getDocuments(this.props.match.params.folder || data.user.userfolder)
      })

  }
  
  getDocuments = (folderId) => {
    fetch(`${REACT_APP_SERVER_BASE_URL}/user/${this.state.user._id}/documents/${folderId}`)
      .then(response => response.json())
      .then(data => {
        let newBreadcrumbs = [
          {icon: 'folder-open',
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

        document.title = `${data.folder.name} -- Seltools STAGING`;
        // this.props.history.push(`/documentos/${folderId}`)
      })
  }

  getCurrentDialogContent = (folderId) => {
    this.setState({
      isLoadingDialogDocuments: true,
    })

    fetch(`${REACT_APP_SERVER_BASE_URL}/user/${'5f3633a4e93634d14b1df842'}/documents/${folderId}`)
      .then(response => response.json())
      .then(data => {
        let dialogBreadcrumbs = [{
          icon: 'folder-open',
          text: this.state.user.name,
          id: this.state.user._id,
          type: 'folder',
        }]

        if (dialogBreadcrumbs.length > 0) {
          dialogBreadcrumbs = data.breadcrumbs.map(crumb => {
            return({
              icon: 'folder-open',
              id: crumb._id,
              text: crumb.name,
              type: crumb.type,
              color: crumb.color
            })
          })
        }

        dialogBreadcrumbs.push({icon: 'folder-open', text: data.folder.name, id: data.folder._id, type: data.folder.type,  color: data.folder.color})
      
        if (dialogBreadcrumbs[0].type === 'student') {
          dialogBreadcrumbs.unshift({icon: 'folder-open', text: this.state.user.username, id: this.state.user.userfolder, type: 'folder'})
        }

        this.setState({
          isLoadingDialogDocuments: false,
          dialogStudents: data.students || [],
          dialogFolder: data.folder || [],
          dialogDocuments: data.documents || [],
          dialogBreadcrumbs: dialogBreadcrumbs || [],
        })
      })
  }

  handleDeleteDocument = () => {
    const confirmDelete = window.confirm('¿Quieres eliminar el documento?')

    if (confirmDelete) {
      const requestOptions = {
        method: 'DELETE',
      }

      const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${this.state.selectedDocumentId}`

      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          this.props.history.push(`/documentos/${this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id}`)
        })
    }
  }

  handleShareDocument = () => {
    const documentObject = {
      shared: !this.state.selectedDocumentShared,
    }

    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    let fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${this.state.selectedDocumentId}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        this.props.history.push(`/documentos/${this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id}`)
      })
  }

  handleMoveDocument = () => {
    const documentObject = {
      parentId: this.state.dialogFolder._id,
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
        this.props.history.push(`/documentos/${this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id}`)
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

          this.props.history.push(`/documentos/${parent}`)
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

  handleRename = (documentId, documentName) => {
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
  
      let fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${this.state.selectedDocumentId}`
  
      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          this.props.history.push(`/documentos/${this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id}`)
        })
    }

  }

  handleColorChange = (color) => {
    const documentObject = {
      color: color.hex,
    }

    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    let fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${this.state.selectedDocumentId}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        this.props.history.push(`/documentos/${this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id}`)
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
        this.props.history.push(`/documentos/${this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id}`)
      })
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
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '12px',
              overflow: 'hidden',
            }}
            onClick={() => {
              if (document.type === 'document') {
                this.props.history.push(`/documento/${document._id}`)
              } else {
                this.props.history.push(`/documentos/${document._id}`)
              }
            }}
            onMouseEnter={() => {
              this.setState({
                currentDocumentOverId: document._id,
                currentDocumentOverName: document.name,
                currentDocumentOverShared: document.shared,
                currentDocumentOverType: document.type,
              })
            }}
            onMouseLeave={() => {
              this.setState({
                currentDocumentOverId: null,
                currentDocumentOverName: null,
                currentDocumentOverShared: null,
              })
            }}
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
                  fontWeight: 'bold',
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
                  pointerEvents: 'none',
                }}
              />
            }
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
      // if (action !== 'PUSH') return false
      const locationArray = location.pathname.split('/')
      const docId = locationArray[locationArray.length - 1]
      console.log('ola:', this.props.match.params.folder)
      console.log('ola2:', docId)
      this.getDocuments(docId)
    })

    document.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      const clickedADocument = event.target.classList.contains('document-item-card')

      if (!!this.state.currentDocumentOverId && clickedADocument) {
        this.setState({
          selectedDocumentId: this.state.currentDocumentOverId,
          selectedDocumentName: this.state.currentDocumentOverName,
          selectedDocumentShared: this.state.currentDocumentOverShared,
          selectedDocumentType: this.state.currentDocumentOverType,
          showPopoverMenu: true,
          menuTop: event.pageY,
          menuLeft: event.pageX,
        })
      }
    })

    document.addEventListener('click', (event) => {
      window.setTimeout(() => {
        if (this.state.showPopoverMenu === true) {
          this.setState({showPopoverMenu: false})
        }
      }, 100)
    })
  }

  renderPopoverMenu = () => {
    return (
      <Menu
        className={Classes.ELEVATION_2}
        style={{
          position: 'absolute',
          top: `${this.state.menuTop}px`,
          left: `${this.state.menuLeft}px`,
        }}
      >
        <MenuItem
          icon="share"
          text="Abrir en una pestaña nueva"
          onClick={(e) => window.open(this.state.selectedDocumentType === 'document' ? `/documento/${this.state.selectedDocumentId}` : `/documentos/${this.state.selectedDocumentId}`, '_blank')}
        />
        <MenuDivider />
        {this.state.selectedDocumentType !== 'user' &&
          this.state.selectedDocumentType !== 'student' &&
          (!!this.state.breadcrumbs[1] && this.state.breadcrumbs[1].type === 'student') &&
          <MenuItem
            icon={this.state.selectedDocumentType === 'document' ? 'document-share' : 'folder-shared'}
            text="Compartir"
            labelElement={this.state.selectedDocumentShared ? <Icon icon="tick" /> : <Icon icon="cross" />} 
            onClick={(e) => this.handleShareDocument(this.state.selectedDocumentId)}
          />
        }
        <MenuItem
          icon="edit"
          text="Cambiar nombre..."
          onClick={(e) => this.handleRename(this.state.selectedDocumentId, this.state.selectedDocumentName)}
        />
        <MenuItem
          icon="tint"
          text="Color"
        >
          <div
            style={{padding: '8px'}}
          >
            <CirclePicker 
              onChange={this.handleColorChange} 
              colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b", "#000"]}
            />
          </div>
        </MenuItem>
        {this.state.selectedDocumentType === 'document' &&
          <MenuItem
            icon="duplicate"
            text="Duplicar"
            onClick={(e) => this.handleCloneDocument(this.state.selectedDocumentId)}
          />
        }
        {this.state.selectedDocumentType === 'document' &&
          <MenuItem
            icon="add-to-folder"
            text="Mover a..."
            onClick={(e) => {
              this.getCurrentDialogContent(this.state.breadcrumbs[0].id)
              this.setState({isMoveDialogOpen: true})
            }}
          />
        }
        <MenuItem
          icon="delete"
          text="Eliminar"
          intent={Intent.DANGER}
          onClick={(e) => this.handleDeleteDocument()}
        />
      </Menu>
    )
  }

  renderMoveDialog = () => {
    return (
      <Dialog
        title={`Mover "${this.state.selectedDocumentName}" a:`}
        isOpen={this.state.isMoveDialogOpen}
        onClose={() => this.setState({isMoveDialogOpen: false})}
      >
        <div className={Classes.DIALOG_BODY}>
          <div
            style={{marginLeft: '8px', marginBottom: '8px'}}
          >
            <ul className='bp3-overflow-list bp3-breadcrumbs'>
              {this.state.dialogBreadcrumbs.map((crumb, i) => {
                if (this.state.dialogBreadcrumbs.length - 1 === i) {
                  return (
                    <li>
                      <span className={`bp3-breadcrumb bp3-breadcrumb-current`}>
                        <Icon
                          icon={crumb.type === 'folder' ? 'folder-close' : 'user'}
                          color={crumb.color}
                          className='bp3-icon' />
                        {crumb.text}
                      </span>
                    </li>
                  )
                } else {
                  return (
                    <li style={{cursor: 'pointer'}}>
                      <span className='bp3-breadcrumb' onClick={() => {
                        this.getCurrentDialogContent(crumb.id)
                      }}>
                        <Icon
                          icon={crumb.type === 'folder' ? 'folder-close' : 'user'}
                          color={crumb.color}
                          className='bp3-icon' />
                        {crumb.text}
                      </span>
                    </li>
                  )
                }}
              )}
            </ul>
          </div>
          <HTMLTable
            style={{
              width: '100%',
              background: 'white',
              boxShadow: '0 0 0 1px rgba(0, 0, 0, .1), inset 0px 1px 3px 0 rgba(0, 0, 0, .1)',
              minHeight: '100px',
            }}
            interactive={true}
            striped={true}
          >
            <tbody>
              {this.state.dialogStudents.map((student) => {
                return (
                  <tr
                    onClick={() => {
                      this.getCurrentDialogContent(student._id)
                    }}
                  >
                    <td>
                      <Icon
                        icon='user'
                        color={student.color || '#666'}
                      />
                      <span style={{marginLeft: '6px'}}>{student.name}</span>
                    </td>
                  </tr>
                )
              })}
              {this.state.dialogDocuments.map((doc) => {
                return (
                  <tr
                    style={{
                      pointerEvents: doc.type === 'document' ? 'none' : 'all',
                    }}
                    onClick={() => {
                      if (doc.type === 'document') return false
                      this.getCurrentDialogContent(doc._id)
                    }}
                  >
                    <td>
                      <Icon
                        icon={doc.type === 'document' ? 'document' : 'folder-close'}
                        color={doc.color || '#666'}
                      />
                      <span
                        style={{
                          marginLeft: '8px',
                          opacity: doc.type === 'document' ? '.4' : '1',
                        }}
                      >
                        {doc.name}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </HTMLTable>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              intent={Intent.PRIMARY}
              onClick={() => {
                this.handleMoveDocument()
                this.setState({isMoveDialogOpen: false})
              }}
            >
              Mover a "{this.state.dialogFolder.name}"
            </Button>
          </div>
        </div>
      </Dialog>
    )
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
          <Navbar fixedToTop={true}>
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
                    const icon = crumb.type === 'folder' ? 'folder-open' : 'user'
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
                            this.props.history.push(`/documentos/${crumb.id}`)
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
                  {this.renderDocuments()}
                </div>
              </div>
            </div>
          </div>
          {this.state.isMoveDialogOpen && this.renderMoveDialog()}
          {this.state.showPopoverMenu && this.renderPopoverMenu()}
        </div>
      </div>
    )
  }
}

export default withRouter(Documents)