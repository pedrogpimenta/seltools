import React from 'react';
import Marker from '../Marker/Marker'
import { connect } from 'react-redux'
import { store } from '../../store/store'
import { findDOMNode } from 'react-dom';

class Markers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      editing: null,
      width: 0,
      height: 0,
    }

    this.markersRef = React.createRef();
    this.getMarkersWidth = this.getMarkersWidth.bind(this)
  }

  getMarkerCoords = (x, y) => {
    
  }

  addNewMarker = e => {
    const c = this.markersRef.current
    const markersInfo = c.getBoundingClientRect()
    const newId = Math.floor((Math.random() * 100000) + 1)
    const xPercent = ((e.clientX - markersInfo.x - window.pageXOffset) * 100) / markersInfo.width
    const yPercent = ((e.clientY - markersInfo.y - window.pageYOffset) * 100) / markersInfo.height


    this.setState({editing: newId})

    store.dispatch({
      type: "ADD_MARKER",
      file: this.props.file,
      id: newId,
      x: xPercent,
      y: yPercent,
    }) 
  }

  setNotEditing = (e) => {
    this.setState({editing: null})
  }

  editMarkerPosition = (e, markerId) => {
    const c = this.markersRef.current
    const markersInfo = c.getBoundingClientRect()

    const targetEl = findDOMNode(e.target)
    const parent = targetEl.closest('.react-draggable').getBoundingClientRect()
    // const parent = targetEl.parentNode.toString().indexOf('svg') > 0 ? targetEl.parentNode.parentNode : targetEl.parentNode.parentNode

    // debugger;
    // const targetEl = findDOMNode(e.target).closest('react-draggable')

    console.log(parent)
    console.log(markersInfo.x)

    const thisX = parent.x
    const thisY = parent.y + (parent.height / 2)

    // const xPercent = (e.clientX - markersInfo.x - window.pageXOffset)
    // const yPercent = (e.clientY - markersInfo.y - window.pageYOffset)
    // console.log('e:', e.x, e.y)
    const xPercent = ((thisX - markersInfo.x - window.pageXOffset) * 100) / markersInfo.width
    const yPercent = ((thisY - markersInfo.y - window.pageYOffset) * 100) / markersInfo.height

    // console.log('xPercent:', xPercent)
    // console.log('yPercent:', yPercent)

    store.dispatch({
      type: "EDIT_MARKER",
      file: this.props.file,
      id: markerId,
      x: xPercent,
      y: yPercent,
    }) 

    store.dispatch({
      type: "NOT_DRAGGING",
    }) 
  }

  getMarkersWidth = () => {
    const c = this.markersRef.current
    return c.getBoundingClientRect().width
  }

  componentDidMount = () => {
    // this.setState({
    //   width: this.markersRef.current.offsetWidth,
    //   height: this.markersRef.current.offsetHeight,
    // })
    window.setTimeout(() => {
      // console.log(this.state.width)
      this.setState({
        width: this.markersRef.current.offsetWidth,
        height: this.markersRef.current.offsetHeight,
      })
    }, 100)
  }

  render() {
    return (
      <div
      id='ola'
        ref={this.markersRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: this.props.dragging ? 'grabbing' : 'default',
        }}
        onDoubleClick={(e) => this.addNewMarker(e)}
      >
        {this.state.width > 0 && this.props.markers.map((marker) => {
          // const markerX = marker.x
          // const markerY = marker.y
          const markerX = parseInt((marker.x * this.state.width) / 100)
          const markerY = parseInt((marker.y * this.state.height) / 100)
          // console.log('marker.x:', marker.x)
          // console.log('marker.y:', marker.y)
          // console.log('this.state.width:', this.state.width)
          // console.log('markerX:', markerX)
          // console.log('markerY:', markerY)

          return(
            <Marker
              key={marker.id}
              file={this.props.file}
              id={marker.id}
              x={markerX}
              y={markerY}
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