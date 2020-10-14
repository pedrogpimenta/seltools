import React from 'react';
import Marker from '../Marker/Marker'
// import { connect } from 'react-redux'
import { store } from '../../store/store'
// import { findDOMNode } from 'react-dom'

class Markers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }

    this.markersRef = React.createRef();
  }

  addNewMarker = (e) => {
    const newId = Math.floor((Math.random() * 100000) + 1)
    const xPercent = ((e.clientX - this.state.x) * 100) / this.state.width
    const yPercent = ((e.clientY - this.state.y) * 100) / this.state.height

    store.dispatch({
      type: "ADD_MARKER",
      fileId: this.props.fileId,
      id: newId,
      x: xPercent,
      y: yPercent,
      background: 'white',
      draggingMarkerId: null,
      draggingMarkerX: 0,
      draggingMarkerY: 0, 
    }) 

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  editMarkerPosition = (e, markerId) => {
    debugger;
    const c = this.markersRef.current
    const markersInfo = c.getBoundingClientRect()
    const thisX = e.offsetX
    const thisY = e.offsetY
    const xPercent = ((thisX - markersInfo.x) * 100) / markersInfo.width
    const yPercent = ((thisY - markersInfo.y) * 100) / markersInfo.height

    store.dispatch({
      type: "EDIT_MARKER",
      fileId: this.props.fileId,
      id: markerId,
      x: xPercent,
      y: yPercent,
    }) 

    store.dispatch({
      type: "NOT_DRAGGING",
    }) 

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  handleMouseUp = (e) => {
    store.dispatch({
      type: "NOT_DRAGGING",
      markerId: null,
    }) 
  }

  handleMouseMove = (e) => {
    if (!this.props.markerDragId) return false

    const c = this.markersRef.current
    const markersInfo = c.getBoundingClientRect()

    const markerX = e.clientX - markersInfo.x
    const markerY = e.clientY - markersInfo.y
    const markerWidth = markersInfo.width
    const markerHeight = markersInfo.height
    
    const xPercent = ((markerX) * 100) / markerWidth
    const yPercent = ((markerY) * 100) / markerHeight

    store.dispatch({
      type: "EDIT_MARKER",
      fileId: this.props.fileId,
      id: this.props.markerDragId,
      x: xPercent,
      y: yPercent,
    })

    this.setState({
      draggingMarkerId: this.props.markerDragId,
      draggingMarkerX: xPercent,
      draggingMarkerY: yPercent,
    })
  }

  componentDidMount = () => {
    window.setTimeout(() => {
      const thisMarker = this.markersRef.current.getBoundingClientRect()
      const markersX = thisMarker.x
      const markersY = thisMarker.y
      const markersWidth = thisMarker.width
      const markersHeight = thisMarker.height

      this.setState({
        x: markersX,
        y: markersY,
        width: markersWidth,
        height: markersHeight,
      })
    }, 1000)
  }

  render() {
    return (
      <div
        ref={this.markersRef}
        className='markers'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: this.props.dragging ? 'grabbing' : 'default',
          zIndex: this.props.isActive ? '5' : '1',
          background: 'blue',
        }}
        onDoubleClick={(e) => this.addNewMarker(e)}
        onMouseMove={(e) => {this.handleMouseMove(e)}}
        onMouseUp={(e) => {this.handleMouseUp(e)}}
      >
        <span>aa</span>
        {this.props.markers && this.props.markers.map((marker) => {
          return(
            <div
              key={`${marker.id}-wrapper`}
            >
              <span>oo</span>
              <Marker
                key={marker.id}
                fileId={this.props.fileId}
                hasRendered={this.props.hasRendered}
                id={marker.id}
                x={this.state.draggingMarkerId === marker.id ? this.state.draggingMarkerX : marker.x}
                y={this.state.draggingMarkerId === marker.id ? this.state.draggingMarkerY : marker.y}
                content={marker.content}
                background={marker.background}
                editMarkerPosition={(e, markerId) => this.editMarkerPosition(e, markerId)}
                isStudent={this.props.isStudent}
                hasFocus={marker.hasFocus}
              />
            </div>
          )
        })}
      </div>
    )
  }
}

export default Markers
