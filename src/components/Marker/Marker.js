import React from 'react';

class Marker extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.markersRef = React.createRef();
  // }

  // componentDidMount() {
  //   const c = this.markerRef.current;

  //   this.setState({
  //     y: c.getBoundingClientRect().y,
  //     x: c.getBoundingClientRect().x,
  //   })
  // }

  editMarker(e) {
    // const { pageX, pageY } = e

    // this.props.dispatch({
    //   type: "SET_MARKER_COORDS",
    //   x: pageX - this.state.x,
    //   y: pageY - this.state.y,
    // }) 

    // console.log(pageX, pageY)
    e.stopPropagation()
  }

  render() {
    return (
      <div
        // ref={this.markerRef}
        style={{
          position: 'absolute',
          top: this.props.y,
          left: this.props.x,
        }}
        onClick={(e) => this.editMarker(e)}
      >
        <div contenteditable='true'>{this.props.content}</div>
      </div>
    )
  }
};

export default Marker
