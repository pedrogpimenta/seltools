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

  handleSaveDocumentStudent = () => {
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
      })
  }

  fileHasRendered = (fileId) => {
    this.props.dispatch({
      type: "FILE_HAS_RENDERED",
      fileId: fileId,
    }) 
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
              <NavbarHeading>Seltools</NavbarHeading>
              <NavbarDivider />
              <div
                style={{marginLeft: '8px'}}
              >
                <Breadcrumbs
                  // currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
                  items={[
                    { href: '/alumno/documentos',
                      icon: 'folder-close',
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
                intent={this.props.isSaved ? null : Intent.PRIMARY}
                className={this.props.isSaved ? Classes.MINIMAL : null}
                icon="floppy-disk"
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
            {this.props.files.map((file) => {
              if (file.type === 'pdf') {
                return(
                  <FileWrapper
                    key={file.id}
                    id={file.id}
                    markers={file.markers}
                    hasRendered={file.hasRendered}
                    isStudent={true}
                  >
                    <Canvas file={file} fileHasRendered={this.fileHasRendered} />
                  </FileWrapper>
                )
              } else {
                return(
                  <FileWrapper
                    key={file.id}
                    id={file.id}
                    markers={file.markers}
                    hasRendered={file.hasRendered}
                    isStudent={true}
                  >
                    <Image file={file} />
                  </FileWrapper>
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
    documentIsLoading: state.documentIsLoading,
  }
}

export default connect(mapStateToProps)(withRouter(DocumentStudent))
