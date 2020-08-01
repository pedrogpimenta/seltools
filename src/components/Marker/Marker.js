import React from 'react'
import ContentEditable from 'react-contenteditable'
import { connect } from 'react-redux'

class Marker extends React.Component {
  constructor(props) {
    super(props);

    this.contentEditable = React.createRef()
    this.state = {
      html: "<b>Hello <i>World</i></b>"
    }
  }

  componentDidMount() {
    // this.contentEditable.current.focus()
  }

  editMarker(e) {
    e.stopPropagation()
  }

  handleChange = e => {
    this.props.dispatch({
      type: "EDIT_MARKER",
      file: this.props.file,
      id: this.props.id,
      content: e.target.value,
    }) 
  }

  render() {
    return (
      <div
        style={{
          position: 'absolute',
          top: this.props.y,
          left: this.props.x,
        }}
        onClick={(e) => this.editMarker(e)}
      >
        <ContentEditable
          innerRef={this.contentEditable}
          html={this.props.content}
          disabled={false}
          onChange={this.handleChange}
        />
      </div>
    )
  }
};

function mapStateToProps(ownProps) {
  return {
    ...ownProps,
  }
}

export default connect(mapStateToProps)(Marker)
// export default Marker
