import React from 'react'
import { store } from '../../store/store'
import {
  Button,
  ButtonGroup,
  Classes,
  Divider,
  Intent,
} from "@blueprintjs/core"

import {
  RiArrowGoBackLine,
  RiCloseCircleLine,
  RiLock2Fill,
  RiPencilFill,
} from 'react-icons/ri'

import CanvasDraw from 'react-canvas-draw'

import { DRAW_COLORS } from '../../CONSTANTS'

class DrawFile extends React.Component {
  constructor() {
    super();

    this.state = {
      editMode: 'markers',
      brushColor: '#000000',
      brushSize: 3,
      brushX: 0,
      brushY: 0,
      isHover: false,
    }

    this.draw = React.createRef()
    this.pointerContainer = React.createRef()
  }

  handleChange = (e) => {
    store.dispatch({
      type: "EDIT_TEXT_FILE",
      id: this.props.file.id,
      content: e.getSaveData(),
      name: null,
    }) 

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  handleChangeMode = () => {
    this.setState(
      {editMode: this.state.editMode === 'text' ? 'markers' : 'text',
    })
  }

  handleChangeColor = (color) => {
    this.setState({
      brushColor: color,
    })
  }

  handleChangeSize = (size) => {
    this.setState({
      brushSize: size,
    })
  }

  handleClear = () => {
    this.draw.current.clear()
  }

  handleUndo = () => {
    this.draw.current.undo()
  }

  handleMouseMove = (e) => {
    const container = this.pointerContainer.current.getBoundingClientRect()

    this.setState({
      brushX: e.clientX - container.x,
      brushY: e.clientY - container.y,
    })
  }

  componentDidMount = () => {
    if (this.props.file.content) {
      this.draw.current.loadSaveData(this.props.file.content, false)
    }

    this.setState(
      {editMode: this.props.isLocked ? this.state.editMode : 'markers',
    })

  }

  render() {
    return (
      <div
        className={`text-editor ${this.state.editMode === 'text' && !this.props.isLocked ? '' : 'locked'} ${this.props.file.id} bp3-running-text`}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '20px',
          width: 'var(--doc-width)',
          maxWidth: '100%',
          minHeight: '40px',
          // padding: '6px',
          margin: '0 auto',
          boxShadow: '0 2px 10px 0 rgba(0, 0, 0, .1)',
          borderRadius: '6px',
          backgroundColor: 'white',
          zIndex: this.state.editMode === 'text' ? '10' : '1',
        }}
      >
        <div
          className='text-editor__edit-button'
          style={{
            display: this.props.isLocked ? 'none' : 'block',
            position: 'absolute',
            top: '5px',
            right: '100%',
            cursor: 'pointer',
            transition: 'all 100ms ease-out',
            opacity: this.state.editMode === 'text' ? '.9' : '0',
          }}
        >
          <Button
            style={{
              margin: '0 4px',
              height: '38px',
            }}
            intent={this.state.editMode === 'markers' ? Intent.DEFAULT : Intent.PRIMARY}
            className={this.state.editMode === 'markers' && Classes.MINIMAL}
            icon={this.state.editMode === 'markers' ? <RiPencilFill /> : <RiLock2Fill />}
            onClick={this.handleChangeMode}
          />
        </div>
        <div
          style={{
            display: 'flex',
            padding: this.state.editMode === 'markers' ? '0 6px' : '6px',
            borderBottom: this.state.editMode === 'markers' ? 'none' : '1px solid #DDD',
            transition: 'all 100ms ease-out',
            overflow: 'hidden',
            opacity: this.state.editMode === 'markers' ? '0' : '1',
            height: this.state.editMode === 'markers' ? '0' : 'auto',
          }}
        >
          {}
          <ButtonGroup
            minimal={true}
          >
            <Button
              icon={<RiCloseCircleLine />}
              onClick={this.handleClear}
            >
            </Button>
            <Button
              icon={<RiArrowGoBackLine />}
              onClick={this.handleUndo}
            >
            </Button>
          </ButtonGroup>
          <Divider />
          <ButtonGroup
            minimal={true}
          >
            {DRAW_COLORS.map((color) => 
              <Button
                style={{
                  padding: '5px',
                }}
                active={this.state.brushColor === color}
                onClick={() => this.handleChangeColor(color)}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: color,
                  }}
                ></div>
              </Button>
            )}
          </ButtonGroup>
          <Divider />
          <ButtonGroup
            minimal={true}
          >
            <Button
              style={{
                padding: '5px',
              }}
              active={this.state.brushSize === 1}
              onClick={() => this.handleChangeSize(1)}
            >
              <div
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '1.5px',
                  overflow: 'hidden',
                  backgroundColor: 'black',
                }}
              ></div>
            </Button>
            <Button
              style={{
                padding: '5px',
              }}
              active={this.state.brushSize === 3}
              onClick={() => this.handleChangeSize(3)}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: 'black',
                }}
              ></div>
            </Button>
            <Button
              style={{
                padding: '5px',
              }}
              active={this.state.brushSize === 6}
              onClick={() => this.handleChangeSize(6)}
            >
              <div
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: 'black',
                }}
              ></div>
            </Button>
          </ButtonGroup>
        </div>
        <div
          style={{
            position: 'relative',
          }}
          ref={this.pointerContainer}
          onMouseMove={(e) => this.handleMouseMove(e)}
          onMouseEnter={() => this.setState({isHover: true})}
          onMouseLeave={() => this.setState({isHover: false})}
        >
          <div
            style={{
              opacity: this.state.editMode === 'markers' || !this.state.isHover ? '0' : '1',
              position: 'absolute',
              width: this.state.brushSize * 2,
              height: this.state.brushSize * 2,
              top: this.state.brushY - (this.state.brushSize),
              left: this.state.brushX - (this.state.brushSize),
              borderRadius: '50%',
              backgroundColor: this.state.brushColor,
            }}
          >
          </div>
          <CanvasDraw
            ref={this.draw}
            style={{
              width: '100%',
              height: '600px',
            }}
            // disabled={this.state.editMode === 'markers'}
            brushColor={this.state.brushColor}
            catenaryColor={this.state.brushColor}
            brushRadius={this.state.brushSize}
            // saveData={this.props.file.content}
            hideGrid={true}
            lazyRadius={0}
            hideInterface={true}
            onChange={(e) => this.handleChange(e)}
          />
        </div>
      </div>
    )
  }
};

export default DrawFile
