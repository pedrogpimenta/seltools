import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  Alignment,
  Intent,
  Breadcrumbs,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'
import Canvas from '../Canvas/Canvas'
import Image from '../Image/Image'
import AudioFile from '../AudioFile/AudioFile'
import TextFile from '../TextFile/TextFile'
import FileWrapper from '../FileWrapper/FileWrapper'

class DocumentStudent extends React.Component {
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
    }
  }

  componentDidMount() {
    this.handleUnsaveDocument()

    if (!this.props.match.params.id) {
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

  handleUnsaveDocument = () => {
    window.setInterval(() => {
      if (!this.props.isSaved) {
        this.handleSaveDocumentStudent()
      }
    }, 60000)
  }

  handleSaveDocumentStudent = () => {
    this.props.dispatch({
      type: 'DOCUMENT_IS_SAVING',
    })

    let documentObject = {}

    let filesHaveChanged = false

    for (let fileOnLoad in this.props.files) {
      if (
        (this.props.files.length !== this.props.filesOnLoad.length)
        || (this.props.files[fileOnLoad].id !== this.props.filesOnLoad[fileOnLoad].id))
        {
          filesHaveChanged = true
        }
    }

    if (filesHaveChanged) {
      documentObject = {
        name: this.props.name,
        files: this.props.files,
      }
    } else {
      const filesForSave = this.props.files.map(file => {
        return {
          id: file.id,
          name: file.name,
          markers: file.markers,
        }
      })

      documentObject = {
        name: this.props.name,
        files: filesForSave,
      }
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
          type: 'DOCUMENT_SAVED',
        })
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
          intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
          className={this.props.files.length > 0 ? Classes.MINIMAL : null}
          icon='new-text-box'
          large={true}
          // text='Añadir texto'
          onClick={() => this.handleAddTextFile(fileIndex)}
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
                  // currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
                  items={[
                    { href: '/alumno/documentos',
                      icon: 'arrow-left',
                      text: 'Documentos',
                    },
                    {
                      icon: 'document',
                      text: this.props.documentIsLoading ? 'Cargando...' : this.props.name,
                    },
                  ]}
                />
              </div>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
              <Button
                intent={this.props.isSaved ? Intent.SUCCESS : Intent.PRIMARY}
                loading={this.props.isSaving}
                icon="floppy-disk"
                text="Guardar"
                onClick={(e) => this.handleSaveDocumentStudent(e)}
              />
              {/* <NavbarDivider />
              <Button className={Classes.MINIMAL} icon="user" /> */}
            </NavbarGroup>
          </Navbar>
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              paddingTop: '70px',
            }}
          >
            {this.props.files.map((file, i) => {
              if (file.type === 'pdf') {
                return(
                  <div>
                    <FileWrapper
                      key={file.id}
                      id={file.id}
                      markers={file.markers}
                      hasRendered={file.hasRendered}
                      isStudent={true}
                    >
                      <Canvas file={file} fileHasRendered={this.fileHasRendered} />
                    </FileWrapper>
                    {this.renderAddButtons(i)}
                  </div>
                )
              } else if (file.type === 'txt') {
                return(
                  <div>
                    <FileWrapper
                      key={file.id}
                      id={file.id}
                      fileType={file.type}
                      markers={[]}
                      hasRendered={file.hasRendered}
                    >
                      <TextFile file={file} />
                    </FileWrapper>
                    {this.renderAddButtons(i)}
                  </div>
                )
              } else if (file.type === 'aac' || file.type === 'mp3' || file.type === 'ogg' || file.type === 'opus' || file.type === 'wav' || file.type === 'webm') {
                return(
                  <div>
                    <AudioFile key={file.id} file={file} />
                    {this.renderAddButtons(i)}
                  </div>
                )
              } else {
                return(
                  <div>
                    <FileWrapper
                      key={file.id}
                      id={file.id}
                      markers={file.markers}
                      hasRendered={file.hasRendered}
                      isStudent={true}
                    >
                      <Image file={file} />
                    </FileWrapper>
                    {this.renderAddButtons(i)}
                  </div>
                )
              }
            })}
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
    dragging: state.dragging,
    isSaved: state.isSaved,
    isSaving: state.isSaving,
    documentIsLoading: state.documentIsLoading,
  }
}

export default connect(mapStateToProps)(withRouter(DocumentStudent))
