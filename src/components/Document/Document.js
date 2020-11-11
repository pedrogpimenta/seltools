import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Beforeunload } from 'react-beforeunload'
import axios from 'axios'

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

  componentDidMount() {
    this.getUser()

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
        })
    }

    if (!this.props.match.params.id) {
      
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
    } else {
      fetch(`${REACT_APP_SERVER_BASE_URL}/document/${this.props.match.params.id}`)
        .then(response => response.json())
        .then(data => {
          const LSfiles = data.document.files || []

          document.title = `${data.document.name} -- Seltools STAGING`;

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
            type: "DOCUMENT_IS_LOADED",
          }) 
        })
    }
  }

 
  handleFileInputChange = (e) => {
    this.setState({uploadingFiles: true})

    const files = e.target.files
    const filesForState = []

    for (let i = 0; i < files.length; i++) {
      let fileParts = files[i].name.split('.')
      let fileName = files[i].name.replace(/\s+/gi, '-').replace(/[^a-zA-Z0-9-]/gi, '_')
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
            id: `${fileName}-${Math.floor((Math.random() * 100000) + 1)}`,
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
    const userName = this.props.isStudent ? localStorage.getItem('studentName') : 'Selen'

    fetch(`${REACT_APP_SERVER_BASE_URL}/user/${userName}`)
    .then(response => response.json())
    .then(data => {
      this.setState({
        user: data.user,
      })
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

  handleAddFile = (e, fileIndex) => {
    this.setState({
      addFileIndex: fileIndex,
    })
    this.fileInput.current.click(e)
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
        className='fileButtons'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          margin: '0 auto 4px',
          transition: 'all 100ms ease-out',
          opacity: '0',
        }}
      >
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
          onClick={(e) => this.handleAddFile(e, i - 1)}
        />
        <Button
          style={{margin: '0 4px'}}
          intent={Intent.DEFAULT}
          className={Classes.MINIMAL}
          loading={this.state.uploadingFiles}
          icon='music'
          onClick={(e) => this.handleAddFile(e, i - 1)}
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
          // text='Añadir texto'
          onClick={() => this.handleAddTextFile(this.props.files.length, this.props.isStudent ? localStorage.getItem('studentName') : 'Selen')}
        />
        <Button
          style={{margin: '0 8px'}}
          intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
          className={this.props.files.length > 0 ? Classes.MINIMAL : null}
          loading={this.state.uploadingFiles}
          icon='media'
          large={true}
          // text='Añadir archivos'
          onClick={(e) => this.handleAddFile(e, this.props.files.length)}
        />
        <Button
          style={{margin: '0 8px'}}
          intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
          className={this.props.files.length > 0 ? Classes.MINIMAL : null}
          loading={this.state.uploadingFiles}
          icon='music'
          large={true}
          // text='Añadir archivos'
          onClick={(e) => this.handleAddFile(e, this.props.files.length)}
        />
      </div>
    )
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
            isStudent={this.props.isStudent}
          />
          <div
            className='document'
            style={{
              position: 'relative',
              marginTop: '50px',
              padding: '20px',
              backgroundColor: 'rgb(250, 250, 250)'
            }}
          >
            <Toolbar />
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
                    >
                      {(file.type && file.type.toLowerCase() === 'pdf') &&
                        <Canvas file={file} fileHasRendered={this.fileHasRendered} />
                      }
                      {(file.type && file.type.toLowerCase() === 'txt') &&
                        <TextFile file={file} />
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
                        (file.type && file.type.toLowerCase() === 'png')) &&
                        <Image file={file} />
                      }
                    </FileWrapper>
                  </div>
                )
              })}
              {this.renderAddButtons()}
              <input
                ref={this.fileInput}
                multiple
                // accept='image/png, image/jpeg, image/webp, image/svg+xml, image/bmp, image/gif, application/pdf'
                accept='image/png, image/jpeg, image/webp, image/svg+xml, image/bmp, image/gif, audio/aac, audio/mpeg, audio/ogg, audio/opus, audio/wav, audio/webm'
                type='file'
                onChange={(e) => this.handleFileInputChange(e)}
                style={{display: 'none'}}
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
    files: state.files,
    filesOnLoad: state.filesOnLoad,
    isSaved: state.isSaved,
    isSaving: state.isSaving,
    dragging: state.dragging,
    documentIsLoading: state.documentIsLoading,
    editMode: state.editMode,
  }
}

export default connect(mapStateToProps)(withRouter(Document))
