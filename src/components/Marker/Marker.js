import React from 'react'
import ContentEditable from 'react-contenteditable'
import Draggable from 'react-draggable'
import { connect } from 'react-redux'
import { store } from '../../store/store'

class Marker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false,
    }

    this.contentEditable = React.createRef()
  }

  editMarker(e) {
    e.stopPropagation()
  }

  handleChange = (e) => {
    store.dispatch({
      type: "EDIT_MARKER",
      file: this.props.file,
      id: this.props.id,
      content: e.target.value,
    }) 
  }

  handleDelete = () => {
    store.dispatch({
      type: "DELETE_MARKER",
      file: this.props.file,
      id: this.props.id,
    }) 
  }

  handleOnMouseEnter = () => {
    this.setState({
      hover: true
    })
  }

  handleOnMouseLeave = () => {
    this.setState({
      hover: false
    })
  }

  reportDragging = () => {
    store.dispatch({
      type: "IS_DRAGGING",
    }) 
  }

  componentDidMount = () => {
    if (this.props.editing === this.props.id) {
      // TODO: WHY setTimout, WHY?
      setTimeout(() => {
        let range, selection
        
        if (document.body.createTextRange) {
          range = document.body.createTextRange()
          range.moveToElementText(this.contentEditable.current)
          range.select()
        } else if (window.getSelection) {
          selection = window.getSelection()
          range = document.createRange()
          range.selectNodeContents(this.contentEditable.current)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }, 1)

      this.props.setNotEditing()
    }
  }

  render() {
    return (
      <Draggable
        bounds='parent'
        handle='.handle'
        defaultPosition={{x: this.props.x, y: this.props.y}}
        onDrag={(e) => this.reportDragging(e)}
        onStop={(e) => this.props.editMarkerPosition(e, this.props.id)}
        onDoubleClick={(e) => e.stopPropagation()}
        >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            position: 'absolute',
            padding: '2px 6px',
            borderRadius: '12px',
            background: '#DDD',
            boxSizing: 'border-box',
            zIndex: '1',
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => this.handleOnMouseEnter(e)}
          onMouseLeave={(e) => this.handleOnMouseLeave(e)}
        >
          <div
            className='handle'
            style={{
              display: 'inline-flex',
              marginRight: '4px',
              cursor: 'move',
              cursor: this.props.dragging ? 'grabbing' : 'grab',
            }}
          >
            <svg style={{transform: 'rotateZ(90deg)'}} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M5.5 3v9m4-9v9" stroke="currentColor"></path></svg>
          </div>
          <ContentEditable
            innerRef={this.contentEditable}
            html={this.props.content}
            disabled={false}
            onChange={(e) => this.handleChange(e)}
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            style={{background: '#DDD', paddingRight: '2px'}}
          />
          <div
            className='delete'
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              position: 'absolute',
              left: this.state.hover ? 'calc(100% - 18px)' : 'calc(100% - 42px)',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 0,
              padding: '0 4px 0 20px',
              height: '100%',
              background: '#DDD',
              borderRadius: '12px',
              zIndex: '-1',
              opacity: this.state.hover ? '1' : '0',
              transition: 'all 100ms ease-out',
            }}
            onClick={this.handleDelete}
          >
            <svg style={{fontSize: 0}} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M4.5 4.5l6 6m-6 0l6-6m-3 10a7 7 0 110-14 7 7 0 010 14z" stroke="currentColor"></path></svg>
          </div>
        </div>
      </Draggable>
    )
  }
};

function mapStateToProps(state) {
  return {
    dragging: state.dragging,
  }
}

export default connect(mapStateToProps)(Marker)
// export default Marker