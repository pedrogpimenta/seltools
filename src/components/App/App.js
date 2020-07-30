import React from 'react'
import Canvas from '../Canvas/Canvas'

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      files: [],
    }
  }

  handleFileInputChange = (e) => {
    const filesLoaded = e.target.files
    const numberOfFiles = filesLoaded.length

    const filesForState = []

    for (let i = 0; i < numberOfFiles; i++) {
      filesForState.push(
        {
          name: filesLoaded[i].name,
          content: URL.createObjectURL(filesLoaded[i]),
        }
      )
    }
    
    this.setState({
      files: filesForState
    })
  }


  render () {
    return (
      <div className="App">
        <h1>seltools</h1>
        <div>
          <input multiple type="file" onChange={(e) => this.handleFileInputChange(e)} />
        </div>
        {this.state.files.map((file) => {
          return(
            <Canvas file={file} />
          )
        })}
      </div>
    );
  }
}

export default App
