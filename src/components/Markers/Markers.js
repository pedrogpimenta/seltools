import React from 'react';
import Marker from '../Marker/Marker'
import { connect } from 'react-redux'
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
    // const c = this.markersRef.current
    // const markersInfo = c.getBoundingClientRect()
    // debugger;
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
    }) 

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  editMarkerPosition = (e, markerId) => {
    debugger;
    const c = this.markersRef.current
    const markersInfo = c.getBoundingClientRect()
    // const targetEl = findDOMNode(e.target)
    // const parent = targetEl.closest('.react-draggable').getBoundingClientRect()
    // const thisX = parent.x
    // const thisY = parent.y + (parent.height / 2)
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
    // console.log()

    if (!this.props.markerDragId) return false

    const c = this.markersRef.current
    const markersInfo = c.getBoundingClientRect()

    const markerX = e.clientX - markersInfo.x
    const markerY = e.clientY - markersInfo.y
    const markerWidth = markersInfo.width
    const markerHeight = markersInfo.height
    
    const xPercent = ((markerX) * 100) / markerWidth
    const yPercent = ((markerY) * 100) / markerHeight

    // debugger;
    this.props.dispatch({
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

    // console.log('moving:', this.props.markerDragId, 'with x:', xPercent, 'with y:', yPercent)
  }

  componentDidMount = () => {
    // TODO: Fix timeout: check if all images have loaded and then set
    window.setTimeout(() => {
      // debugger;

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

    // console.log('current:', this.markersRef.current)
    // console.log( 'render marker inside markers 2')
  }

  render() {
    return (
      <div
        ref={this.markersRef}
        className='markers'
        style={{
          position: 'absolute',
          // display: 'flex',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          // minHeight: '1000px',
          // marginTop: '34px',
          cursor: this.props.dragging ? 'grabbing' : 'default',
          zIndex: this.props.isActive ? '5' : '1',
          background: 'blue',
        }}
        onDoubleClick={(e) => this.addNewMarker(e)}
        onMouseMove={(e) => {this.handleMouseMove(e)}}
        onMouseUp={(e) => {this.handleMouseUp(e)}}
      >
        <span>aa</span>
        {this.state.width > 0 && this.props.markers && this.props.markers.map((marker) => {
          // const c = this.markersRef.current
          // const markersInfo = c.getBoundingClientRect() 
          // const width = markersInfo.width
          // const height = markersInfo.height
          
          // const x = (marker.x * width) / 100
          // const y = (marker.y * height) / 100
          // console.log( 'render marker inside markers 1')
          
          return(
            <div>
              <span>bb</span>
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

function mapStateToProps(state) {
  return {
    dragging: state.markerDragId,
    markerDragId: state.markerDragId,
  }
}

export default connect(mapStateToProps)(Markers)