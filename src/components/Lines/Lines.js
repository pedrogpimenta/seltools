import React from 'react'
import { store } from '../../store/store'
import {
  Icon,
} from "@blueprintjs/core"

import { Stage, Layer, Arrow, Rect, Text, Circle, Transformer } from 'react-konva';
import Line from '../Line/Line'

class Lines extends React.Component {
  constructor() {
    super()

    this.state = {
      canvasWidth: 0,
      canvasHeight: 0,
      startCoords: null,
      endCoords: null,
      isDrawing: false,
      // fakeLines: [],
      canvasCursor: 'default',
      // lineColor: 'black',
    }

    this.linesRef = React.createRef();
  }

  handleStageMouseDown = (e) => {
    if (e.target && typeof e.target.getPointerPosition !== 'undefined') {
      this.setState({
        isDrawing: true,
        startCoords: e.target.getPointerPosition(),
      })
    }
  }

  handleStageMouseMove = (e) => {
    if (e.target && typeof e.target.getPointerPosition !== 'undefined') {
      this.setState({
        endCoords: e.target.getPointerPosition(),
      })
    }
  }

  handleStageMouseUp = () => {
    // if (!this.state.isDrawing) return
    
    this.setState({
      isDrawing: false,
    })

    if (!this.state.endCoords || !this.state.startCoords) return

    if (this.state.endCoords.x === this.state.startCoords.x) {
      this.setState({
        startCoords: null,
        endCoords: null,
      })

      return 
    }

    // const newLines = this.state.fakeLines
    const newPoints = [
      0,
      0,
      this.state.endCoords.x - this.state.startCoords.x,
      this.state.endCoords.y - this.state.startCoords.y,
    ]

    store.dispatch(
      {
        type: 'ADD_NEW_LINE',
        fileId: this.props.fileId,
        id: `lines-${Math.floor((Math.random() * 100000) + 1)}`,
        x: this.state.startCoords.x,
        y: this.state.startCoords.y,
        points: newPoints,
      }
    )

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 

    this.setState({
      startCoords: null,
      endCoords: null,
      // fakeLines: newLines,
    })
  }

  handleLineCursorOver = () => {
    this.setState({
      canvasCursor: 'not-allowed',
    })
  }

  handleLineCursorOut = () => {
    this.setState({
      canvasCursor: 'default',
    })
  }

  componentDidMount = () => {
    window.setTimeout(() => {
      this.setState({
        canvasWidth: this.linesRef.current.getBoundingClientRect().width,
        canvasHeight: this.linesRef.current.getBoundingClientRect().height,
      })
    }, 1000)
  }

  render() {
    return (
      <div
        ref={this.linesRef}
        className='lines'
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          zIndex: this.props.isActive ? '5' : '2',
        }}
      >
        <Stage
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
          onMouseDown={this.handleStageMouseDown}
          onMouseMove={this.handleStageMouseMove}
          onMouseUp={this.handleStageMouseUp}
          style={{
            cursor: this.state.canvasCursor,
          }}
        >
          <Layer>
            {this.props.lines.map((line) => {
              return (
                <>
                  <Line
                    line={line}
                    fileId={this.props.fileId}
                    handleLineCursorOver={this.handleLineCursorOver}
                    handleLineCursorOut={this.handleLineCursorOut}
                    isDrawing={this.state.isDrawing}
                  />
                </>
              )
            })}
            {this.state.isDrawing && !!this.state.endCoords &&
              <Line
                line={{
                  key: 'temp-line',
                  x: this.state.startCoords.x,
                  y: this.state.startCoords.y,
                  points: [0, 0, this.state.endCoords.x - this.state.startCoords.x, this.state.endCoords.y - this.state.startCoords.y],
                }}
              />
            }
          </Layer>
        </Stage>
        {/* <canvas 
          ref={this.linesRef}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            // marginTop: '34px',
            zIndex: this.props.isActive ? '5' : '2',
          }}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.onMouseMove}
        >
        </canvas> */}
      </div>
    )
  }
}


export default Lines