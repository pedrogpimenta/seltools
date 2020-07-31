import React from 'react'
import { connect } from 'react-redux'

import Canvas from '../Canvas/Canvas'
import { loadFile } from '../../helpers/render-docs'

class App extends React.Component {
  componentDidMount() {
    const LSfiles = localStorage.getItem('files') || []

    if (LSfiles.length > 0) {
      this.props.dispatch({
        type: "SET_FILES",
        files: JSON.parse(LSfiles)
      }) 
    }
  }

  clearFiles() {
    if (window.confirm('Seguro quieres eliminar los documentos?')) {
      this.props.dispatch({
        type: "SET_FILES",
        files: []
      }) 
      
      localStorage.setItem('files', [])
    }
  }

  handleFileInputChange = async (e) => {
    const filesLoaded = e.target.files
    const numberOfFiles = filesLoaded.length

    const filesForState = []

    for (let i = 0; i < numberOfFiles; i++) {
      try {
        const fileContents = await loadFile(filesLoaded[i])  
        
        filesForState.push(
            {
            id: `${filesLoaded[i].name}-${Math.floor((Math.random() * 100000) + 1)}`,
            name: filesLoaded[i].name,
            content: fileContents,
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


  render() {
    return (
      <div className="App">
        <h1>seltools</h1>
        <div>
          <input multiple type="file" onChange={(e) => this.handleFileInputChange(e)} />
          <button onClick={() => this.clearFiles()}>Eliminar</button>
        </div>
        {this.props.files.map((file) => {
          return(
            <Canvas key={file.id} file={file} />
          )
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    files: state.files,
 }
}

export default connect(mapStateToProps)(App)
