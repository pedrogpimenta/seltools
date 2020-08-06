import React from 'react';
import { getDocs } from '../../helpers/render-docs'

class Canvas extends React.Component {
  constructor() {
    super()

    this.canvas = React.createRef()
  }

  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d')
    getDocs(this.props.file, this.ctx, this.props.fileHasRendered)
  }

  render() {
    return (
      <div
        style={{
          userSelect: 'none',
        }}
      >
        <canvas
          ref={this.canvas}
          style={{
            maxWidth: '100%',
            margin: '0 auto',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px 0 rgba(0, 0, 0, .1)',
          }}
        />
      </div>
    )
  }
};

export default Canvas
