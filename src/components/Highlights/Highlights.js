import React from 'react'
import { store } from '../../store/store'
import {
  Icon,
} from "@blueprintjs/core"

class Highlights extends React.Component {
  constructor() {
    super()

    this.state = {
      mouseDown: false,
      mouseDownX: 0,
      mouseDownY: 0,
      mouseUpX: 0,
      mouseUpY: 0,
      ghostX: 0,
      ghostY: 0,
      ghostWidth: 0,
      ghostHeight: 0,
      componentIsReady: false,
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
    this.setState({
      mouseDown: true,
      mouseDownX: e.clientX,
      mouseDownY: e.clientY,
    })
  }

  // handleMouseEnter = (e) => {
  //   this.setState({mouseInside: true})
  // }

  // handleMouseLeave = (e) => {
  //   this.setState({mouseInside: false})
  // }

  handleMouseMove = (e) => {
    if (this.state.mouseDown) {
      const c = this.highlightsRef.current
      const fileInfo = c.getBoundingClientRect()

      let width = (e.clientX - fileInfo.x) - (this.state.mouseDownX - fileInfo.x)
      let height = (e.clientY - fileInfo.y) - (this.state.mouseDownY - fileInfo.y)
      let thisXPercent = this.state.mouseDownX - fileInfo.x
      let thisYPercent = this.state.mouseDownY - fileInfo.y

      if (width < 0) {
        thisXPercent = this.state.mouseDownX - fileInfo.x + width
        width = Math.abs(width)
      }

      if (height < 0) {
        thisYPercent = this.state.mouseDownY - fileInfo.y + height
        height = Math.abs(height)
      }

      this.setState({
        ghostX: thisXPercent,
        ghostY: thisYPercent,
        ghostWidth: width,
        ghostHeight: height,
      })
    }
  }

  handleMouseUp = (e) => {
    this.setState({
      mouseDown: false,
      ghostX: 0,
      ghostY: 0,
      ghostWidth: 0,
      ghostHeight: 0,
    })

    const c = this.highlightsRef.current
    const fileInfo = c.getBoundingClientRect()
    const xPercentStart = ((this.state.mouseDownX - fileInfo.x) * 100) / fileInfo.width
    const yPercentStart = ((this.state.mouseDownY - fileInfo.y) * 100) / fileInfo.height
    const xPercentEnd = ((e.clientX - fileInfo.x) * 100) / fileInfo.width
    const yPercentEnd = ((e.clientY - fileInfo.y) * 100) / fileInfo.height

    if (((e.clientX > this.state.mouseDownX + 5) && (e.clientY > this.state.mouseDownY + 5)) || ((e.clientX < this.state.mouseDownX - 5) && (e.clientY < this.state.mouseDownY - 5))) {
      this.handleNewHighlight(xPercentStart, yPercentStart, xPercentEnd, yPercentEnd)
    }
  }

  handleNewHighlight = (xPercentStart, yPercentStart, xPercentEnd, yPercentEnd) => {
    let width = xPercentEnd - xPercentStart
    let height = yPercentEnd - yPercentStart

    let thisXPercent = xPercentStart
    let thisYPercent = yPercentStart

    if (width < 0) {
      thisXPercent = xPercentStart + width
      width = Math.abs(width)
    }

    if (height < 0) {
      thisYPercent = yPercentStart + height
      height = Math.abs(height)
    }

    store.dispatch(
      {
        type: 'ADD_NEW_HIGHLIGHT',
        fileId: this.props.fileId,
        id: `highlight-${Math.floor((Math.random() * 100000) + 1)}`,
        xPercent: thisXPercent,
        yPercent: thisYPercent,
        width: width,
        height: height,
      }
    )

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  deleteHighlight = (highlight) => {
    store.dispatch(
      {
        type: 'DELETE_HIGHLIGHT',
        fileId: this.props.fileId,
        id: highlight,
      }
    )

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  componentDidMount = () => {
    window.setTimeout(() => {
      this.setState({
        componentIsReady: true,
      })
    }, 1000)
  }

  render() {
    return (
      <div
        ref={this.highlightsRef}
        className='highlights'
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          zIndex: this.props.isActive ? '5' : '1',
        }}
        onMouseMove={(e) => this.handleMouseMove(e)}
        // onMouseEnter={(e) => this.handleMouseEnter(e)}
        // onMouseLeave={(e) => this.handleMouseLeave(e)}
        onMouseDown={(e) => this.handleMouseDown(e)}
        onMouseUp={(e) => this.handleMouseUp(e)}
      >
        <div
          key='ghost-highlight'
          className='ghost-highlight'
          style={{
            position: 'absolute',
            display: !!this.state.ghostWidth ? 'block' : 'none',
            top: `${this.state.ghostY}px`,
            left: `${this.state.ghostX}px`,
            width: `${this.state.ghostWidth}px`,
            height: `${this.state.ghostHeight}px`,
            background: 'yellow',
          }}
        ></div>
        {this.state.componentIsReady && this.props.highlights.map(highlight => {
          const c = this.highlightsRef.current
          const width = c.getBoundingClientRect().width
          const height = c.getBoundingClientRect().height

          const highlightX = (highlight.xPercent * width) / 100
          const highlightY = (highlight.yPercent * height) / 100
          const highlightWidth = (highlight.width * width) / 100
          const highlightHeight = (highlight.height * height) / 100


          return (
            <div
              key={highlight.id}
              className='highlight'
              style={{
                position: 'absolute',
                top: `${highlightY}px`,
                left: `${highlightX}px`,
                width: `${highlightWidth}px`,
                height: `${highlightHeight}px`,
                background: 'yellow',
              }}
            >
              <div
                className='delete'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: '-8px',
                  left: 'calc(100% - 8px)',
                  width: '17px',
                  height: '17px',
                  opacity: '0',
                  backgroundColor: 'var(--c-primary-dark)',
                  borderRadius: '9px',
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 2px 8px 0px',
                  transition: 'all 100ms ease-out',
                  cursor: 'pointer',
                }}
                onClick={() => this.deleteHighlight(highlight.id)}
              >
                <Icon icon='delete' iconSize={12} color='white' />
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}


export default Highlights