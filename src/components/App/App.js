import React from 'react'
import { connect } from 'react-redux'
import './App.css'

import Canvas from '../Canvas/Canvas'
import Image from '../Image/Image'
import FileWrapper from '../FileWrapper/FileWrapper'
import Button from '../Button/Button'

import { loadFile } from '../../helpers/render-docs'

class App extends React.Component {
  componentDidMount() {
    const LSfiles = localStorage.getItem('files') || []

    if (LSfiles.length > 0) {
      this.props.dispatch({
        type: "ADD_FILES",
        files: JSON.parse(LSfiles),
      }) 
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
          <h1>Seltools</h1>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <Button
              type='file'
              text='Añadir archivos'
              onChange={(e) => this.handleFileInputChange(e)}
            />
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
    files: state.files,
    dragging: state.dragging,
  }
}

export default connect(mapStateToProps)(App)
