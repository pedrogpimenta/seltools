import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
// import './Document.css'

import Canvas from '../Canvas/Canvas'
import Image from '../Image/Image'
import FileWrapper from '../FileWrapper/FileWrapper'
import Button from '../Button/Button'

import { loadFile } from '../../helpers/render-docs'

class Document extends React.Component {
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
    this.getUser()

    if (this.props.isNew) {
      // const LSfiles = [] 
      localStorage.removeItem('files')
      localStorage.removeItem('name')

    } else {

      fetch(`http://localhost:3000/document/${this.props.match.params.id}`)
        .then(response => response.json())
        .then(data => {
          const LSfiles = data[0].files

          if (LSfiles.length > 0) {
            this.props.dispatch({
              type: 'ADD_FILES',
              files: LSfiles,
            })
          }

          console.log('shared with:', data[0].sharedWith)
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
        })


      // if (LSfiles.length > 0) {
      //   this.props.dispatch({
      //     type: "ADD_FILES",
      //     files: LSfiles,
      //   }) 
      // }
    }

  }

  clearFiles() {
    if (window.confirm('Seguro quieres eliminar los documentos?')) {
      this.props.dispatch({
        type: "DELETE_ALL_FILES",
      }) 
    }
  }

  clearMarkers() {
    if (window.confirm('Seguro quieres eliminar los markers?')) {
      this.props.dispatch({
        type: "DELETE_ALL_MARKERS",
      }) 
    }
  }

  handleFileInputChange = async (e) => {
    const filesLoaded = e.target.files
    const numberOfFiles = filesLoaded.length

    const filesForState = JSON.parse(localStorage?.getItem('files')) || []

    for (let i = 0; i < numberOfFiles; i++) {
      try {
        const fileContents = await loadFile(filesLoaded[i])  
        const ext = filesLoaded[i].name.split('.').pop().toLowerCase()
        
        filesForState.push(
          {
            id: `${filesLoaded[i].name}-${Math.floor((Math.random() * 100000) + 1)}`,
            name: filesLoaded[i].name,
            type: ext,
            content: fileContents,
            markers: [],
          }
        )
      } catch (e) {
          console.warn(e.message)
      }
    }
    
    this.props.dispatch({
      type: "ADD_FILES",
      files: filesForState
    }) 
  }

  handleNameInputChange = (e) => {
    this.props.dispatch({
      type: 'CHANGE_DOCUMENT_NAME',
      name: e.target.value,
    })

    // this.setState({
    //   name: e.target.value
    // })
  }

  handleSaveDocument = () => {
    const documentObject = {
      name: this.props.name,
      files: this.props.files,
    }

    const requestOptions = {
      method: this.props.isNew ? 'POST' : 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    const fetchUrl = this.props.isNew
      ? `http://localhost:3000/document/`
      : `http://localhost:3000/document/${this.props.id}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        // console.log('data:', data)
        this.props.dispatch({
          type: 'CHANGE_DOCUMENT_ID',
          id: data.id,
        })

        this.props.history.push(`/documento/${data.id}`)
      })

  }

  getUser = () => {
    fetch('http://localhost:3000/user/Selen')
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoadingStudents: false,
          students: data[0].students,
        })
      })
  }

  handleStudentShare = (e, studentId) => {
    const documentObject = {
      _id: this.props.id,
      name: this.props.name,
      files: this.props.files,
    }

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    const fetchUrl = `http://localhost:3000/student/${studentId}/document`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        // console.log('data:', data)
      })

  }

  renderStudents = () => {
    if (this.state.isLoadingStudents) return <div>Loading...</div>


    return this.state.students.map(student => (
      <li key={student._id} style={{display: 'inline-block'}}>
        <label>
          <input
            type="checkbox"
            checked={this.props.sharedWith.find(withStudent => withStudent._id === student._id)}
            onChange={(e) => this.handleStudentShare(e, student._id)}
          />
          <span>{student.name}</span>
        </label>
      </li>
    ))
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
          <Link to='/documentos'>{'<'} Documentos</Link>
          <h1>Seltools</h1>
          <div>
            <input
              // TODO: improve input field
              style={{marginBottom: '16px'}}
              ref={this.documentNameInput}
              value={this.props.name}
              type='text'
              onChange={(e) => this.handleNameInputChange(e)}
            />
          </div>
          <div>
            {this.renderStudents()}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <div>
              <Button
                type='file'
                text='Añadir archivos'
                onChange={(e) => this.handleFileInputChange(e)}
              />
              <Button
                type='button'
                text='Guardar documento'
                onClick={(e) => this.handleSaveDocument(e)}
              />
            </div>
            <div>
              <Button
                type='button'
                text='Eliminar archivos'
                onClick={() => this.clearFiles()}
              />
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
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    id: state.id,
    name: state.name,
    sharedWith: state.sharedWith || [],
    files: state.files,
    dragging: state.dragging,
  }
}

export default connect(mapStateToProps)(withRouter(Document))
