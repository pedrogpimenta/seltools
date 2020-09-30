import React from 'react';
import Markers from '../Markers/Markers'
import Highlights from '../Highlights/Highlights'

class FileWrapper extends React.Component {
  constructor() {
    super()

    this.state = {
      hover: false,
    }
  }

  handleMouseEnter = () => {
    this.setState({hover: true})
  }

  handleMouseLeave = () => {
    this.setState({hover: false})
  }

  render() {
    return (
      <div
        style={{
          display: 'inline-block',
          textAlign: 'left',
          position: 'relative',
          marginBottom: '15px',
          maxWidth: '100%',
        }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.fileButtons}
        <div
          style={{
            position: 'relative',
          }}
        >
          {this.props.fileType !== 'aac' && this.props.fileType !== 'mp3' && this.props.fileType !== 'ogg' && this.props.fileType !== 'opus' && this.props.fileType !== 'wav' && this.props.fileType !== 'webm' && this.props.fileType !== 'txt' &&
            <Markers
              fileId={this.props.id}
              markers={this.props.markers}
              isStudent={this.props.isStudent}
              hasRendered={this.props.hasRendered}
              isActive={this.props.mode === 'marker'}
            />
          }
          {this.props.fileType !== 'aac' && this.props.fileType !== 'mp3' && this.props.fileType !== 'ogg' && this.props.fileType !== 'opus' && this.props.fileType !== 'wav' && this.props.fileType !== 'webm' && this.props.fileType !== 'txt' &&
            <Highlights
              fileId={this.props.id}
              highlights={this.props.highlights || []}
              isActive={this.props.mode === 'highlight'}
              // isStudent={this.props.isStudent}
              // hasRendered={this.props.hasRendered}
            />
          }
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default FileWrapper
