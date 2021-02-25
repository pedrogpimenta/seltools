import React from 'react';
import Marker from '../Marker/Marker'
import { store } from '../../store/store'

class Markers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
    }

    this.markersRef = React.createRef();
  }

  addNewMarker = (e) => {
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

  editMarkerPosition = (e, markerId, dragEl) => {
    const c = this.markersRef.current
    const markersInfo = c.getBoundingClientRect()

    const positioner = dragEl.current.getBoundingClientRect()

    const thisX = positioner.x - markersInfo.x 
    const thisY = positioner.y - markersInfo.y

    const xPercent = ((thisX) * 100) / markersInfo.width
    const yPercent = ((thisY) * 100) / markersInfo.height

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
      if (!this.markersRef.current) return

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
          top: '0',
          left: '-150px',
          width: 'calc(100% + 300px)',
          height: '100%',
          cursor: this.props.dragging ? 'grabbing' : 'default',
          zIndex: this.props.isActive ? '5' : '3',
        }}
        onDoubleClick={(e) => {!this.props.isLocked && this.addNewMarker(e)}}
      >
        {this.props.isLocked &&
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: '100',
            }}
            onClick={this.props.handleClickWhenLocked}
          >
          </div>
        }
        {this.state.width > 0 && this.props.markers && this.props.markers.map((marker) => {
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
              editMarkerPosition={(e, markerId, dragEl) => this.editMarkerPosition(e, markerId, dragEl)}
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