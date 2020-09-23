import React from 'react'
import Draggable from 'react-draggable'
import { connect } from 'react-redux'
import { store } from '../../store/store'
import { findDOMNode } from 'react-dom'
import {
  Icon,
} from "@blueprintjs/core"

class Highlights extends React.Component {
  constructor() {
    super()

    this.state = {
      mouseDownX: 0,
      mouseDownY: 0,
      mouseUpX: 0,
      mouseUpY: 0,
    }

    this.highlightsRef = React.createRef();
  }

  handleDelete = () => {
    store.dispatch({
      type: "DELETE_MARKER",
      fileId: this.props.fileId,
      id: this.props.id,
    }) 

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  handleMouseDown = (e) => {
    console.log('mouse down:, x:', e.clientX, 'y:', e.clientY)
    this.setState({
      mouseDownX: e.clientX,
      mouseDownY: e.clientY,
    })
  }

  handleMouseUp = (e) => {
    // console.log('mouse up:, x:', e.clientX, 'y:', e.clientY)
    // this.setState({
    //   mouseUpX: e.clientX,
    //   mouseUpY: e.clientY,
    // })

    const c = this.highlightsRef.current
    const fileInfo = c.getBoundingClientRect()
    // debugger;
    const xPercentStart = ((this.state.mouseDownX - fileInfo.x) * 100) / fileInfo.width
    const yPercentStart = ((this.state.mouseDownY - fileInfo.y) * 100) / fileInfo.height
    const xPercentEnd = ((e.clientX - fileInfo.x) * 100) / fileInfo.width
    const yPercentEnd = ((e.clientY - fileInfo.y) * 100) / fileInfo.height

    if ((e.clientX > this.state.mouseDownX) && (e.clientY > this.state.mouseDownY)) {
      console.log('yeah')
      this.handleNewHighlight(xPercentStart, yPercentStart, xPercentEnd, yPercentEnd)
    }
  }

  handleNewHighlight = (xPercentStart, yPercentStart, xPercentEnd, yPercentEnd) => {
    const width = xPercentEnd - xPercentStart
    const height = yPercentEnd - yPercentStart

    store.dispatch(
      {
        type: 'ADD_NEW_HIGHLIGHT',
        fileId: this.props.fileId,
        id: `highlight-${Math.floor((Math.random() * 100000) + 1)}`,
        xPercent: xPercentStart,
        yPercent: yPercentStart,
        width: width,
        height: height,
      }
    )

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  componentDidMount = () => {
    const c = this.highlightsRef.current
    const fileInfo = c.getBoundingClientRect()
    // debugger;
  }

  render() {
    return (
      <div
        ref={this.highlightsRef}
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
        }}
        onMouseDown={(e) => this.handleMouseDown(e)}
        onMouseUp={(e) => this.handleMouseUp(e)}
      >
        {this.props.highlights.map(highlight => {
          const c = this.highlightsRef.current
          const fileInfo = c.getBoundingClientRect()
          // debugger;
          const width = c.getBoundingClientRect().width
          const height = c.getBoundingClientRect().height

          const highlightX = (highlight.xPercent * width) / 100
          const highlightY = (highlight.yPercent * height) / 100
          const highlightWidth = (highlight.width * width) / 100
          const highlightHeight = (highlight.height * height) / 100

          return (
            <div
              key={highlight.id}
              style={{
                position: 'absolute',
                top: `${highlightY}px`,
                left: `${highlightX}px`,
                width: `${highlightWidth}px`,
                height: `${highlightHeight}px`,
                background: 'var(--c-highlight)',
                opacity: '.7',
              }}
            ></div>
          )
        })}
      </div>
    )
  }
}


export default Highlights