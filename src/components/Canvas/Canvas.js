import React from 'react';
import { getDocs } from '../../helpers/render-docs'

class Canvas extends React.Component {
  constructor() {
    super()

    this.canvas = React.createRef()
  }

  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d')
    getDocs(this.props.file, this.ctx)
  }

  componentDidUpdate() {
    getDocs(this.props.file, this.ctx)
  }

  render() {
    return (
      <div>
        <canvas
          ref={this.canvas}
          style={{
            border: '1px solid red',
            maxWidth: '100%',
            margin: '0 auto',
          }}
        />
      </div>
    )
  }
};

export default Canvas
