import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Beforeunload } from 'react-beforeunload'
import axios from 'axios'

import {
  Alignment,
  Intent,
  Breadcrumbs,
  Breadcrumb,
  Button,
  Classes,
  EditableText,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Switch,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'
import Canvas from '../Canvas/Canvas'
import Image from '../Image/Image'
import AudioFile from '../AudioFile/AudioFile'
import TextFile from '../TextFile/TextFile'
import FileWrapper from '../FileWrapper/FileWrapper'

// import { loadFile } from '../../helpers/render-docs'

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
      files: [],
      filesOnLoad: [],
      isLoadingStudents: true,
      students: [],
      showEditDialog: false,
      fileUrls: [],
      uploadingFiles: false,
      activeMode: 'marker',
    }
  }

  componentDidMount() {
    this.getUser()
    this.handleUnsaveDocument()

    if (!this.props.match.params.id) {
      this.props.dispatch({
        type: 'DOCUMENT_IS_LOADED',
      })

      this.props.dispatch({
        type: 'LOAD_FILES',
        files: [],
      })

      this.props.dispatch({
        type: 'CHANGE_DOCUMENT_SHAREDWITH',
        sharedWith: [],
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
          const LSfiles = data[0].files || []

          if (LSfiles.length > 0) {
            this.props.dispatch({
              type: 'LOAD_FILES',
              files: LSfiles,
            })
          }

          // TODO: Improve so much dispatches

          this.props.dispatch({
            type: 'CHANGE_DOCUMENT_SHAREDWITH',
            sharedWith: data[0].sharedWith,
          })

          this.props.dispatch({
            type: 'CHANGE_DOCUMENT_ID',
            id: this.props.match.params.id,
          })

          this.props.dispatch({
            type: 'CHANGE_DOCUMENT_NAME',
            name: data[0].name,
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

  handleNameInputChange = (e) => {
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

  handleUnsaveDocument = () => {
    window.setInterval(() => {
      if (!this.props.isSaved) {
        this.handleSaveDocument()
      }
    }, 30000)
  }

  handleSaveDocument = () => {
    this.props.dispatch({
      type: 'DOCUMENT_IS_SAVING',
    })

    const documentObject = {
      name: this.props.name,
      files: this.props.files,
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

    const fetchUrl = !this.props.id
      ? `${REACT_APP_SERVER_BASE_URL}/document/`
      : `${REACT_APP_SERVER_BASE_URL}/document/${this.props.id}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        this.props.dispatch({
          type: 'CHANGE_DOCUMENT_ID',
          id: data.id,
        })

        this.props.dispatch({
          type: 'DOCUMENT_SAVED',
        })

        this.props.history.push(`/documento/${data.id}`)
      })

  }

  getUser = () => {
    fetch(`${REACT_APP_SERVER_BASE_URL}/user/Selen`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoadingStudents: false,
          students: data[0].students || [],
        })
      })
  }

  handleStudentShare = (e, studentId) => {
    this.props.dispatch({
      type: 'CHANGE_SHAREDWITH',
      sharedWithStudent: studentId,
    })

    const documentObject = {
      _id: this.props.id,
      name: this.props.name,
    }

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/student/${studentId}/document`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
      })
  }

  handleAddTextFile = (fileIndex) => {
    this.props.dispatch({
      type: "ADD_TEXT_FILE",
      position: fileIndex,
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

  changeModeToMarkers = () => {
    this.setState({
      activeMode: 'marker'
    })
  }

  changeModeToHighlight = () => {
    this.setState({
      activeMode: 'highlight'
    })
  }

  renderStudents = () => {
    if (this.state.isLoadingStudents) return <div>Cargando...</div>

    return this.state.students.map(student => (
      <li key={student._id} style={{display: 'block'}}>
        <Switch 
          label={student.name}
          defaultChecked={this.props.sharedWith.find(withStudent => withStudent._id === student._id)}
          onChange={(e) => this.handleStudentShare(e, student._id)}
        />
      </li>
    ))
  }

  openEditNameDialog = () => {
    this.setState({showEditDialog: true})
  }

  renderCurrentBreadcrumb = ({ text, ...restProps }) => {
    return (
      <Breadcrumb>
        <EditableText
          style={{color: 'black'}}
          defaultValue={this.props.documentIsLoading ? 'Cargando...' : this.props.name}
          placeholder='Nuevo documento'
          confirmOnEnterKey={true}
          onConfirm={(e) => this.handleNameInputChange(e)}
        >
        </EditableText>
      </Breadcrumb>
    )
  }

  fileHasRendered = (fileId) => {
    this.props.dispatch({
      type: "FILE_HAS_RENDERED",
      fileId: fileId,
    }) 
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
          onClick={() => this.handleAddTextFile(fileIndex)}
        />
        <Button
          style={{margin: '0 8px'}}
          intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
          className={this.props.files.length > 0 ? Classes.MINIMAL : null}
          loading={this.state.uploadingFiles}
          icon='media'
          large={true}
          // text='Añadir archivos'
          onClick={(e) => this.handleAddFile(e, fileIndex)}
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
                <Breadcrumbs
                  currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
                  items={[
                    { href: '/documentos',
                      icon: 'arrow-left',
                      text: 'Documentos',
                    },
                    {
                      icon: 'document',
                      text: this.props.name,
                    },
                  ]}
                />
              </div>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
              <Popover
                boundary='viewport'
              >
                <Button 
                  intent={Intent.PRIMARY}
                  icon="share"
                  text="Compartir"
                  style={{marginRight: '2px', marginLeft: '2px'}}
                />
                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: '16px',
                  }}
                >
                  {this.renderStudents()}
                </ul>
              </Popover>
              <Button
                intent={this.props.name ? this.props.isSaved ? Intent.SUCCESS : Intent.PRIMARY : Intent.DEFAULT}
                loading={this.props.isSaving}
                style={{marginRight: '8px', marginLeft: '8px'}}
                disabled={!this.props.name}
                icon="floppy-disk"
                text={this.props.isSaved ? "¡Guardado!" : "Guardar"}
                onClick={(e) => this.handleSaveDocument(e)}
              />
              <NavbarDivider />
              <Button className={Classes.MINIMAL} icon="user" />
            </NavbarGroup>
          </Navbar>
          <div
            style={{
              position: 'absolute',
              top: '70px',
              left: '10px',
            }}
          >
            <Menu className={`tools-menu ${Classes.ELEVATION_1}`}>
              <MenuItem
                active={this.state.activeMode === 'marker'}
                icon="widget"
                onClick={this.changeModeToMarkers}
              />
              <MenuDivider />
              <MenuItem
                active={this.state.activeMode === 'highlight'}
                icon="highlight"
                onClick={this.changeModeToHighlight}
               />
            </Menu>
          </div>
          <div
            style={{
              maxWidth: 'var(--doc-width)',
              margin: '0 auto',
              paddingTop: '70px',
              paddingRight: '10px',
              paddingLeft: '60px',
            }}
          >
            {this.props.files.length === 0 &&
              this.renderAddButtons()
            }
            {this.props.files.map((file, i) => {
              if (file.type === 'pdf') {
                return(
                  <div
                    key={file.id}
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
                      mode={this.state.activeMode}
                    >
                      <Canvas file={file} fileHasRendered={this.fileHasRendered} />
                    </FileWrapper>
                    {this.renderAddButtons(i)}
                  </div>
                )
              } else if (file.type === 'txt') {
                return(
                  <div
                    key={file.id}
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <FileWrapper
                      id={file.id}
                      fileType={file.type}
                      markers={[]}
                      highlights={file.highlights}
                      hasRendered={file.hasRendered}
                      mode={this.state.activeMode}
                    >
                      <TextFile file={file} />
                    </FileWrapper>
                    {this.renderAddButtons(i)}
                  </div>
                )
              } else if (file.type === 'aac' || file.type === 'mp3' || file.type === 'ogg' || file.type === 'opus' || file.type === 'wav' || file.type === 'webm') {
                return(
                  <div
                    key={file.id}
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
                      mode={this.state.activeMode}
                    >
                      <AudioFile file={file} />
                    </FileWrapper>
                    {this.renderAddButtons(i)}
                  </div>
                )
              } else {
                return(
                  <div
                    key={file.id}
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
                      mode={this.state.activeMode}
                    >
                      <Image file={file} />
                    </FileWrapper>
                    {this.renderAddButtons(i)}
                  </div>
                )
              }
            })}
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
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
    name: state.name,
    sharedWith: state.sharedWith || [],
    files: state.files,
    filesOnLoad: state.filesOnLoad,
    isSaved: state.isSaved,
    isSaving: state.isSaving,
    dragging: state.dragging,
    documentIsLoading: state.documentIsLoading,
  }
}

export default connect(mapStateToProps)(withRouter(Document))
