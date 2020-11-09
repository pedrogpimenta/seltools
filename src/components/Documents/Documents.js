import React from 'react'
import { withRouter } from 'react-router-dom'
import { store } from '../../store/store'
import { CirclePicker } from 'react-color';

import {
  Alignment,
  AnchorButton,
  Button,
  Callout,
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
        let newBreadcrumbs = [{icon: 'folder-open', text: this.state.user.name, id: this.state.user._id, type: 'folder'}]

        if (newBreadcrumbs.length > 0) {
          newBreadcrumbs = data.breadcrumbs.map(crumb => {
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
          newBreadcrumbs.unshift({icon: 'folder-open', text: this.state.user.username, id: this.state.user.userfolder, type: 'folder'})
        }

        this.setState({
          isLoadingDocuments: false,
          students: data.students || [],
          userDocuments: data.documents || [],
          breadcrumbs: newBreadcrumbs,
        })

        this.props.history.push(`/documentos/${folderId}`)
      })
  }

  getCurrentDialogContent = (folderId) => {
    this.setState({
      isLoadingDialogDocuments: true,
    })

    fetch(`${REACT_APP_SERVER_BASE_URL}/user/${'5f3633a4e93634d14b1df842'}/documents/${folderId}`)
      .then(response => response.json())
      .then(data => {
        let dialogBreadcrumbs = [{icon: 'folder-open', text: this.state.user.name, id: this.state.user._id, type: 'folder'}]

        if (dialogBreadcrumbs.length > 0) {
          dialogBreadcrumbs = data.breadcrumbs.map(crumb => {
            return({
              icon: 'folder-open',
              id: crumb._id,
              text: crumb.name,
              type: crumb.type,
            })
          })
        }

        dialogBreadcrumbs.push({icon: 'folder-open', text: data.folder.name, id: data.folder._id, type: data.folder.type})
      
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
          const currentDocuments = [...this.state.userDocuments]
          const index = currentDocuments.findIndex((document) => document._id === this.state.selectedDocumentId)

          if (index !== -1) {
            currentDocuments.splice(index, 1)
          }

          this.setState({
            userDocuments: currentDocuments,
            selectedDocumentId: null,
            selectedDocumentName: null,
          })
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
        this.getDocuments(this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id)
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
        this.getDocuments(this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id)
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

          this.setState({
            userDocuments: data,
          })
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
          this.getDocuments(this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id)
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
        this.getDocuments(this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id)
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
        this.getDocuments(this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id)
      })
  }

  renderDocuments = () => {
    if (this.state.isLoadingDocuments) return <div>Cargando...</div>

    const students = () => {
      if (this.state.students.length < 1)  {
        return (
          <div
            style={{
              display: 'flex',
              marginTop: '16px',
            }}
          >
            <Callout  
              title='¡No tienes alumnos!'
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                width: 'auto',
                padding: '24px',
                marginBottom: '16px',
              }}
            >
              <div 
                style={{
                  marginTop: '16px',
                }}
              >
                <Button
                  type='button'
                  icon='new-person'
                  intent={Intent.PRIMARY}
                  text='Nuevo alumno'
                  onClick={this.handleAddStudent}
                />
              </div>
            </Callout>
          </div>
        )
      } else {
        return (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '0 0 1rem 0',
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
                margin: '.5rem 0 3rem 0',
                padding: '0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                gridGap: '20px',
              }}
            >
              {this.state.students.map(student => {
                return (
                  <li
                    className='document-item'
                    key={student._id}
                    style={{
                      listStyle: 'none',
                    }}
                  >
                    <Card
                      className='document-item-card bp3-elevation-2'
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        // height: '4rem',
                        padding: '12px',
                      }}
                      onClick={() => {
                        this.getDocuments(student._id)
                      }}
                      onMouseEnter={() => {
                        this.setState({
                          currentDocumentOverId: student._id,
                          currentDocumentOverName: student.name,
                          currentDocumentOverType: student.type,
                        })
                      }}
                      onMouseLeave={() => {
                        this.setState({
                          currentDocumentOverId: null,
                          currentDocumentOverName: null,
                          currentDocumentOverType: null,
                        })
                      }}
                    >
                      <Icon
                        icon='user'
                        iconSize={Icon.SIZE_LARGE} 
                        color={student.color}
                        style={{
                          position: 'relative',
                          top: '1px',
                          marginRight: '8px',
                          pointerEvents: 'none',
                        }}
                      />
                      <h3 style={{
                        fontWeight: '400',
                        margin: '0',
                        pointerEvents: 'none'
                      }}>
                        {!!student.name.trim().length ? student.name : 'Documento sin nombre' }
                      </h3>
                    </Card>
                  </li>
                )
              })}
            </ul>
          </>
        )
      }
    }

    const documents = () => {
      if (this.state.userDocuments.length < 1)  {
        return (
          <div
            style={{
              display: 'flex',
              marginTop: '16px',
              // justifyContent: 'center',
            }}
          >
            <Callout  
              title='Carpeta vacía!'
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                padding: '24px',
                width: 'auto',
              }}
            >
              <div
                style={{
                  marginBottom: '16px',
                }}
              >
                Aún no tienes ningún documento.
              </div>
              <div>
                <AnchorButton
                  type='button'
                  icon='add'
                  intent={Intent.PRIMARY}
                  text='Nuevo documento'
                  href={`/documento?parent=${this.props.match.params.folder}`}
                  target='_blank'
                  style={{marginRight: '8px'}}
                />
                <Button
                  type='button'
                  icon='folder-new'
                  intent={Intent.PRIMARY}
                  text='Nueva carpeta'
                  onClick={this.handleAddFolder}
                />
              </div>
            </Callout>
          </div>
        )
      } else {
        return (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '0 0 1rem 0',
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
                  target='_blank'
                  style={{marginRight: '8px'}}
                />
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
                margin: '.5rem 0 3rem 0',
                padding: '0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gridGap: '20px',
                justifyItems: 'stretch',
              }}
            >
              {this.state.userDocuments.map(document => {
                const docType = document.type || 'document'
        
                return (
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
                        // minHeight: '6rem',
                        height: '100%',
                        overflow: 'hidden',
                        padding: '12px',
                      }}
                      onClick={() => {
                        if (docType === 'document') {
                          window.open(`/documento/${document._id}`, '_blank')
                        } else {
                          this.getDocuments(document._id)
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
                      {docType === 'document' &&
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
                      {docType === 'folder' &&
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
                )
              })}
            </ul>
          </>
        )
      }

    }

    return (
      <div>
        {this.state.breadcrumbs.length === 1 && students()}
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
      // this.getDocuments(this.props.match.params.folder)
    }

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

      // event.preventDefault()
      // this.setState({
      //   showPopoverMenu: true,
      //   menuTop: event.pageY,
      //   menuLeft: event.pageX,
      // })
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
        <li className='bp3-menu-header'>
          <h6 className='bp3-heading'>{this.state.selectedDocumentName}</h6>
        </li>
        <MenuDivider />
        <MenuItem
          icon="delete"
          text="Eliminar"
          intent={Intent.DANGER}
          onClick={(e) => this.handleDeleteDocument()}
        />
        {this.state.selectedDocumentType !== 'user' &&
          this.state.selectedDocumentType !== 'student' &&
          (!!this.state.breadcrumbs[1] && this.state.breadcrumbs[1].type === 'student') &&
          <MenuItem
            icon="share"
            text="Compartir"
            // intent={Intent.DANGER}
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
              this.getCurrentDialogContent(this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id)
              this.setState({isMoveDialogOpen: true})
            }}
          />
        }
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
                        <Icon icon='folder-open' className='bp3-icon' />
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
                        <Icon icon='folder-open' className='bp3-icon' />
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
              {this.state.dialogStudents.map((student, index) => {
                return (
                  <tr
                    onClick={() => {
                      this.getCurrentDialogContent(student._id)
                    }}
                  >
                    <td>
                      <Icon icon='user' />
                      <span style={{marginLeft: '8px'}}>{student.name}</span>
                    </td>
                  </tr>
                )
              })}
              {this.state.dialogDocuments.map((doc, index) => {
                return (
                  <tr
                    onClick={() => {
                      if (doc.type === 'document') return false
                      this.getCurrentDialogContent(doc._id)
                    }}
                  >
                    <td>
                      {doc.type === 'document' &&
                        <Icon icon='document' />
                      }
                      {doc.type !== 'document' &&
                        <Icon icon='folder-close' />
                      }
                      <span style={{marginLeft: '8px'}}>{doc.name}</span>
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