import React from 'react'
import { connect } from 'react-redux'

import Canvas from '../Canvas/Canvas'
import Image from '../Image/Image'
import FileWrapper from '../FileWrapper/FileWrapper'

import { loadFile } from '../../helpers/render-docs'

class App extends React.Component {
  componentDidMount() {
    const LSfiles = localStorage.getItem('files') || []

    if (LSfiles.length > 0) {
      this.props.dispatch({
        type: "SET_FILES",
        files: JSON.parse(LSfiles),
      }) 
    }
  }

  clearFiles() {
    if (window.confirm('Seguro quieres eliminar los documentos?')) {
      this.props.dispatch({
        type: "SET_FILES",
        files: [],
      }) 
    }
  }

  clearMarkers() {
    if (window.confirm('Seguro quieres eliminar los markers?')) {
      this.props.dispatch({
        type: "REMOVE_MARKERS",
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
      type: "SET_FILES",
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
            maxWidth: '800px',
            margin: '0 auto',
            cursor: this.props.dragging ? 'grabbing' : 'default',
          }}
        >
          <h1>seltools</h1>
          <div>
            <input multiple type="file" onChange={(e) => this.handleFileInputChange(e)} />
            <button onClick={() => this.clearFiles()}>Eliminar archivos</button>
            <button onClick={() => this.clearMarkers()}>Eliminar markers</button>
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
