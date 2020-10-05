import React from 'react'
import { store } from '../../store/store'
import {
  Icon,
} from "@blueprintjs/core"

import {
  STAMP_TICK,
  STAMP_CROSS,
  STAMP_STAR,
  STAMP_COOL,
  STAMP_CONFUSED,
} from '../../CONSTANTS'

class Stamps extends React.Component {
  constructor() {
    super()

    this.state = {
      mouseUpX: 0,
      mouseUpY: 0,
      componentIsReady: false,
    }

    this.stampsRef = React.createRef();
  }

  handleMouseDown = (e) => {
    this.setState({
      // mouseDown: true,
      mouseDownX: e.clientX,
      mouseDownY: e.clientY,
    })
  }

  handleClick = (e) => {
    console.log(e)
    console.log(e.currentTarget)
    this.setState({
      // mouseDown: false,
      ghostX: 0,
      ghostY: 0,
    })

    const c = this.stampsRef.current
    const fileInfo = c.getBoundingClientRect()
    const xPercentEnd = ((e.clientX - fileInfo.x) * 100) / fileInfo.width
    const yPercentEnd = ((e.clientY - fileInfo.y) * 100) / fileInfo.height

    this.handleNewStamp(xPercentEnd, yPercentEnd, this.props.editType)
  }

  handleNewStamp = (xPercentEnd, yPercentEnd, editType) => {
    store.dispatch(
      {
        type: 'ADD_NEW_STAMP',
        fileId: this.props.fileId,
        id: `stamp-${Math.floor((Math.random() * 100000) + 1)}`,
        stampType: editType,
        xPercent: xPercentEnd,
        yPercent: yPercentEnd,
      }
    )

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  deleteStamp = (e, stamp) => {
    e.stopPropagation()
     
    store.dispatch(
      {
        type: 'DELETE_STAMP',
        fileId: this.props.fileId,
        id: stamp,
      }
    )

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  componentDidMount = () => {
    window.setTimeout(() => {
      this.setState({
        componentIsReady: true,
      })
    }, 1000)
  }

  render() {
    return (
      <div
        ref={this.stampsRef}
        className='stamps'
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          zIndex: this.props.isActive ? '5' : '2',
          cursor: `url("/assets/images/stamp-${this.props.editType}.png"), auto`,
        }}
        // onMouseMove={(e) => this.handleMouseMove(e)}
        // onMouseEnter={(e) => this.handleMouseEnter(e)}
        // onMouseLeave={(e) => this.handleMouseLeave(e)}
        // onMouseDown={(e) => this.handleMouseDown(e)}
        onClick={(e) => this.handleClick(e)}
      >
        {this.state.componentIsReady && this.props.stamps.map(stamp => {
          const c = this.stampsRef.current
          const width = c.getBoundingClientRect().width
          const height = c.getBoundingClientRect().height

          const highlightX = (stamp.xPercent * width) / 100
          const highlightY = (stamp.yPercent * height) / 100

          return (
            <div
              key={stamp.id}
              className='stamp'
              style={{
                position: 'absolute',
                top: `${highlightY}px`,
                left: `${highlightX}px`,
                width: '32px',
                height: '32px',
                zIndex: '5',
                cursor: 'auto',
              }}
              >
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: '0',
                  left: '0',
                  // background: 'yellow',
                  // opacity: '.3',
                }}
              >
                {
                  stamp.type === 'tick' ? STAMP_TICK :
                  stamp.type === 'cross' ? STAMP_CROSS :
                  stamp.type === 'star' ? STAMP_STAR :
                  stamp.type === 'cool' ? STAMP_COOL :
                  stamp.type === 'confused' ? STAMP_CONFUSED :
                  null
                }
              </div>
              <div
                className='delete'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: '-8px',
                  left: 'calc(100% - 8px)',
                  width: '17px',
                  height: '17px',
                  opacity: '0',
                  backgroundColor: 'var(--c-primary-dark)',
                  borderRadius: '9px',
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 2px 8px 0px',
                  transition: 'all 100ms ease-out',
                  cursor: 'pointer',
                }}
                onClick={(e) => this.deleteStamp(e, stamp.id)}
              >
                <Icon icon='delete' iconSize={12} color='white' />
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}


export default Stamps