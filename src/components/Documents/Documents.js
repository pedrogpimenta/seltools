import React from 'react'
import { withRouter } from 'react-router-dom'
import { store } from '../../store/store'
import { cloneDeep } from 'lodash'

import {
  Button,
  Classes,
  Card,
  Icon,
  Intent,
  Popover,
  Spinner,
} from "@blueprintjs/core"

import {
  RiFile3Line,
  RiFileAddFill,
  RiFileUserLine,
  RiFolderAddFill,
  RiFolderFill,
  RiFolderUserFill,
  RiMenuLine,
  RiUserAddFill,
  RiUserFill,
} from 'react-icons/ri'

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

import MoveDialog from '../MoveDialog/MoveDialog'
import AddStudentDialog from '../AddStudentDialog/AddStudentDialog'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import TopBar from '../TopBar/TopBar'

class Documents extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoadingDocuments: true,
      userFolders: [],
      userDocuments: [],
      students: [],
      selectedDocumentId: null,
      selectedDocumentName: null,
      isMoveDialogOpen: false,
    }
  }

  getDocuments = (folderId) => {
    this.setState({
      isLoadingDocuments: true,
    })

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
      },
    }



    let fetchUrl =
      this.props.user.type === 'student' ? // is user a student?
        `${REACT_APP_SERVER_BASE_URL}/user/${this.props.user._id}/documents/${folderId}?userIsStudent=true` :
        localStorage.getItem('seltoolsuserfolder') === folderId ? // is current folder the root teacher folder?
          `${REACT_APP_SERVER_BASE_URL}/user/${this.props.user._id}/documents/${folderId}?isTeacherFolder=true` :
          `${REACT_APP_SERVER_BASE_URL}/user/${this.props.user._id}/documents/${folderId}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        const newBreadcrumbs = data.breadcrumbs
        newBreadcrumbs.push({icon: 'folder-open', name: data.folder.name, _id: data.folder._id, type: data.folder.type, color: data.folder.color})
        if (this.props.user.type === 'student') {
          newBreadcrumbs.shift()
        }
        this.props.setLocation(newBreadcrumbs)

        const folders = data.documents.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name.toUpperCase() > b.name.toUpperCase() ? 1 : 0).filter(doc => doc.type === 'folder')
        const documents = data.documents.filter(doc => doc.type === 'document')

        this.setState({
          isLoadingDocuments: false,
          students: data.students,
          userFolders: folders,
          userDocuments: documents,
        })

        document.title = `${data.folder.name} - Seldocs`;
      })
  }

  handleDeleteDocument = (documentId, documentName, documentType) => {
    const confirmDelete = window.confirm(`¿Quieres eliminar "${documentName}"?`)

    if (confirmDelete) {
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
        },
      }

      const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${documentId}`

      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.ok !== 1) return false

          const updatedDocs = documentType === 'document' ?
            this.state.userDocuments.filter((doc) => doc._id !== documentId) :
            documentType === 'folder' ?
              this.state.userFolders.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name.toUpperCase() > b.name.toUpperCase() ? 1 : 0).filter((doc) => doc._id !== documentId) :
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
      body: JSON.stringify(documentObject),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
      },
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
      body: JSON.stringify(documentObject),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
      },
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
      const parent = this.props.breadcrumbs[this.props.breadcrumbs.length - 1]._id

      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          name: folderName,
          parent: parent,
          type: 'folder',
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
        },
      }

      const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/folder/`

      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then((data) => {
          const folders = this.state.userFolders.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name.toUpperCase() > b.name.toUpperCase() ? 1 : 0)
          folders.unshift({
            _id: data.insertedId,
            name: folderName,
            type: 'folder',
          })

          this.setState({
            userFolders: folders,
          })
        })
    }
  }

  handleRename = (documentId, documentName, documentType) => {
    const newName = window.prompt('Cambia el nombre:', documentName)

    if (!!newName) {
      const documentObject = {
        parentId: this.props.breadcrumbs[this.props.breadcrumbs.length - 1].id,
        name: newName,
      }
  
      const requestOptions = {
        method: 'PUT',
        body: JSON.stringify(documentObject),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
        },
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
      body: JSON.stringify(documentObject),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
      },
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
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
      },
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
        newDoc.name = newDoc.name + ' (COPIA)'
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
        initialFolder={this.props.user.userfolder}
        user={this.props.user}
        selectedDocumentId={this.state.selectedDocumentId}
        selectedDocumentName={this.state.selectedDocumentName}
        handleCloseButton={() => this.setState({isMoveDialogOpen: false})}
        handleMoveDocument={(folderId, documentId) => this.handleMoveDocument(folderId, documentId)}
        setLocation={this.props.setLocation}
      >
      </MoveDialog>
    )
  }

  renderAddStudentDialog = () => {
    if (!this.state.isAddStudentDialogOpen) return false

    return(
      <AddStudentDialog
        getDocuments={this.getDocuments}
        handleCloseButton={() => this.setState({isAddStudentDialogOpen: false})}
      >
      </AddStudentDialog>
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
            <div
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
              onClick={() => {
                this.props.history.push(`/${document.type === 'document' ? 'documento' : 'documentos'}/${document._id}`)
                if (document.type !== 'document') this.getDocuments(document._id)
              }}
              // to={`/${document.type === 'document' ? 'documento' : 'documentos'}/${document._id}`}
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
                    marginRight: '2px',
                    fontSize: '12px',
                    fontWeight: '700',
                    userSelect: 'none',
                  }}
                >
                  {document.name.substr(0, 1).toUpperCase()}
                </div>
              }
              {document.type !== 'student' &&
                <>
                  {this.props.user.type === 'student' && document.type === 'document' ? <RiFile3Line color={document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} /> : 
                  this.props.user.type === 'student' && document.type === 'folder' ? <RiFolderFill color={document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} /> : 
                  document.type === 'document' && document.shared === true ? <RiFileUserLine color={document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} /> :
                  document.type === 'document' ? <RiFile3Line color={document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} /> :
                  document.type === 'folder' && document.shared === true ? <RiFolderUserFill color={document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} /> :
                  document.type === 'folder' ? <RiFolderFill color={document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} /> :
                  <RiUserFill color={document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} />}
                </>
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
            </div>
          </Card>
          {this.props.user.type === 'teacher' &&
            <Popover
              autoFocus={false}
              content={<DropdownMenu
                documentId={document._id}
                documentName={document.name}
                documentType={document.type}
                documentShared={document.shared}
                breadcrumbs={this.props.breadcrumbs}
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
                  icon={<RiMenuLine size='1.2em' color='white' />}
                  color='white'
                />
              </div>
            </Popover>
          }
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
                icon={<RiUserAddFill />}
                className={Classes.MINIMAL}
                intent={Intent.PRIMARY}
                text='Nuevo alumno'
                onClick={() => this.setState({isAddStudentDialogOpen: true})}
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
            {this.props.user.type === 'teacher' &&
              <div>
                <Button
                  type='button'
                  icon={<RiFolderAddFill />}
                  className={Classes.MINIMAL}
                  intent={Intent.PRIMARY}
                  text='Nueva carpeta'
                  onClick={this.handleAddFolder}
                />
              </div>
            }
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
            {this.props.user.type === 'teacher' &&
              //TODO: Don't realod page, use onClick
              <div>
                <Button
                  type='button'
                  icon={<RiFileAddFill />}
                  className={Classes.MINIMAL}
                  intent={Intent.PRIMARY}
                  text='Nuevo documento'
                  // href={`/documento?parent=${this.props.match.params.folder}`}
                  style={{marginRight: '8px'}}
                  onClick={() => this.props.history.push(`/documento?parent=${this.props.match.params.folder}`)}
                />
              </div>
            }
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
        {this.props.breadcrumbs.length === 1 && this.props.user.type === 'teacher' && students()}
        {folders()}
        {documents()}
      </div>
    )
  }

  componentDidMount = () => {
    // TODO: needed?
    store.dispatch({
      type: 'RESET_FILES',
      files: [],
      filesOnLoad: [],
    })
    
    if (!this.props.match.params.folder) {
      this.getDocuments(this.props.user.userfolder)
    } else {
      this.getDocuments(this.props.match.params.folder)
    }

    this.props.history.listen((location, action) => {
      if (action !== 'POP') return

      const locationArray = location.pathname.split('/')
      const docId = locationArray[locationArray.length - 1]
      this.getDocuments(docId)
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
        }}
      >
        <TopBar
          isDocument={false}
          isLoading={this.state.isLoadingDocuments}
          user={this.props.user}
          breadcrumbs={this.props.breadcrumbs}
          connectedStudents={this.props.connectedStudents}
          getDocuments={this.getDocuments}
          isStudent={this.props.user.type === 'student'}
        />
        <div
          style={{
            width: '1100px',
            maxWidth: '100%',
            margin: '0 auto',
            paddingTop: '70px',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          <div style={{
            margin: '0 0 32px',
          }}>
            {!this.state.isLoadingDocuments ?
              this.renderDocuments() :
              <Spinner 
                style={{
                  background: 'red',
                }}
              />
            }
          </div>
        </div>
        {this.renderMoveDialog()}
        {this.renderAddStudentDialog()}
      </div>
    )
  }
}

export default withRouter(Documents)