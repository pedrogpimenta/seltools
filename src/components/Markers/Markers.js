import React from 'react';
import Marker from '../Marker/Marker'
import { store } from '../../store/store'
import { findDOMNode } from 'react-dom'

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

  addNewMarker = e => {
    const c = this.markersRef.current
    const markersInfo = c.getBoundingClientRect()
    const newId = Math.floor((Math.random() * 100000) + 1)
    const xPercent = ((e.clientX - markersInfo.x) * 100) / markersInfo.width
    const yPercent = ((e.clientY - markersInfo.y) * 100) / markersInfo.height

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
    const c = this.markersRef.current
    const markersInfo = c.getBoundingClientRect()
    const targetEl = findDOMNode(e.target)
    const parent = targetEl.closest('.react-draggable').getBoundingClientRect()
    const thisX = parent.x
    const thisY = parent.y + (parent.height / 2)
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

  componentDidMount = () => {
    // TODO: Fix timeout: check if all images have loaded and then set
    window.setTimeout(() => {
      this.setState({
        width: this.markersRef.current.offsetWidth,
        height: this.markersRef.current.offsetHeight,
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
          display: 'flex',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          // minHeight: '1000px',
          // marginTop: '34px',
          cursor: this.props.dragging ? 'grabbing' : 'default',
          zIndex: this.props.isActive ? '5' : '1',
        }}
        onDoubleClick={(e) => this.addNewMarker(e)}
      >
        {this.state.width > 0 && this.props.markers.map((marker) => {
          return(
            <Marker
              key={marker.id}
              fileId={this.props.fileId}
              hasRendered={this.props.hasRendered}
              id={marker.id}
              x={marker.x}
              y={marker.y}
              content={marker.content}
              background={marker.background}
              editMarkerPosition={(e, markerId) => this.editMarkerPosition(e, markerId)}
              isStudent={this.props.isStudent}
              hasFocus={marker.hasFocus}
            />
          )
        })}
      </div>
    )
  }
}

export default Markers