import React from 'react';
import Markers from '../Markers/Markers'

class FileWrapper extends React.Component {
  render() {
    return (
      <div
        style={{
          position: 'relative',
        }}
      >
        <Markers 
          file={this.props.id}
          markers={this.props.markers}
          hasRendered={this.props.hasRendered}
        />
        {this.props.children}
      </div>
    )
  }
}

export default FileWrapper
