import React from 'react';
import Markers from '../Markers/Markers'
import Marker from '../Marker/Marker'

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
        />
        {this.props.children}
      </div>
    )
  }
}

export default FileWrapper
