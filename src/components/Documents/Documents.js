import React from 'react'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { store } from '../../store/store'
import { CirclePicker } from 'react-color';

import {
  Alignment,
  AnchorButton,
  Breadcrumbs,
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
  Popover,
  Tooltip,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

import TeacherStudents from '../TeacherStudents/TeacherStudents'

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

  renderStudents = () => {
    if (this.state.isLoadingStudents) return <div>Cargando...</div>

    if (this.state.students < 1) return <div>No tienes estudiantes, añade uno:</div>

    return this.state.students.sort((a, b) => a.name > b.name ? 1 : -1).map(student => (
      <li
        key={student._id}
      >
        {/* <div
          style={{padding: '4px 0'}}
        > */}
        <Card
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '8rem',
            padding: '8px',
            marginBottom: '12px',
          }}
        >
          <Icon
            icon='user'
            style={{marginRight: '6px'}}
          />
            {student.name}
        </Card>
        {/* </div> */}
      </li>
    ))
  }

  handleAddStudentOLD = () => {
    const studentName = window.prompt('¿Cómo se llama tu nuevo alumno?')

    if (!!studentName && studentName.length > 0) {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: studentName})
      }

      const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/student/`

      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then((data) => {
          const updatedStudents = this.state.students.slice()
          updatedStudents.push({_id: data._id, name: data.name})
          this.setState({
            students: updatedStudents,
          })
        })
    }
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
  
  // handleModifyDocument = () => {
  //   const documentObject = {
  //     parentId: this.state.dialogFolder._id,
  //   }

  //   const requestOptions = {
  //     method: 'PUT',
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify(documentObject)
  //   }

  //   let fetchUrl = `${REACT_APP_SERVER_BASE_URL}/documentmove/${this.state.selectedDocumentId}`

  //   fetch(fetchUrl, requestOptions)
  //     .then(response => response.json())
  //     .then(data => {
  //       this.getDocuments(this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id)
  //     })
  // }

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

    if (this.state.userDocuments.length < 1 && this.state.userFolders.length < 1) return <div>Aún no tienes ningún documento. Empieza haciendo un nuevo: <Link to='/documento' isNew={true}>Nuevo documento</Link></div>

    return (
      <div
        // style={{
        //   display: 'grid',
        //   gridTemplateColumns: '1fr 1fr 1fr 1fr',
        //   gridGap: '20px',
        // }}
      >
        {this.state.students.length > 0 &&
          <>
            <div style={{
              margin: '1rem 0 0 0',
              fontSize: '.8rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}>
              Alumnos
            </div>
            <ul
              className='documents__students'
              style={{
                margin: '.5rem 0 1.5rem 0',
                padding: '0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
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
                        padding: '16px',
                      }}
                      onClick={() => {
                        this.getDocuments(student._id)
                      }}
                      onMouseEnter={() => {
                        this.setState({
                          currentDocumentOverId: student._id,
                          currentDocumentOverName: student.name,
                        })
                      }}
                      onMouseLeave={() => {
                        this.setState({
                          currentDocumentOverId: null,
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
                      <h2 style={{
                        fontWeight: '400',
                        margin: '0',
                        pointerEvents: 'none'
                      }}>
                        {!!student.name.trim().length ? student.name : 'Documento sin nombre' }
                      </h2>
                    </Card>
                  </li>
                )
              })}
            </ul>
          </>
        }
        <div style={{
          margin: '1rem 0 0 0',
          fontSize: '.8rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}>
          Documentos
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
                    padding: '16px',
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
                  {/* <Button
                    type='button'
                    icon='delete'
                    intent={Intent.PRIMARY}
                    className={`button__delete-document ${Classes.MINIMAL}`}
                    text='Eliminar'
                    onClick={(e) => this.handleDeleteDocument(document._id)}
                  /> */}
                </Card>
              </li>
            )
          })}
        </ul>
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
          showPopoverMenu: true,
          menuTop: event.pageY,
          menuLeft: event.pageX,
        })
      }
    })

    document.addEventListener('click', (event) => {
      if (this.state.showPopoverMenu === true) {
        this.setState({showPopoverMenu: false})
      }
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
          onClick={(e) => this.handleDeleteDocument(this.state.selectedDocumentId)}
        />
        <MenuItem
          icon="share"
          text="Compartir"
          // intent={Intent.DANGER}
          labelElement={this.state.selectedDocumentShared ? <Icon icon="tick" /> : <Icon icon="cross" />} 
          onClick={(e) => this.handleShareDocument(this.state.selectedDocumentId)}
        />
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
        <MenuItem
          icon="duplicate"
          text="Duplicar"
          onClick={(e) => this.handleCloneDocument(this.state.selectedDocumentId)}
        />
        <MenuItem
          icon="add-to-folder"
          text="Mover a..."
          onClick={(e) => {
            this.getCurrentDialogContent(this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id)
            this.setState({isMoveDialogOpen: true})
          }}
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
          {/* <h3
            style={{
              marginTop: '0',
              marginLeft: '10px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon icon='folder-open' />
            <span
              style={{marginLeft: '8px'}}
            >
              {this.state.dialogFolder.name}
            </span>
          </h3> */}
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
            // className={Classes.ELEVATION_1}
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
              {/* {this.state.dialogFolder.name !== 'Selen' && this.state.dialogFolder.type !== 'student-folder' &&
                <tr
                  onClick={() => this.getCurrentDialogContent(this.state.dialogFolder.parent)}
                >
                  <td>
                    <Icon icon='arrow-left' />
                    <span style={{marginLeft: '8px'}}>Atrás</span>
                  </td>
                </tr>
              }
              {this.state.dialogFolder.type === 'student-folder' &&
                <tr
                  onClick={() => this.getCurrentDialogContent(this.state.user.userfolder)}
                >
                  <td>
                    <Icon icon='arrow-left' />
                    <span style={{marginLeft: '8px'}}>Atrás</span>
                  </td>
                </tr>
              } */}
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
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <AnchorButton
                    type='button'
                    icon='add'
                    intent={Intent.PRIMARY}
                    text='Nuevo documento'
                    href={`/documento?parent=${this.props.match.params.folder}`}
                    target='_blank'
                  />
                  <Button
                    type='button'
                    icon='new-person'
                    intent={Intent.PRIMARY}
                    text='Nuevo alumno'
                    onClick={this.handleAddStudent}
                  />
                  <Button
                    type='button'
                    icon='folder-new'
                    intent={Intent.PRIMARY}
                    text='Nueva carpeta'
                    onClick={this.handleAddFolder}
                  />
                </div>
                <div style={{
                  margin: '24px 0 32px',
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

// export default Documents
export default withRouter(Documents)
