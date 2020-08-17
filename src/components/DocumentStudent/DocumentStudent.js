import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
// import './Document.css'

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'
import Canvas from '../Canvas/Canvas'
import Image from '../Image/Image'
import FileWrapper from '../FileWrapper/FileWrapper'
import Button from '../Button/Button'

import { loadFile } from '../../helpers/render-docs'

class DocumentStudent extends React.Component {
  constructor() {
    super()

    this.documentNameInput = React.createRef()

    this.state = {
      id: '',
      name: '',
      files: [],
      isSaved: false,
      isLoadingStudents: true,
      students: [],
    }
  }

  componentDidMount() {
    fetch(`${REACT_APP_SERVER_BASE_URL}/document/${this.props.match.params.id}`)
      .then(response => response.json())
      .then(data => {
        const LSfiles = data[0].files

        if (LSfiles.length > 0) {
          this.props.dispatch({
            type: 'ADD_FILES',
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
      })
  }

  clearMarkers() {
    if (window.confirm('Seguro quieres eliminar los markers?')) {
      this.props.dispatch({
        type: "DELETE_ALL_MARKERS",
      }) 
    }
  }

  handleSaveDocument = () => {
    const filesForSave = this.props.files.map(file => {
      return {
        id: file.id,
        name: file.name,
        markers: file.markers,
      }
    })

    const documentObject = {
      name: this.props.name,
      files: filesForSave,
    }

    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${this.props.id}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        this.props.dispatch({
          type: 'DOCUMENT_SAVED'
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
        className="App"
        style={{
          display: 'flex',
          cursor: this.props.dragging ? 'grabbing' : 'default',
        }}
      >
        <div
          style={{
            width: '100%',
            cursor: this.props.dragging ? 'grabbing' : 'default',
          }}
        >
          <Link to='/alumno/documentos'>{'<'} Documentos</Link>
          <h1>Seltools</h1>
          <div>{this.props.name}</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <div>
              <Button
                type='button'
                text='Guardar documento'
                onClick={(e) => this.handleSaveDocument(e)}
              />
            </div>
            <div>
              <Button
                type='button'
                text='Eliminar notas'
                onClick={() => this.clearMarkers()}
              />
            </div>
          </div>
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
  }
}

export default connect(mapStateToProps)(withRouter(DocumentStudent))
