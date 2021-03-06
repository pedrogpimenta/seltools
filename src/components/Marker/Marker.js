import React from 'react'
import Draggable from 'react-draggable'
import { connect } from 'react-redux'
import { store } from '../../store/store'
import { findDOMNode } from 'react-dom'
import ReactQuill, {Quill} from 'react-quill'
import 'react-quill/dist/quill.bubble.css'

import {
  Icon,
} from "@blueprintjs/core"

import {
  RiCloseCircleLine,
  RiDragMove2Fill,
} from 'react-icons/ri'

import UserIcon from '../UserIcon/UserIcon'

var FontAttributor = Quill.import('attributors/class/font');

FontAttributor.whitelist = [
  'opensans', 'comfortaa', 'lobster', 'amatic',
];
Quill.register(FontAttributor, true);

let Inline = Quill.import('blots/inline');

class MarkBlot extends Inline { } 
MarkBlot.blotName = 'mark'
MarkBlot.tagName = 'mark'
MarkBlot.className = 'highlight'
Quill.register(MarkBlot)

class DelBlot extends Inline { } 
DelBlot.blotName = 'del'
DelBlot.tagName = 'del'
DelBlot.className = 'striker'
Quill.register(DelBlot)

export class TagBlot extends Inline {
  static blotName = 'tag';
  static className = 'redtext';
  static tagName = 'span';

  static formats() {
    return true;
  }
}
Quill.register(TagBlot)

class Marker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false,
      parentInfo: null,
      // thisInfo: null,
      hasFocus: false,
    }

    this.draggable = React.createRef()
    this.positioner = React.createRef()
    this.editableInput = React.createRef()
    // this.contentEditable = React.createRef()
  }

  editMarker(e) {
    e.stopPropagation()
  }

  handleChange = (e) => {
   store.dispatch({
      type: "EDIT_MARKER",
      fileId: this.props.fileId,
      id: this.props.id,
      content: e,
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

  handleMarkerBackground = (background) => {
    store.dispatch({
      type: "CHANGE_MARKER_BACKGROUND",
      fileId: this.props.fileId,
      id: this.props.id,
      background: background,
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

  onInputFocus = (e) => {
    this.setState({hasFocus: true})
  }

  onInputBlur = (e) => {
    this.setState({hasFocus: false})
  }

  componentDidMount = () => {
    const parentInfo = findDOMNode(this.draggable.current).closest('.markers')
    // const thisInfo = findDOMNode(this.draggable.current)
    this.setState({
      parentInfo: parentInfo,
      // thisInfo: thisInfo,
    })
    
    if (this.props.hasFocus) {
      window.setTimeout(() => {
        this.editableInput.current.focus()
      }, 1)
    }
  }

  render() {
    let x = 0
    let y = 0
    const markerShadow = 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 2px 8px 0px'

    if (!!this.state.parentInfo) {
      const width = this.state.parentInfo.getBoundingClientRect().width
      const height = this.state.parentInfo.getBoundingClientRect().height

      x = (this.props.x * width) / 100
      y = (this.props.y * height) / 100
    }

    return (
      <Draggable
        ref={this.draggable}
        handle='.handle'
        position={{x: x, y: y}}
        bounds={'parent'}
        onDrag={(e) => this.reportDragging(e)}
        onStop={(e) => this.props.editMarkerPosition(e, this.props.id, this.positioner)}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <div
          ref={this.positioner}
          style={{
            position: 'absolute',
            lineHeight: '0',
            zIndex: this.state.hasFocus ? '30' : '1',
          }}
        >
          <div
            onDoubleClick={(e) => e.stopPropagation()}
            onMouseEnter={(e) => this.handleOnMouseEnter(e)}
            onMouseLeave={(e) => this.handleOnMouseLeave(e)}
          >
            {this.props.background === 'var(--c-marker-background-teacher)' &&
              (this.props.user._id === '5f3633a4e93634d14b1df842' || this.props.user.teacherId === '5f3633a4e93634d14b1df842') &&
              <div
                style={{
                  position: 'absolute',
                  top: '-11px',
                  right: '-16px',
                  width: '30px',
                  height: '30px',
                  backgroundImage: 'url("/assets/images/selen-sm.png")',
                  backgroundSize: '30px',
                  zIndex: '-1',
                }}
              >
              </div>
            }
            {this.props.background === 'var(--c-marker-background-teacher)' &&
              !(this.props.user._id === '5f3633a4e93634d14b1df842' || this.props.user.teacherId === '5f3633a4e93634d14b1df842') &&
                <div
                  style={{
                    position: 'absolute',
                    top: '-7px',
                    right: '-11px',
                    width: '18px',
                    height: '18px',
                    zIndex: '-1',
                  }}
                >
                  <UserIcon username={this.props.user.username} />
                </div>
            }
            <div
              className='handle'
              style={{
                position: 'absolute',
                top: '-1px',
                left: '-30px',
                paddingRight: '4px',
                cursor: this.props.dragging ? 'grabbing' : 'grab',
                opacity: this.state.hover || this.state.hasFocus ? '1' : '0',
                transition: 'all 100ms ease-out',
              }}
            >
              <div
                style={{
                  background: 'white',
                  borderRadius: '40px',
                  // fontSize: '0',
                  padding: '4px',
                  width: '26px',
                  height: '26px',
                  boxShadow: markerShadow,
                }}
              >
                <RiDragMove2Fill size='1.1em' />
              </div>
            </div>
            <div
              className={`marker ${this.props.id}`}
              style={{
                position: 'relative',
                padding: '2px 5px 3px 5px',
                lineHeight: '18px',
                borderRadius: '14px',
                boxShadow: this.state.hasFocus
                  ? `0 0 0 2px var(--c-primary-dark), ${markerShadow}`
                  : markerShadow,
                background: this.props.background || 'white',
                boxSizing: 'border-box',
                zIndex: '1',
                userSelect: 'none',
                minWidth: '16px',
                minHeight: '19px',
              }}
              onClick={() => this.editableInput.current.focus()}
            >
              <ReactQuill
                ref={this.editableInput}
                theme="bubble"
                value={this.props.content}
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur}
                onChange={(e) => {this.handleChange(e)}}
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'strike', { 'color': [] }, { 'background': [] }],
                  ],
                  clipboard: {
                    matchVisual: false,
                  },
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                left: 'calc(100% + 2px)',
                top: '-3px',
                fontSize: 0,
                paddingLeft: '4px',
                opacity: this.state.hasFocus ? '1' : '0',
                pointerEvents: this.state.hasFocus ? 'all' : 'none',
                transition: 'all 100ms ease-out',
              }}
            >
              <div
                className='delete'
                style={{
                  fontSize: '1rem',
                  background: 'white',
                  borderRadius: '40px',
                  padding: '3px',
                  width: '26px',
                  height: '26px',
                  marginRight: '4px',
                  boxShadow: markerShadow,
                }}
                onClick={this.handleDelete}
              >
                <RiCloseCircleLine size='1.25em' />
              </div>
              {!this.props.isStudent &&
                <>
                  <div
                    className='markerBackground'
                    style={{
                      position: 'relative',
                      fontSize: 0,
                      background: 'white',
                      borderRadius: '40px',
                      padding: '5px',
                      width: '26px',
                      height: '26px',
                      marginRight: '4px',
                      boxShadow: markerShadow,
                    }}
                    onClick={() => this.handleMarkerBackground('var(--c-marker-background-teacher)')}
                  >
                    <Icon icon='full-circle' color="var(--c-marker-background-teacher)" />
                    <Icon icon='circle' style={{position: 'absolute', top: '5px', left: '5px'}} />
                  </div>
                  <div
                    className='markerBackground'
                    style={{
                      position: 'relative',
                      fontSize: 0,
                      background: 'white',
                      borderRadius: '40px',
                      padding: '5px',
                      width: '26px',
                      height: '26px',
                      marginRight: '4px',
                      boxShadow: markerShadow,
                    }}
                    onClick={() => this.handleMarkerBackground('white')}
                  >
                    <Icon icon='full-circle' color="white" />
                    <Icon icon='circle' style={{position: 'absolute', top: '5px', left: '5px'}} />
                  </div>
                </>
              }
            </div>
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