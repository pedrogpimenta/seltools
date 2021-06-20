import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Beforeunload } from 'react-beforeunload'
import axios from 'axios'

import './Document.css'

import {
  Intent,
  Button,
  Classes,
  Spinner,
} from "@blueprintjs/core"

import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiBrushFill,
  RiDeleteBinLine,
  RiEyeFill,
  RiEyeOffLine,
  RiFileTextLine,
  RiImage2Fill,
  RiMusic2Fill,
  RiYoutubeLine,
  RiRefreshLine,
} from 'react-icons/ri'

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'
import Canvas from '../Canvas/Canvas'
import Image from '../Image/Image'
import AudioFile from '../AudioFile/AudioFile'
import TextFile from '../TextFile/TextFile'
import DrawFile from '../DrawFile/DrawFile'
import VideoEmbed from '../VideoEmbed/VideoEmbed'
import FileWrapper from '../FileWrapper/FileWrapper'
import TopBar from '../TopBar/TopBar'
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
      isLoadingDocument: true,
      dateInterval: '',
      hasUpdatedSinceOffline: true,
      filesToDelete: [],
    }
  }

  handleLockDocument = (options) => {
    this.props.dispatch({
      type: 'DOCUMENT_IS_LOCKED',
      locked: true,
      isLocked: true,
      lockedBy: options.lockedByUserId,
    })

    this.props.socket.emit('document unlock', this.props.user._id, this.props.id)
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
      filesToDelete: this.state.filesToDelete,
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
      body: JSON.stringify(documentObject),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
      },
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
          this.props.history.push(this.props.user.type === 'student' ? `/alumno/documento/${data.id}` : `/documento/${data.id}`)

          this.props.dispatch({
            type: 'CHANGE_DOCUMENT_ID',
            id: data.id,
          })
        }

        this.props.dispatch({
          type: 'DOCUMENT_SAVED',
        })

        this.props.dispatch({
          type: 'CHANGE_DOCUMENT_MODIFIED_DATE',
          modifiedDate: new Date(),
        })

        this.handleInactivityLock()

        this.props.socket.emit('document saved', this.props.user._id, this.props.id || data.id)
      })

  }

  handleUnlock = () => {
    this.props.socket.emit('unlock document', this.props.user._id, this.props.id)

    // TODO: make this a function
    fetch(`${REACT_APP_SERVER_BASE_URL}/document/${this.props.id}`)
      .then(response => response.json())
      .then(data => {
        const LSfiles = data.document.files || []

        document.title = `${data.document.name} -- Seldocs`;

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
            isLocked: data.document.locked && data.document.lockedBy !== this.props.user._id,
            lockedBy: data.document.lockedBy,
          })

          this.props.dispatch({
            type: "DOCUMENT_IS_LOADED",
          })
        } else {
          this.props.dispatch({
            type: 'DOCUMENT_IS_LOCKED',
            locked: data.document.locked,
            isLocked: data.document.locked && data.document.lockedBy !== this.props.user._id,
            lockedBy: data.document.lockedBy,
          })

          this.props.dispatch({
            type: "DOCUMENT_IS_LOADED",
          })

          // this.handleSaveDocument()
        }

        this.handleInactivityLock()
      })
  }

  componentWillUnmount() {
    clearInterval(this.saveInterval)
    clearTimeout(this.saveDateInterval)
    if (this.props.socket) this.props.socket.removeAllListeners('document reload')
    if (this.props.socket) this.props.socket.removeAllListeners('lock document')

    if (!this.props.id) return

    if (this.props.socket) this.props.socket.emit('document unlock', this.props.user._id, this.props.id)
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'LOAD_FILES',
      files: [],
    })

    if (!this.props.match.params.id) {
      const parent = new URLSearchParams(this.props.location.search).get('parent')

      if (!!parent) {
        fetch(`${REACT_APP_SERVER_BASE_URL}/document/${parent}`)
          .then(response => response.json())
          .then(data => {
            const newBreadcrumbs = data.breadcrumbs
            newBreadcrumbs.push({
              icon: data.document.type === 'folder' ? 'folder-open' : 'document',
              name: data.document.name,
              _id: data.document._id,
              type: data.document.type,
              color: data.document.color,
            })
            newBreadcrumbs.push({
              icon: 'document',
              name: '',
              _id: '',
              type: 'document',
            })
            if (this.props.user.type === 'student') {
              newBreadcrumbs.shift()
            }
            this.props.setLocation(newBreadcrumbs)

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
    
            this.props.dispatch({
              type: 'CHANGE_DOCUMENT_BREADCRUMBS',
              breadcrumbs: newBreadcrumbs,
            })

            this.props.dispatch({
              type: 'DOCUMENT_IS_LOADED',
            })
            
            this.setState({
              isLoadingDocument: false,
            })
          })
      } 
    } else {
      fetch(`${REACT_APP_SERVER_BASE_URL}/document/${this.props.match.params.id}/0`)
        .then(response => response.json())
        .then(data => {
          const LSfiles = data.document.files || []

          document.title = `${data.document.name} -- Seldocs`

          const newBreadcrumbs = data.breadcrumbs
          newBreadcrumbs.push({
            icon: data.document.type === 'folder' ? 'folder-open' : 'document',
            name: data.document.name,
            _id: data.document._id,
            type: data.document.type,
            color: data.document.color,
          })
          if (this.props.user.type === 'student') {
            newBreadcrumbs.shift()
          }
          this.props.setLocation(newBreadcrumbs)

          if (LSfiles.length > 0) {
            this.props.dispatch({
              type: 'LOAD_FILES',
              files: LSfiles,
            })
          }

          if (this.props.user.type !== 'student') {
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
            type: 'CHANGE_DOCUMENT_FILES_LENGTH',
            filesLength: data.documentFilesLength,
          })

          this.props.dispatch({
            type: "DOCUMENT_IS_LOADED",
          })

          this.props.dispatch({
            type: 'DOCUMENT_IS_LOCKED',
            locked: data.document.locked,
            isLocked: data.document.locked && data.document.lockedBy !== this.props.user._id,
            lockedBy: data.document.lockedBy,
          })

          this.setState({
            isLoadingDocument: false,
          })

          // WebSockets

          if (this.props.socket) this.props.socket.emit('document open', this.props.user._id, data.document._id)

          if (this.props.socket) this.props.socket.on('document reload', (documentId) => {
            if (documentId === this.props.id && this.props.isSaved) {
              
              // TODO: make this a function
              fetch(`${REACT_APP_SERVER_BASE_URL}/document/${documentId}`)
                .then(response => response.json())
                .then(data => {
                  const LSfiles = data.document.files || []

                  document.title = `${data.document.name} -- Seldocs`;

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
                      isLocked: data.document.locked && data.document.lockedBy !== this.props.user._id,
                      lockedBy: data.document.lockedBy,
                    })

                    this.props.dispatch({
                      type: "DOCUMENT_IS_LOADED",
                    })
                  } else {
                    this.props.dispatch({
                      type: 'DOCUMENT_IS_LOCKED',
                      locked: data.document.locked,
                      isLocked: data.document.locked && data.document.lockedBy !== this.props.user._id,
                      lockedBy: data.document.lockedBy,
                    })

                    this.props.dispatch({
                      type: "DOCUMENT_IS_LOADED",
                    })

                    this.handleSaveDocument()
                  }
                })
            }
          })

          if (this.props.socket) this.props.socket.on('lock document', (userId, documentId) => {
            if (documentId === this.props.id && userId !== this.props.user._id) {
              this.handleLockDocument({lockedByUserId: userId, shouldUnlock: false})
            }
          })
        })
    }

    this.handleUnsaveDocument()
    this.handleOfflineState()
  }

  getMoreFiles = (filesLength) => {
    console.log(' filesLength:', filesLength)
    fetch(`${REACT_APP_SERVER_BASE_URL}/document/${this.props.match.params.id}/${this.props.files.length}`)
    .then(response => response.json())
    .then(data => {
      console.log('---------- DATA START')
      console.log(data)
      console.log('---------- DATA END')

      const newFiles = data.document.files

      if (newFiles.length > 0) {
        const loadFiles = this.props.files.concat(newFiles)

        this.props.dispatch({
          type: 'LOAD_FILES',
          files: loadFiles,
          noReset: true,
        })
      }

    })
  }

  handleOfflineState = () => {
    if (this.props.socket) this.props.socket.on('connect', () => {
      if (!this.state.hasUpdatedSinceOffline) {
        fetch(`${REACT_APP_SERVER_BASE_URL}/document/${this.props.id}`)
          .then(response => response.json())
          .then(data => {
            const LSfiles = data.document.files || []

            document.title = `${data.document.name} -- Seldocs`;

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
                isLocked: data.document.locked && data.document.lockedBy !== this.props.user._id,
                lockedBy: data.document.lockedBy,
              })

              this.props.dispatch({
                type: "DOCUMENT_IS_LOADED",
              })
            } else {
              this.props.dispatch({
                type: 'DOCUMENT_IS_LOCKED',
                locked: data.document.locked,
                isLocked: data.document.locked && data.document.lockedBy !== this.props.user._id,
                lockedBy: data.document.lockedBy,
              })

              this.props.dispatch({
                type: "DOCUMENT_IS_LOADED",
              })

              this.setState({
                hasUpdatedSinceOffline: true,
              })

              // this.handleSaveDocument()
            }
          })
      }
    })
    
    window.addEventListener('offline', () => {
      this.setState({
        hasUpdatedSinceOffline: false,
      })
    })
  }

  handleUnsaveDocument = () => {
    this.saveInterval = setInterval(() => {
      if (!this.props.isSaved) {
        this.handleSaveDocument(true)
      }
    }, 5000)
  }

  handleInactivityLock = () => {
    if (this.props.user.type !== 'teacher') return false
    if (this.props.shared !== true) return false

    clearTimeout(this.saveDateInterval)

    this.saveDateInterval = setTimeout(() => {
      const modifiedDate = new Date(this.props.modifiedDate).getTime()
      const currentDate = new Date().getTime()

      if (modifiedDate < currentDate) {
        this.handleLockDocument({lockedByUserId: '', shouldUnlock: true})
      }

    }, 3600000)
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
            textInputs: [],
            lines: [],
            stamps: [],
            creator: this.props.user.type === 'student' ? localStorage.getItem('studentName') : 'Sel',
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

  handleAddDrawFile = (fileIndex, creator) => {
    this.props.dispatch({
      type: "ADD_DRAW_FILE",
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
      const filesToDelete = this.state.filesToDelete
      filesToDelete.push(fileId)

      this.setState({
        filesToDelete,
      })

      this.props.dispatch({
        type: "DELETE_FILE",
        fileId: fileId,
      }) 
  
      this.props.dispatch({
        type: "DOCUMENT_UNSAVED",
      }) 
    }
  }
  
  handleHideFile = (fileId) => {
    this.props.dispatch({
      type: "HIDE_FILE",
      fileId: fileId,
    }) 

    this.props.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
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
        {this.props.user.type !== 'student' &&
          <Button
            style={{margin: '0 4px'}}
            intent={Intent.DEFAULT}
            className={Classes.MINIMAL}
            icon={this.props.files[i].hidden ? <RiEyeFill /> : <RiEyeOffLine />}
            onClick={() => this.handleHideFile(fileIndex)}
          />
        }
        {this.props.user.type !== 'student' && i !== 0 &&
          <Button
            style={{margin: '0 4px'}}
            intent={Intent.DEFAULT}
            className={Classes.MINIMAL}
            icon={<RiArrowUpSLine />}
            onClick={() => this.handleMoveOneUp(i)}
          />
        }
        {this.props.user.type !== 'student' && i !== (this.props.files.length - 1) &&
          <Button
            style={{margin: '0 4px'}}
            intent={Intent.DEFAULT}
            className={Classes.MINIMAL}
            icon={<RiArrowDownSLine />}
            onClick={() => this.handleMoveOneDown(i)}
          />
        }
        <Button
          style={{margin: '0 4px'}}
          intent={Intent.DEFAULT}
          className={Classes.MINIMAL}
          icon={<RiBrushFill />}
          onClick={() => this.handleAddDrawFile(i - 1, this.props.user.type === 'student' ? localStorage.getItem('studentName') : 'Sel')}
        />
        <Button
          style={{margin: '0 4px'}}
          intent={Intent.DEFAULT}
          className={Classes.MINIMAL}
          icon={<RiFileTextLine />}
          onClick={() => this.handleAddTextFile(i - 1, this.props.user.type === 'student' ? localStorage.getItem('studentName') : 'Sel')}
        />
        <Button
          style={{margin: '0 4px'}}
          intent={Intent.DEFAULT}
          className={Classes.MINIMAL}
          loading={this.state.uploadingFiles}
          icon={<RiImage2Fill />}
          onClick={(e) => this.handleAddFile(e, i - 1, this.props.user.type === 'student' ? localStorage.getItem('studentName') : 'Sel')}
        />
        <Button
          style={{margin: '0 4px'}}
          intent={Intent.DEFAULT}
          className={Classes.MINIMAL}
          loading={this.state.uploadingFiles}
          icon={<RiMusic2Fill />}
          onClick={(e) => this.handleAddFile(e, i - 1, this.props.user.type === 'student' ? localStorage.getItem('studentName') : 'Sel')}
        />
        <Button
          style={{margin: '0 4px'}}
          intent={Intent.DEFAULT}
          className={Classes.MINIMAL}
          loading={this.state.uploadingFiles}
          icon={<RiYoutubeLine />}
          onClick={(e) => this.handleAddVideoEmbed(i - 1, this.props.user.type === 'student' ? localStorage.getItem('studentName') : 'Sel')}
        />
        {(this.props.user.type !== 'student' ? true : this.props.files[i].creator === localStorage.getItem('studentName')) &&
          <Button
            style={{margin: '0 4px'}}
            intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
            className={this.props.files.length > 0 ? Classes.MINIMAL : null}
            icon={<RiDeleteBinLine />}
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
          icon={<RiBrushFill size='1.2em' />}
          large={true}
          onClick={() => this.handleAddDrawFile(this.props.files.length, this.props.user.type === 'student' ? localStorage.getItem('studentName') : 'Sel')}
        />
        <Button
          style={{margin: '0 8px'}}
          intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
          className={this.props.files.length > 0 ? Classes.MINIMAL : null}
          icon={<RiFileTextLine size='1.2em' />}
          large={true}
          onClick={() => this.handleAddTextFile(this.props.files.length, this.props.user.type === 'student' ? localStorage.getItem('studentName') : 'Sel')}
        />
        <Button
          style={{margin: '0 8px'}}
          intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
          className={this.props.files.length > 0 ? Classes.MINIMAL : null}
          loading={this.state.uploadingFiles}
          icon={<RiImage2Fill size='1.2em' />}
          large={true}
          onClick={(e) => this.handleAddFile(e, this.props.files.length, this.props.user.type === 'student' ? localStorage.getItem('studentName') : 'Sel')}
        />
        <Button
          style={{margin: '0 8px'}}
          intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
          className={this.props.files.length > 0 ? Classes.MINIMAL : null}
          loading={this.state.uploadingFiles}
          icon={<RiMusic2Fill size='1.2em' />}
          large={true}
          onClick={(e) => this.handleAddFile(e, this.props.files.length, this.props.user.type === 'student' ? localStorage.getItem('studentName') : 'Sel')}
        />
        <Button
          style={{margin: '0 8px'}}
          intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
          className={this.props.files.length > 0 ? Classes.MINIMAL : null}
          icon={<RiYoutubeLine size='1.2em' />}
          large={true}
          onClick={(e) => this.handleAddVideoEmbed(this.props.files.length, this.props.user.type === 'student' ? localStorage.getItem('studentName') : 'Sel')}
        />
      </div>
    )
  }

  handleClickWhenLocked = () => {
    alert('En este momento, tu profe está revisando el documento. Vuelve más tarde ;)')
  }

  // functions for topbar
  handleShareDocument = () => {
    const documentObject = {
      shared: !this.props.shared,
    }

    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify(documentObject),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
      },
    }

    let fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${this.props.id}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
          this.props.dispatch({
            type: 'CHANGE_DOCUMENT_SHARED',
            shared: data.document.shared,
          })

        })
      })
  }

  handleNameInputConfirm = (e) => {
    if (e.trim() === '') return

    this.props.dispatch({
      type: 'CHANGE_DOCUMENT_NAME',
      name: e,
    })

    this.props.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 

    this.setState({
      showEditDialog: false,
    })
  }


  render() {
    return (
      <div
        className='App'
        style={{
          display: 'flex',
          minHeight: '100vh',
          backgroundColor: '#f8f8f8',
          cursor: this.props.dragging ? 'grabbing' : 'default',
        }}
      >
        {!this.props.isSaved && !this.props.isLocked &&
          <Beforeunload onBeforeunload={() => "No has guardado tus cambios!"} />
        }
        <div
          className='main'
          style={{
            width: '100%',
            cursor: this.props.dragging ? 'grabbing' : 'default',
          }}
        >
          <TopBar
            socket={this.props.socket}
            user={this.props.user}
            isLoading={this.state.isLoadingDocument}
            breadcrumbs={this.props.breadcrumbs}
            connectedStudents={this.props.connectedStudents}
            
            isDocument={true}
            documentName={this.props.name}
            documentIsLocked={this.props.isLocked}
            documentIsSaved={this.props.isSaved}
            documentIsSaving={this.props.isSaving}
            documentIsShared={this.props.shared}
            modifiedDate={this.props.modifiedDate}
            
            handleShareDocument={this.handleShareDocument}
            handleNameInputConfirm={this.handleNameInputConfirm}
            handleSaveDocument={this.handleSaveDocument}
            handleUnlock={this.handleUnlock}
            isStudent={this.props.user.type === 'student'}
          />
          <div
            className='document'
          >
            <Toolbar
              user={this.props.user}
              isLocked={this.props.isLocked}
              handleClickWhenLocked={this.handleClickWhenLocked}
            />
            <div
              className='document-container'
              style={{
                position: 'relative',
                maxWidth: 'var(--doc-width)',
                margin: '0 auto',
              }}
            >
              {this.props.files.map((file, i) => {
                if (this.props.user.type === 'student' && file.hidden) return null
                return(
                  <div
                    key={file.id}
                    className='file'
                    style={{
                      textAlign: 'center',
                      opacity: file.hidden ? '.5' : '1',
                    }}
                  >
                    <FileWrapper
                      id={file.id}
                      fileType={file.type}
                      markers={file.markers}
                      highlights={file.highlights}
                      textInputs={file.textInputs}
                      lines={file.lines}
                      hasRendered={file.hasRendered}
                      user={this.props.user}
                      isStudent={this.props.user.type === 'student'}
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
                      {(file.type && file.type.toLowerCase() === 'draw') &&
                        <DrawFile file={file} fileHasRendered={this.fileHasRendered} />
                      }
                    </FileWrapper>
                  </div>
                )
              })}
              {!this.state.isLoadingDocument && !this.props.isLocked && this.renderAddButtons()}
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
            {this.state.isLoadingDocument &&
              <Spinner 
                style={{
                  background: 'red',
                }}
              />
            }
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '18px auto',
              // opacity: '.6',
            }}>
              <Button
                style={{margin: '0 8px'}}
                intent={Intent.PRIMARY}
                icon={<RiRefreshLine size='1.2em' />}
                large={true}
                text='Cargar más'
                onClick={() => this.getMoreFiles(this.props.files.length)}
              />
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
    files: state.files || [],
    filesOnLoad: state.filesOnLoad,
    filesLength: state.filesLength,
    isSaved: state.isSaved,
    isSaving: state.isSaving,
    dragging: state.dragging,
    documentIsLoading: state.documentIsLoading,
    locked: state.locked,
    isLocked: state.isLocked,
    lockedBy: state.lockedBy,
    editMode: state.editMode,
    modifiedDate: state.modifiedDate,
  }
}

export default connect(mapStateToProps)(withRouter(Document))
