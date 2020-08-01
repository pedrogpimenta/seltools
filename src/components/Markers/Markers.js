import React from 'react';
import Marker from '../Marker/Marker'
import { connect } from 'react-redux'

class Markers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
    }

    this.markersRef = React.createRef();
  }

  componentDidMount() {
    // const c = this.markersRef.current;
    // console.log(c);
    // setInterval(console.log(c.getBoundingClientRect()), 1);

    // this.setState({
    //   y: c.getBoundingClientRect().y,
    //   x: c.getBoundingClientRect().x,
    // })
  }

  // updateCoords(e) {
  //   const { pageX, pageY } = e

  //   this.props.dispatch({
  //     type: "SET_MARKER_COORDS",
  //     x: pageX - this.state.x,
  //     y: pageY - this.state.y,
  //   }) 

  //   console.log(pageX, pageY)
  // }

  addNewMarker(e) {
    const c = this.markersRef.current

    this.props.dispatch({
      type: "ADD_MARKER",
      file: this.props.file,
      x: e.pageX - c.getBoundingClientRect().x,
      y: e.pageY - c.getBoundingClientRect().y,
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
        }}
        onClick={(e) => this.addNewMarker(e)}
      >
        {this.props.children}
      </div>
    )
  }
};

function mapStateToProps(ownProps) {
  return {
    ...ownProps,
  }
}

export default connect(mapStateToProps)(Markers)

// export default Markers
