import React from 'react'
// import { store } from '../../store/store'
import ReactPlayer from 'react-player'
// import {
//   Button,
//   Classes,
//   Intent,
// } from "@blueprintjs/core"

class VideoEmbed extends React.Component {
  constructor() {
    super();

  }

  render() {
    return (
      <div
        className={`videoembed`}
        style={{
          position: 'relative',
          display: 'flex',
          marginBottom: '20px',
          // width: 'var(--doc-width)',
          maxWidth: '100%',
          minHeight: '40px',
          padding: '0',
          margin: '0 auto',
          boxShadow: '0 2px 10px 0 rgba(0, 0, 0, .1)',
          borderRadius: '6px',
          fontSize: '16px',
          backgroundColor: 'white',
          zIndex: '10',
        }}
      >
        <ReactPlayer url={this.props.file.content} />
      </div>
    )
  }
};

export default VideoEmbed
