import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { store } from '../../store/store'
import { cloneDeep } from 'lodash'

import {
  AnchorButton,
  Button,
  Classes,
  Card,
  Icon,
  Intent,
  Popover,
  Spinner,
} from "@blueprintjs/core"

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

    let fetchUrl = localStorage.getItem('seltoolsuserfolder') === folderId ?
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

        const folders = data.documents.filter(doc => doc.type === 'folder')
        const documents = data.documents.filter(doc => doc.type === 'document')

        this.setState({
          isLoadingDocuments: false,
          students: data.students,
          userFolders: folders,
          userDocuments: documents,
        })

        document.title = `${data.folder.name} - Seltools`;
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
      headers: {'Content-Type': 'application/json'},
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
        headers: {'Content-Type': 'application/json'},
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
          const folders = this.state.userFolders
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

  // handleAddStudent = () => {
  //   const studentName = window.prompt('¿Cómo se llama tu nuevo alumno?')

  //   if (!!studentName && studentName.length > 0) {
  //     const parent = this.props.breadcrumbs[this.props.breadcrumbs.length - 1]._id

  //     const requestOptions = {
  //       method: 'POST',
  //       headers: {'Content-Type': 'application/json'},
  //       body: JSON.stringify({
  //         name: studentName,
  //         teacherId: localStorage.getItem('seltoolsuserid'),
  //         teacherFolder: localStorage.getItem('seltoolsuserfolder'),
  //       }),
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
  //       },
  //     }

  //     const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/folder/`

  //     fetch(fetchUrl, requestOptions)
  //       .then(response => response.json())
  //       .then((data) => {

  //         this.setState({
  //           students: data,
  //         })
  //       })
  //   }
  // }

  handleRename = (documentId, documentName, documentType) => {
    const newName = window.prompt('Cambia el nombre:', documentName)

    if (!!newName) {
      const documentObject = {
        parentId: this.props.breadcrumbs[this.props.breadcrumbs.length - 1].id,
        name: newName,
      }
  
      const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
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
      headers: {'Content-Type': 'application/json'},
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
                  icon='more'
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
                icon='new-person'
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
                  icon='folder-new'
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
                  icon='add'
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
        {this.props.breadcrumbs.length === 1 && this.props.user.type == 'teacher' && students()}
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
      if (location.pathname.indexOf('documentos') < 0) return

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