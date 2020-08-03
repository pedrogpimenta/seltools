import React from 'react';
import Marker from '../Marker/Marker'
import { connect } from 'react-redux'
import { store } from '../../store/store'

class Markers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      editing: null,
    }

    this.markersRef = React.createRef();
  }

  getMarkerCoords = (x, y) => {
    
  }

  addNewMarker = e => {
    const c = this.markersRef.current
    const newId = Math.floor((Math.random() * 100000) + 1)

    this.setState({editing: newId})

    store.dispatch({
      type: "ADD_MARKER",
      file: this.props.file,
      id: newId,
      x: e.pageX - c.getBoundingClientRect().x - window.pageXOffset,
      y: e.pageY - c.getBoundingClientRect().y - window.pageYOffset - 10,
    }) 
  }

  setNotEditing = (e) => {
    this.setState({editing: null})
  }

  editMarkerPosition = (e, markerId) => {
    const c = this.markersRef.current

    store.dispatch({
      type: "EDIT_MARKER",
      file: this.props.file,
      id: markerId,
      x: e.clientX - c.getBoundingClientRect().x - window.pageXOffset,
      y: e.clientY - c.getBoundingClientRect().y - window.pageYOffset - 10,
    }) 

    store.dispatch({
      type: "NOT_DRAGGING",
    }) 
  }

  render() {
    return (
      <div
        ref={this.markersRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          // overflow: 'hidden',
          cursor: this.props.dragging ? 'grabbing' : 'default',
        }}
        onDoubleClick={(e) => this.addNewMarker(e)}
      >
        {this.props.markers.map((marker) => {
          return(
            <Marker
              key={marker.id}
              file={this.props.file}
              id={marker.id}
              x={marker.x}
              y={marker.y}
              content={marker.content}
              editMarkerPosition={(e, markerId) => this.editMarkerPosition(e, markerId)}
              setNotEditing={(e) => this.setNotEditing(e)}
              editing={this.state.editing}
            />
          )
        })}
      </div>
    )
  }
}

export default Markers