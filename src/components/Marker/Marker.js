import React from 'react'
// import Draggable from 'react-draggable'
import { connect } from 'react-redux'
import { store } from '../../store/store'
// import { findDOMNode } from 'react-dom'
import {
  Icon,
} from "@blueprintjs/core"
import Editor from '../Editor/Editor'

class Marker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false,
      parentInfo: null,
      thisInfo: null,
      hasFocus: false,
      clickOffsetX: 0,
      clickOffsetY: 0,
    }

    this.markerWrapper = React.createRef()
    this.draggable = React.createRef()
    this.contentEditable = React.createRef()
  }

  editMarker(e) {
    e.stopPropagation()
  }

  handleChange = (e) => {
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
    // store.dispatch({
    //   type: "IS_DRAGGING",
    // }) 
  }

  // onEditorChange = (e) => {
  //   console.log('editor:', e)
  // }

  // onClick = (e) => {

  // }

  // onMarkerClick = (e) => {
  //   this.setState({hasFocus: true})
  //   this.contentEditable.current.focus()
  // }

  onInputFocus = (e) => {
    this.setState({hasFocus: true})
  }

  onInputBlur = (e) => {
    this.setState({hasFocus: false})
  }

  componentDidMount = () => {
    // if (this.props.editing === this.props.id) {
      // TODO: WHY setTimout, WHY?
      // setTimeout(() => {
      //   let range, selection
        
      //   if (document.body.createTextRange) {
      //     range = document.body.createTextRange()
      //     range.moveToElementText(this.contentEditable.current)
      //     range.select()
      //   } else if (window.getSelection) {
      //     selection = window.getSelection()
      //     range = document.createRange()
      //     range.selectNodeContents(this.contentEditable.current)
      //     selection.removeAllRanges()
      //     selection.addRange(range)
      //   }
      // }, 1)

      // this.props.setNotEditing()
    // }

    console.log('1 marker mount')

    if (!!this.props.hasFocus) {
      this.contentEditable.current.focus()
    }

    // const parentInfo = findDOMNode(this.draggable.current).closest('.markers')
    // const thisInfo = findDOMNode(this.draggable.current)
    // this.setState({
    //   parentInfo: parentInfo,
    //   thisInfo: thisInfo,
    // })

    // debugger;
    // console.log('marker initial:', this.markerWrapper.current.getBoundingClientRect())
  }

  handleMarkerMove = (e) => {
    // console.log('marker move:', )
  }

  handleMouseDown = (e) => {
    // console.log('drag start')

    this.setState({
      clickOffsetX: e.clientX - this.markerWrapper.current.getBoundingClientRect().left,
      clickOffsetY: e.clientY - this.markerWrapper.current.getBoundingClientRect().top,
    })

    this.props.handleMarkerMouseDown({
        markerId: this.props.id,
        clickOffsetX: e.clientX - this.markerWrapper.current.getBoundingClientRect().left,
        clickOffsetY: e.clientY - this.markerWrapper.current.getBoundingClientRect().top,
    })
    
    // store.dispatch({
    //   type: "IS_DRAGGING",
    //   markerId: this.props.id,
    //   clickOffsetX: e.clientX - this.markerWrapper.current.getBoundingClientRect().left,
    //   clickOffsetY: e.clientY - this.markerWrapper.current.getBoundingClientRect().top,
    // }) 
  }

  handleMouseUp = (e) => {
    this.props.handleMarkerMouseUp()
  }

  // handleDragEnd = (e) => {
  //   console.log('drag end')
  //   // console.log('markerw:', this.markerWrapper.current)

  //   store.dispatch({
  //     type: "NOT_DRAGGING",
  //   }) 
  // }

  render() {
    // let x = 0
    // let y = 0
    const markerShadow = 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 2px 8px 0px'

    // if (!!this.state.parentInfo) {
    //   const width = this.state.parentInfo.getBoundingClientRect().width
    //   const height = this.state.parentInfo.getBoundingClientRect().height

    //   x = (this.props.x * width) / 100
    //   y = (this.props.y * height) / 100
    // }

    // const thisX = this.props.x - tji

    // const thisX = this.props.isDragging ? `calc(${this.props.y}% - ${this.state.clickOffsetY}px`

    return (
        <div
          ref={this.markerWrapper}
          className='marker-wrapper'
          style={{
            position: 'absolute',
            top: `${this.props.y}%`,
            left: `${this.props.x}%`,
            lineHeight: '0',
          }}
          onMouseEnter={(e) => this.handleOnMouseEnter(e)}
          onMouseLeave={(e) => this.handleOnMouseLeave(e)}
          onMouseDown={(e) => this.handleMouseDown(e)}
          onMouseUp={(e) => this.handleMouseUp(e)}
          // onDragStart={(e) => {return false}}
        >
          <div
          >
            {this.props.background === 'var(--c-marker-background-teacher)' &&
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
            <div
              className='handle'
              style={{
                position: 'absolute',
                top: '0',
                left: '-30px',
                paddingRight: '4px',
                opacity: this.state.hover ? '1' : '0',
                transition: 'all 100ms ease-out',
              }}
            >
              <div
                style={{
                  background: 'white',
                  borderRadius: '40px',
                  fontSize: '0',
                  padding: '5px',
                  width: '26px',
                  height: '26px',
                  boxShadow: markerShadow,
                }}
              >
                <Icon icon='move' />
              </div>
            </div>
            <div
              className={`marker ${this.props.id}`}
              style={{
                borderRadius: '14px',
                boxShadow: this.state.hasFocus
                  ? `0 0 0 2px var(--c-primary-dark), ${markerShadow}`
                  : markerShadow,
                background: this.props.background || 'white',
                boxSizing: 'border-box',
                zIndex: '1',
                userSelect: 'none',
              }}
            >
              <Editor
                ref={this.contentEditable}
                content={this.props.content}
                parentId={this.props.id}
                fileId={this.props.fileId}
                fileType='marker'
                onEditorChange={(e) => {this.handleChange(e)}}
                onInputFocus={(e) => {this.onInputFocus(e)}}
                onInputBlur={(e) => {this.onInputBlur(e)}}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                left: '100%',
                top: '0',
                fontSize: 0,
                paddingLeft: '4px',
                opacity: this.state.hover ? '1' : '0',
                transition: 'all 100ms ease-out',
              }}
            >
              <div
                className='delete'
                style={{
                  fontSize: 0,
                  background: 'white',
                  borderRadius: '40px',
                  padding: '5px',
                  width: '26px',
                  height: '26px',
                  marginRight: '4px',
                  boxShadow: markerShadow,
                }}
                onClick={this.handleDelete}
              >
                <Icon icon='delete' />
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
    )
  }
}

// export default Marker

function mapStateToProps(state) {
  return {
    dragging: state.dragging,
    currentZoom: state.currentZoom,
  }
}

export default connect(mapStateToProps)(Marker)