import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Beforeunload } from 'react-beforeunload'
import axios from 'axios'

import io from 'socket.io-client'

import {
  Intent,
  Button,
  Classes,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'
import Canvas from '../Canvas/Canvas'
import Image from '../Image/Image'
import AudioFile from '../AudioFile/AudioFile'
import TextFile from '../TextFile/TextFile'
import VideoEmbed from '../VideoEmbed/VideoEmbed'
import FileWrapper from '../FileWrapper/FileWrapper'
import Header from '../Header/Header'
import Toolbar from '../Toolbar/Toolbar'

class Document extends React.Component {
  constructor() {
    super()

    this.documentNameInput = React.createRef()
    this.fileInput = React.createRef()
    this.fileNameInput = React.createRef()
    this.editNameDialogSaveButton = React.createRef()

    this.state = {
      id: '',
      name: '',
      user: {},
      files: [],
      filesOnLoad: [],
      students: [],
      showEditDialog: false,
      fileUrls: [],
      uploadingFiles: false,
    }
  }

  handleSaveAndLockDocument = () => {
    this.props.dispatch({
      type: 'DOCUMENT_IS_LOCKED',
      locked: true,
      isLocked: true,
      lockedBy: 'teacher',
    })

    this.props.dispatch({
      type: 'DOCUMENT_IS_SAVING',
    })
    
    const documentObject = {
      name: this.props.name,
      teacher: this.props.teacher,
      type: 'document',
      files: this.props.files,
    }

    for (let file in documentObject.files) {
      for (let marker in documentObject.files[file].markers) {
        delete documentObject.files[file].markers[marker].hasFocus
      }
    }

    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }
    
    fetch(`${REACT_APP_SERVER_BASE_URL}/document/${this.props.id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        this.props.dispatch({
          type: 'DOCUMENT_SAVED',
        })

        this.socket.emit('document saved after unlock', this.state.user._id, this.props.id)
      })
    
  }

  handleSaveDocument = (shouldUpdateDate) => {
    if (this.props.isLocked) return false

    this.props.dispatch({
      type: 'DOCUMENT_IS_SAVING',
    })

    const documentObject = {
      name: this.props.name,
      teacher: this.props.teacher,
      type: 'document',
      files: this.props.files,
    }

    if (this.props.location.search.length > 0) {
      documentObject.parent = new URLSearchParams(this.props.location.search).get('parent')
    }

    for (let file in documentObject.files) {
      for (let marker in documentObject.files[file].markers) {
        delete documentObject.files[file].markers[marker].hasFocus
      }
    }

    const requestOptions = {
      method: !this.props.id ? 'POST' : 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    let fetchUrl = !this.props.id
      ? `${REACT_APP_SERVER_BASE_URL}/document/`
      : `${REACT_APP_SERVER_BASE_URL}/document/${this.props.id}?shouldUpdateDate=${shouldUpdateDate}`

    if (this.props.location.search.length > 0) {
      const parent = new URLSearchParams(this.props.location.search).get('parent')
      fetchUrl = fetchUrl + `?parent=${parent}`
    }

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (!this.props.id) {
          this.props.history.push(this.props.isStudent? `/alumno/documento/${data.id}` : `/documento/${data.id}`)

          this.props.dispatch({
            type: 'CHANGE_DOCUMENT_ID',
            id: data.id,
          })
        }

        this.props.dispatch({
          type: 'DOCUMENT_SAVED',
        })

        console.log('saving...')
        this.socket.emit('document saved', this.state.user._id, this.props.id)
      })

  }

  handleUnlock = () => {
    console.log('unlocking document')
    this.socket.emit('unlock document', this.state.user._id, this.props.id)
  }

  socket = ''
  
  componentWillUnmount() {
    this.socket.disconnect()
  }

  componentDidMount() {
    const userName = this.props.isStudent ? localStorage.getItem('studentName') : 'Selen'

    fetch(`${REACT_APP_SERVER_BASE_URL}/user/${userName}`)
    .then(response => response.json())
    .then(data => {
      console.log('data:', data)
      this.setState({
        user: data.user,
      })

      if (!this.props.match.params.id) {
        const parent = new URLSearchParams(this.props.location.search).get('parent')

        if (!!parent) {
          fetch(`${REACT_APP_SERVER_BASE_URL}/document/${parent}`)
            .then(response => response.json())
            .then(data => {
              let newBreadcrumbs = []

              if (data.breadcrumbs) {
                newBreadcrumbs = data.breadcrumbs.map((crumb, i) => {
                  return({
                    icon: 'folder-open',
                    id: crumb._id,
                    text: crumb.name,
                    type: crumb.type,
                    color: crumb.color
                  })
                })
              }
      
              newBreadcrumbs.push({
                icon: data.document.type === 'folder' ? 'folder-open' : 'user',
                text: data.document.name,
                id: data.document._id,
                type: data.document.type,
                color: data.document.color,
              })

              newBreadcrumbs.push({icon: 'document', text: '', id: '', type: 'document'})
            
              if (this.props.isStudent) {
                newBreadcrumbs.shift()
              }
      
              this.props.dispatch({
                type: 'CHANGE_DOCUMENT_BREADCRUMBS',
                breadcrumbs: newBreadcrumbs,
              })

              this.props.dispatch({
                type: 'DOCUMENT_IS_LOADED',
              })

              this.props.dispatch({
                type: 'LOAD_FILES',
                files: [],
              })

              this.props.dispatch({
                type: 'CHANGE_DOCUMENT_ID',
                id: '',
              })

              this.props.dispatch({
                type: 'CHANGE_DOCUMENT_NAME',
                name: '',
              })

              this.props.dispatch({
                type: 'DOCUMENT_IS_LOCKED',
                locked: false,
                isLocked: false,
                lockedBy: '',
              })

            })
        } 
      } else {
        fetch(`${REACT_APP_SERVER_BASE_URL}/document/${this.props.match.params.id}`)
          .then(response => response.json())
          .then(data => {
            const LSfiles = data.document.files || []

            document.title = `${data.document.name} -- Seltools`;

            if (LSfiles.length > 0) {
              this.props.dispatch({
                type: 'LOAD_FILES',
                files: LSfiles,
              })
            }

            // TODO: Improve so much dispatches

            if (!this.props.isStudent) {
              this.props.dispatch({
                type: 'CHANGE_DOCUMENT_SHAREDWITH',
                sharedWith: data.document.sharedWith,
              })
            }

            this.props.dispatch({
              type: 'CHANGE_DOCUMENT_ID',
              id: this.props.match.params.id,
            })

            this.props.dispatch({
              type: 'CHANGE_DOCUMENT_NAME',
              name: data.document.name,
            })
            
            let newBreadcrumbs = [{icon: 'folder-open', text: this.props.isStudent ? localStorage.getItem('studentName') : 'Selen', id: '0', type: 'folder'}]

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
            
            newBreadcrumbs.push({icon: 'document', text: data.document.name, id: data.document._id, type: data.document.type})
          
            if (this.props.isStudent) {
              newBreadcrumbs.shift()
            }

            this.props.dispatch({
              type: 'CHANGE_DOCUMENT_BREADCRUMBS',
              breadcrumbs: newBreadcrumbs,
            })

            this.props.dispatch({
              type: 'CHANGE_DOCUMENT_SHARED',
              shared: data.document.shared,
            })
            
            this.props.dispatch({
              type: 'CHANGE_DOCUMENT_MODIFIED_DATE',
              modifiedDate: data.document.modifiedDate,
            })

            this.props.dispatch({
              type: "DOCUMENT_IS_LOADED",
            })

            this.props.dispatch({
              type: 'DOCUMENT_IS_LOCKED',
              locked: data.document.locked,
              isLocked: data.document.locked && data.document.lockedBy !== this.state.user._id,
              lockedBy: data.document.lockedBy,
            })

            // WebSockets
            this.socket = io('ws://localhost:3000/')

            this.socket.on('connect', () => {
              console.log('1')

              this.socket.emit('document open', this.state.user._id, data.document._id)
            })

            this.socket.on('document reload', (documentId) => {
              console.log( 'reloooooad')
              if (documentId === this.props.id) {
                // TODO: make this a function
                fetch(`${REACT_APP_SERVER_BASE_URL}/document/${documentId}`)
                  .then(response => response.json())
                  .then(data => {
                    const LSfiles = data.document.files || []
                    console.log('here!')

                    document.title = `${data.document.name} -- Seltools`;

                    if (LSfiles.length > 0) {
                      this.props.dispatch({
                        type: 'LOAD_FILES',
                        files: LSfiles,
                        noReset: true,
                      })
                    }

                    this.props.dispatch({
                      type: 'CHANGE_DOCUMENT_NAME',
                      name: data.document.name,
                    })

                    this.props.dispatch({
                      type: 'CHANGE_DOCUMENT_MODIFIED_DATE',
                      modifiedDate: data.document.modifiedDate,
                    })
        

                    if (data.document.locked) {
                      this.props.dispatch({
                        type: 'DOCUMENT_IS_LOCKED',
                        locked: data.document.locked,
                        isLocked: data.document.locked && data.document.lockedBy !== this.state.user._id,
                        lockedBy: data.document.lockedBy,
                      })

                      this.props.dispatch({
                        type: "DOCUMENT_IS_LOADED",
                      })
                    } else {
                      this.props.dispatch({
                        type: 'DOCUMENT_IS_LOCKED',
                        locked: data.document.locked,
                        isLocked: data.document.locked && data.document.lockedBy !== this.state.user._id,
                        lockedBy: data.document.lockedBy,
                      })

                      this.props.dispatch({
                        type: "DOCUMENT_IS_LOADED",
                      })

                      this.handleSaveDocument()
                    }
                  })
              // } else {
                
              //   this.props.dispatch({
              //     type: 'DOCUMENT_IS_LOCKED',
              //     locked: true,
              //     isLocked: true,
              //     lockedBy: this.state.user._id,
              //   })

              //   this.props.dispatch({
              //     type: "DOCUMENT_IS_LOADED",
              //   })

              //   this.handleSaveDocument()
              }
            })

            this.socket.on('save and lock document', (userId, documentId) => {
                console.log('1saving and locking document')
              if (documentId === this.props.id && userId !== this.state.user._id) {
                console.log('2saving and locking document')
                this.handleSaveAndLockDocument()
              }
            })
          })
      }
    })

  }

 
  handleFileInputChange = (e) => {
    this.setState({uploadingFiles: true})

    const files = e.target.files
    const filesForState = []

    for (let i = 0; i < files.length; i++) {
      let fileParts = files[i].name.split('.')
      let fileName = files[i].name.replace(/\s+/gi, '-').replace(/[^a-zA-Z0-9-]/gi, '_')
      fileName = `${fileName}-${Math.floor((Math.random() * 100000) + 1)}`
      let fileType = fileParts[fileParts.length - 1]

      axios.post(`${REACT_APP_SERVER_BASE_URL}/sign_s3`, {
        fileName: fileName,
        fileType: fileType,
      })
        .then(response => {
          const returnData = response.data.data.returnData
          const signedRequest = returnData.signedRequest
          const url = returnData.url

          filesForState.push({
            id: fileName,
            name: fileName,
            type: fileType,
            url: url,
            markers: [],
            highlights: [],
            stamps: [],
            creator: this.props.isStudent ? localStorage.getItem('studentName') : 'Selen',
          })

          const options = {
            headers: {
              'Content-Type': fileType,
              'Expires': 500,
            }
          }

          axios.put(signedRequest,files[i],options)
            .then(result => {
              this.setState({uploadingFiles: false})
              if (i === files.length - 1) {
                this.props.dispatch({
                  type: "ADD_FILES",
                  files: filesForState,
                  position: this.state.addFileIndex,
                }) 
            
                this.props.dispatch({
                  type: "DOCUMENT_UNSAVED",
                }) 
              }
            })
            .catch(error => {
              alert("ERROR " + JSON.stringify(error))
            })
        })
        .catch(error => {
          alert(JSON.stringify(error));
        })
    }
  }

  handleNameInputClose = () => {
    this.setState({
      showEditDialog: false,
    })
  }

  handleBreadcrumbInputChange = (e) => {
    this.props.dispatch({
      type: 'CHANGE_DOCUMENT_NAME',
      name: e,
    })
  }

  getUser = () => {
  }

  handleMoveOneUp = (fileIndex) => {
    this.props.dispatch({
      type: "MOVE_FILE_UP",
      position: fileIndex,
    })

    this.props.dispatch({
      type: "DOCUMENT_UNSAVED",
    })  
  }

  handleMoveOneDown = (fileIndex) => {
    this.props.dispatch({
      type: "MOVE_FILE_DOWN",
      position: fileIndex,
    })

    this.props.dispatch({
      type: "DOCUMENT_UNSAVED",
    })  
  }

  handleAddTextFile = (fileIndex, creator) => {
    this.props.dispatch({
      type: "ADD_TEXT_FILE",
      position: fileIndex,
      creator: creator,
    })

    this.props.dispatch({
      type: "DOCUMENT_UNSAVED",
    })  
  }

  handleAddFile = (e, fileIndex, creator) => {
    this.setState({
      addFileIndex: fileIndex,
    })
    this.fileInput.current.click(e)
  }

  handleAddVideoEmbed = (fileIndex, creator) => {
    const url = window.prompt('¿Cuál es la URL del vídeo? Ej: "https://www.youtube.com/watch?v=yfTCbVMmGa0"')

    if (!(!!url && url.length > 0)) return false

    console.log('url:', url)
    this.props.dispatch({
      type: "ADD_VIDEO_EMBED",
      position: fileIndex,
      creator: creator,
      url: url,
    })

    this.props.dispatch({
      type: "DOCUMENT_UNSAVED",
    })
  }

  handleDeleteFile = (fileId) => {
    const confirmDelete = window.confirm('¿Quieres eliminar el archivo?')

    if (confirmDelete) {
      this.props.dispatch({
        type: "DELETE_FILE",
        fileId: fileId,
      }) 
  
      this.props.dispatch({
        type: "DOCUMENT_UNSAVED",
      }) 
    }
  }

  openEditNameDialog = () => {
    this.setState({showEditDialog: true})
  }

  fileHasRendered = (fileId) => {
    this.props.dispatch({
      type: "FILE_HAS_RENDERED",
      fileId: fileId,
    }) 
  }

  renderFileButtons = (i, fileIndex) => {
    return (
      <div
        className={`fileButtons ${this.props.isLocked ? 'locked' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          margin: '0 auto 4px',
          transition: 'all 100ms ease-out',
          opacity: '0',
          pointerEvents: this.props.isLocked ? 'none' : 'all',
        }}
      >
        {this.props.isLocked &&
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: '100',
              // background: 'red',
            }}
            onClick={this.handleClickWhenLocked}
          >
          </div>
        }
        {!this.props.isStudent && i !== 0 &&
          <Button
            style={{margin: '0 4px'}}
            intent={Intent.DEFAULT}
            className={Classes.MINIMAL}
            icon='chevron-up'
            onClick={() => this.handleMoveOneUp(i)}
          />
        }
        {!this.props.isStudent && i !== (this.props.files.length - 1) &&
          <Button
            style={{margin: '0 4px'}}
            intent={Intent.DEFAULT}
            className={Classes.MINIMAL}
            icon='chevron-down'
            onClick={() => this.handleMoveOneDown(i)}
          />
        }
        <Button
          style={{margin: '0 4px'}}
          intent={Intent.DEFAULT}
          className={Classes.MINIMAL}
          icon='new-text-box'
          onClick={() => this.handleAddTextFile(i - 1, this.props.isStudent ? localStorage.getItem('studentName') : 'Selen')}
        />
        <Button
          style={{margin: '0 4px'}}
          intent={Intent.DEFAULT}
          className={Classes.MINIMAL}
          loading={this.state.uploadingFiles}
          icon='media'
          onClick={(e) => this.handleAddFile(e, i - 1, this.props.isStudent ? localStorage.getItem('studentName') : 'Selen')}
        />
        <Button
          style={{margin: '0 4px'}}
          intent={Intent.DEFAULT}
          className={Classes.MINIMAL}
          loading={this.state.uploadingFiles}
          icon='music'
          onClick={(e) => this.handleAddFile(e, i - 1, this.props.isStudent ? localStorage.getItem('studentName') : 'Selen')}
        />
        <Button
          style={{margin: '0 4px'}}
          intent={Intent.DEFAULT}
          className={Classes.MINIMAL}
          loading={this.state.uploadingFiles}
          icon='video'
          onClick={(e) => this.handleAddVideoEmbed(i - 1, this.props.isStudent ? localStorage.getItem('studentName') : 'Selen')}
        />
        {(!this.props.isStudent ? true : this.props.files[i].creator === localStorage.getItem('studentName')) &&
          <Button
            style={{margin: '0 4px'}}
            intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
            className={this.props.files.length > 0 ? Classes.MINIMAL : null}
            icon='delete'
            onClick={() => this.handleDeleteFile(fileIndex)}
          />
        }
      </div>
    )
  }

  renderAddButtons = (fileIndex) => {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '18px auto',
        opacity: '.6',
      }}>
        <Button
          style={{margin: '0 8px'}}
          intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
          className={this.props.files.length > 0 ? Classes.MINIMAL : null}
          icon='new-text-box'
          large={true}
          onClick={() => this.handleAddTextFile(this.props.files.length, this.props.isStudent ? localStorage.getItem('studentName') : 'Selen')}
        />
        <Button
          style={{margin: '0 8px'}}
          intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
          className={this.props.files.length > 0 ? Classes.MINIMAL : null}
          loading={this.state.uploadingFiles}
          icon='media'
          large={true}
          onClick={(e) => this.handleAddFile(e, this.props.files.length, this.props.isStudent ? localStorage.getItem('studentName') : 'Selen')}
        />
        <Button
          style={{margin: '0 8px'}}
          intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
          className={this.props.files.length > 0 ? Classes.MINIMAL : null}
          loading={this.state.uploadingFiles}
          icon='music'
          large={true}
          onClick={(e) => this.handleAddFile(e, this.props.files.length, this.props.isStudent ? localStorage.getItem('studentName') : 'Selen')}
        />
        <Button
          style={{margin: '0 8px'}}
          intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
          className={this.props.files.length > 0 ? Classes.MINIMAL : null}
          icon='video'
          large={true}
          onClick={(e) => this.handleAddVideoEmbed(this.props.files.length, this.props.isStudent ? localStorage.getItem('studentName') : 'Selen')}
        />
      </div>
    )
  }

  handleClickWhenLocked = () => {
    alert('No!')
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
        {!this.props.isSaved &&
          <Beforeunload onBeforeunload={() => "No has guardado tus cambios!"} />
        }
        <div
          className='main'
          style={{
            width: '100%',
            cursor: this.props.dragging ? 'grabbing' : 'default',
          }}
        >
          <Header
            handleSaveDocument={this.handleSaveDocument}
            handleUnlock={this.handleUnlock}
            socket={this.socket}
            user={this.state.user}
            isStudent={this.props.isStudent}
          />
          <div
            className='document'
            style={{
              position: 'relative',
              marginTop: '50px',
              padding: '20px',
            }}
          >
            <Toolbar
              isLocked={this.props.isLocked}
              handleClickWhenLocked={this.handleClickWhenLocked}
            />
            <div
              style={{
                maxWidth: 'var(--doc-width)',
                margin: '0 auto',
                // paddingTop: '70px',
                // paddingRight: '10px',
                // paddingLeft: '43px',
              }}
            >
              {this.props.files.map((file, i) => {
                return(
                  <div
                    key={file.id}
                    className='file'
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <FileWrapper
                      id={file.id}
                      fileType={file.type}
                      markers={file.markers}
                      highlights={file.highlights}
                      hasRendered={file.hasRendered}
                      isStudent={this.props.isStudent}
                      mode={this.props.editMode}
                      fileButtons={this.renderFileButtons(i, file.id)}
                      isLocked={this.props.isLocked}
                      handleClickWhenLocked={this.handleClickWhenLocked}
                    >
                      {(file.type && file.type.toLowerCase() === 'pdf') &&
                        <Canvas file={file} fileHasRendered={this.fileHasRendered} />
                      }
                      {(file.type && file.type.toLowerCase() === 'txt') &&
                        <TextFile
                          file={file}
                          isLocked={this.props.isLocked}
                          handleClickWhenLocked={this.handleClickWhenLocked}
                        />
                      }
                      {((file.type && file.type.toLowerCase() === 'm4a') ||
                        (file.type && file.type.toLowerCase() === 'aac') ||
                        (file.type && file.type.toLowerCase() === 'mp3') ||
                        (file.type && file.type.toLowerCase() === 'ogg') ||
                        (file.type && file.type.toLowerCase() === 'opus') ||
                        (file.type && file.type.toLowerCase() === 'wav') ||
                        (file.type && file.type.toLowerCase() === 'webm')) &&
                        <AudioFile file={file} />
                      }
                      {((file.type && file.type.toLowerCase() === 'jpg') ||
                        (file.type && file.type.toLowerCase() === 'jpeg') ||
                        (file.type && file.type.toLowerCase() === 'jfif') ||
                        (file.type && file.type.toLowerCase() === 'png')) &&
                        <Image file={file} />
                      }
                      {((file.type && file.type.toLowerCase() === 'videoembed')) &&
                        <VideoEmbed file={file} />
                      }
                    </FileWrapper>
                  </div>
                )
              })}
              {!this.props.isLocked && this.renderAddButtons()}
              {!this.props.isLocked && 
                <input
                  ref={this.fileInput}
                  multiple
                  // accept='image/png, image/jpeg, image/webp, image/svg+xml, image/bmp, image/gif, application/pdf'
                  accept='image/png, image/jpeg, image/webp, image/svg+xml, image/bmp, image/gif, audio/aac, audio/mpeg, audio/ogg, audio/opus, audio/wav, audio/webm'
                  type='file'
                  onChange={(e) => this.handleFileInputChange(e)}
                  style={{display: 'none'}}
                />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
    name: state.name,
    students: state.students,
    shared: state.shared || false,
    files: state.files,
    filesOnLoad: state.filesOnLoad,
    isSaved: state.isSaved,
    isSaving: state.isSaving,
    dragging: state.dragging,
    documentIsLoading: state.documentIsLoading,
    locked: state.locked,
    isLocked: state.isLocked,
    lockedBy: state.lockedBy,
    editMode: state.editMode,
  }
}

export default connect(mapStateToProps)(withRouter(Document))
