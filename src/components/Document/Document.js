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
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Switch,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'
import Canvas from '../Canvas/Canvas'
import Image from '../Image/Image'
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
    }
  }

  componentDidMount() {
    this.getUser()

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

          // this.setState({fileUrl: url})

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
              console.log("Response from s3")
              this.setState({uploadingFiles: false})
              if (i === files.length - 1) {
                this.props.dispatch({
                  type: "ADD_FILES",
                  files: filesForState
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

  // handleFileInputChange = async (e) => {
  //   const filesLoaded = e.target.files
  //   const numberOfFiles = filesLoaded.length

  //   const filesForState = []

  //   for (let i = 0; i < numberOfFiles; i++) {
  //     try {
  //       const fileContents = await loadFile(filesLoaded[i])  
  //       const ext = filesLoaded[i].name.split('.').pop().toLowerCase()
        
  //       filesForState.push(
  //         {
  //           id: `${filesLoaded[i].name}-${Math.floor((Math.random() * 100000) + 1)}`,
  //           name: filesLoaded[i].name,
  //           type: ext,
  //           content: fileContents,
  //           markers: [],
  //         }
  //       )
  //     } catch (e) {
  //         console.warn(e.message)
  //     }
  //   }
    
  //   this.props.dispatch({
  //     type: "ADD_FILES",
  //     files: filesForState
  //   }) 

  //   this.props.dispatch({
  //     type: "DOCUMENT_UNSAVED",
  //   }) 
  // }

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

  handleSaveDocument = () => {
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
    console.log('e:', e)

    this.props.dispatch({
      type: 'CHANGE_SHAREDWITH',
      sharedWithStudent: studentId,
    })

    console.log('current shared:', this.props.sharedWith)
    
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
          // value={this.props.name}
          confirmOnEnterKey={true}
          onConfirm={(e) => this.handleNameInputChange(e)}
          // onChange={(e) => this.handleBreadcrumbInputChange(e)}
        >
          {/* {text} */}
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
                {/* <Button
                  className={Classes.MINIMAL}
                  icon="edit"
                  onClick={(e) => this.openEditNameDialog(e)}
                /> */}
              </div>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
              <Popover
                boundary='viewport'
              >
                <Button 
                  // className={Classes.MINIMAL} 
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
                // className={this.props.isSaving ? Classes.DEFAULT : this.props.isSaved ? Classes.MINIMAL : null}
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
                  >
                    <Image file={file} />
                  </FileWrapper>
                )
              }
            })}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '48px auto',
            }}>
              <Button
                intent={this.props.files.length > 0 ? Intent.DEFAULT : Intent.PRIMARY}
                className={this.props.files.length > 0 ? Classes.MINIMAL : null}
                loading={this.state.uploadingFiles}
                icon='add'
                text='Añadir archivos'
                onClick={(e) => this.fileInput.current.click()}
              />
              <input
                ref={this.fileInput}
                multiple
                accept='image/png, image/jpeg, image/webp, image/svg+xml, image/bmp, image/gif'
                // accept='image/png, image/jpeg, image/webp, image/svg+xml, image/bmp, image/gif, application/pdf'
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
