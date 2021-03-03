import React from 'react'
import { store } from '../../store/store'
import {
  Icon,
} from "@blueprintjs/core"


import { Line } from 'react-konva';


class Lines extends React.Component {
  constructor() {
    super()

    this.state = {
      lineColor: 'black',
      isTempLine: false,
    }

  }

  handleLineMouseOver = () => {
    this.setState({
      lineColor: '#f44336',
    })

    if (!this.props.isTempLine) this.props.handleLineCursorOver()
  }

  handleLineMouseOut = () => {
    this.setState({
      lineColor: 'black',
    })

    if (!this.props.isTempLine) this.props.handleLineCursorOut()
  }
  
  handleLineMouseUp = () => {
    console.log('ola')

    if (this.props.isDrawing) return

    store.dispatch(
      {
        type: 'DELETE_LINE',
        fileId: this.props.fileId,
        id: this.props.line.id,
      }
    )

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
    
    this.setState({
      lineColor: 'black',
    })

    if (!this.props.isTempLine) this.props.handleLineCursorOut()
  }

  componentDidMount = () => {
    this.setState({
      isTempLine: !(typeof this.props.handleLineCursorOver !== 'undefined'),
    })
  }

  render() {
    return (
      <Line
        key={this.props.line.id}
        x={this.props.line.x}
        y={this.props.line.y}
        points={this.props.line.points}
        stroke={this.state.isTempLine ? 'black' : this.state.lineColor}
        strokeWidth={2}
        hitStrokeWidth={this.state.isTempLine ? 0 : 30}
        onMouseOver={this.handleLineMouseOver}
        onMouseOut={this.handleLineMouseOut}
        onMouseUp={this.handleLineMouseUp}
        style={{
          opacity: '.1',
        }}
      />
    )
  }
}


export default Lines