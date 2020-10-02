import React from 'react'

class AudioFile extends React.Component {
  render() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '500px',
        maxWidth: '100%',
        // marginBottom: '20px',
        userSelect: 'none',
        }}>
        <audio
          controls
          src={this.props.file.url}
          id={this.props.file.id}
          style={{
            width: '100%',
          }}
        >
          Your browser does not support the
          <code>audio</code> element.
        </audio>
        {/* <img
          src={this.props.file.url}
          alt={this.props.file.id}
          style={{
            maxWidth: '100%',
            margin: '0 auto',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px 0 rgba(0, 0, 0, .1)',
          }}
        /> */}
      </div>
    )
  }
};

export default AudioFile
