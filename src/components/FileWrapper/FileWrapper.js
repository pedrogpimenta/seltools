import React from 'react';
import Markers from '../Markers/Markers'
import Highlights from '../Highlights/Highlights'
import Lines from '../Lines/Lines'
import TextInputs from '../TextInputs/TextInputs'

class FileWrapper extends React.Component {
  // constructor() {
  //   super()

  //   this.state = {
  //     hover: false,
  //   }
  // }

  // handleMouseEnter = () => {
  //   this.setState({hover: true})
  // }

  // handleMouseLeave = () => {
  //   this.setState({hover: false})
  // }

  render() {
    return (
      <div
        className='file-wrapper'
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
          {this.props.fileType !== 'aac' &&
            this.props.fileType !== 'mp3' &&
            this.props.fileType !== 'm4a' &&
            this.props.fileType !== 'ogg' &&
            this.props.fileType !== 'opus' &&
            this.props.fileType !== 'wav' &&
            this.props.fileType !== 'webm' &&
            <Markers
              fileId={this.props.id}
              markers={this.props.markers}
              isStudent={this.props.isStudent}
              hasRendered={this.props.hasRendered}
              isActive={this.props.mode === 'marker'}
              isLocked={this.props.isLocked}
              handleClickWhenLocked={this.props.handleClickWhenLocked}
            />
          }
          {this.props.fileType !== 'aac' &&
            this.props.fileType !== 'mp3' &&
            this.props.fileType !== 'm4a' &&
            this.props.fileType !== 'ogg' &&
            this.props.fileType !== 'opus' &&
            this.props.fileType !== 'wav' &&
            this.props.fileType !== 'webm' &&
            <Highlights
              fileId={this.props.id}
              highlights={this.props.highlights || []}
              isActive={this.props.mode === 'highlight'}
            />
          }
          {this.props.fileType !== 'aac' &&
            this.props.fileType !== 'mp3' &&
            this.props.fileType !== 'm4a' &&
            this.props.fileType !== 'ogg' &&
            this.props.fileType !== 'opus' &&
            this.props.fileType !== 'wav' &&
            this.props.fileType !== 'webm' &&
            <Lines
              fileId={this.props.id}
              lines={this.props.lines || []}
              isActive={this.props.mode === 'lines'}
            />
          }
          {this.props.fileType !== 'aac' &&
            this.props.fileType !== 'mp3' &&
            this.props.fileType !== 'm4a' &&
            this.props.fileType !== 'ogg' &&
            this.props.fileType !== 'opus' &&
            this.props.fileType !== 'wav' &&
            this.props.fileType !== 'webm' &&
            <TextInputs
              fileId={this.props.id}
              textInputs={this.props.textInputs || []}
              isActive={this.props.mode === 'textinputs'}
              isStudent={this.props.isStudent}
              isLocked={this.props.isLocked}
              handleClickWhenLocked={this.props.handleClickWhenLocked}
            />
          }
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default FileWrapper
