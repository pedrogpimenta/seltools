import React from 'react'
import Draggable from 'react-draggable'
import { connect } from 'react-redux'
import { store } from '../../store/store'
import { findDOMNode } from 'react-dom'
import Editor from '../Editor/Editor'

class Marker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false,
      parentInfo: null,
      thisInfo: null,
    }

    this.draggable = React.createRef()
    this.contentEditable = React.createRef()
  }

  editMarker(e) {
    e.stopPropagation()
  }

  handleChange = (e) => {
    console.log('id: ', e.parentNode.parentNode.classList[1])
    store.dispatch({
      type: "EDIT_MARKER",
      fileId: this.props.fileId,
      id: e.parentNode.parentNode.classList[1],
      content: e.innerHTML,
    }) 

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  handleDelete = () => {
    store.dispatch({
      type: "DELETE_MARKER",
      fileId: this.props.fileId,
      id: this.props.id,
    }) 

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
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

  // onEditorChange = (e) => {
  //   console.log('editor:', e)
  // }

  componentDidMount = () => {
    // if (this.props.editing === this.props.id) {
    //   // TODO: WHY setTimout, WHY?
    //   setTimeout(() => {
    //     let range, selection
        
    //     if (document.body.createTextRange) {
    //       range = document.body.createTextRange()
    //       range.moveToElementText(this.contentEditable.current)
    //       range.select()
    //     } else if (window.getSelection) {
    //       selection = window.getSelection()
    //       range = document.createRange()
    //       range.selectNodeContents(this.contentEditable.current)
    //       selection.removeAllRanges()
    //       selection.addRange(range)
    //     }
    //   }, 1)

    //   this.props.setNotEditing()
    // }

    const parentInfo = findDOMNode(this.draggable.current).closest('.markers')
    const thisInfo = findDOMNode(this.draggable.current)
    this.setState({
      parentInfo: parentInfo,
      thisInfo: thisInfo,
    })
  }

  render() {
    let x = 0
    let y = 0

    if (!!this.state.parentInfo) {
      const width = this.state.parentInfo.getBoundingClientRect().width
      const height = this.state.parentInfo.getBoundingClientRect().height

      x = (this.props.x * width) / 100
      y = (this.props.y * height) / 100
    }

    return (
      <Draggable
        ref={this.draggable}
        // bounds='parent'
        handle='.handle'
        position={{x: x, y: y - (this.state.thisInfo?.getBoundingClientRect().height / 2)}}
        onDrag={(e) => this.reportDragging(e)}
        onStop={(e) => this.props.editMarkerPosition(e, this.props.id)}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <div
          className={`marker ${this.props.id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            position: 'absolute',
            padding: '4px 6px 4px 4px',
            borderRadius: '40px',
            background: '#DDD',
            boxSizing: 'border-box',
            zIndex: '1',
            userSelect: 'none',
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
              cursor: this.props.dragging ? 'grabbing' : 'grab',
            }}
          >
            <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd" stroke="#2a2e3b" strokeLinecap="round" strokeLinejoin="round"><circle cx="10.5" cy="10.5" r="3" fill="black" /></g></svg>
          </div>
          <Editor
            content={this.props.content}
            // innerRef={this.contentEditable}
            parentId={this.props.id}
            onEditorChange={(e) => {this.handleChange(e)}}
          />
          {/* <ContentEditable
            innerRef={this.contentEditable}
            html={this.props.content}
            disabled={false}
            onChange={(e) => this.handleChange(e)}
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            style={{
              background: '#DDD',
              paddingRight: '2px',
              outline: 'none',
            }}
          /> */}
          <div
            className='delete'
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              position: 'absolute',
              left: this.state.hover ? 'calc(100% - 26px)' : 'calc(100% - 44px)',
              top: '0',
              fontSize: 0,
              padding: '0 4px 0 28px',
              height: '100%',
              background: '#DDD',
              borderRadius: '40px',
              zIndex: '-1',
              opacity: this.state.hover ? '1' : '0',
              transition: 'all 100ms ease-out',
            }}
            onClick={this.handleDelete}
          >
            <svg height="20" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd" stroke="#2a2e3b" strokeLinecap="round" strokeLinejoin="round" transform="translate(2 2)"><circle cx="8.5" cy="8.5" r="8"/><g transform="matrix(0 1 -1 0 17 0)"><path d="m5.5 11.5 6-6"/><path d="m5.5 5.5 6 6"/></g></g></svg>
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