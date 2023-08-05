import React from 'react'
import { store } from '../../store/store'
import TextInput from '../TextInput/TextInput'

class TextInputs extends React.Component {
  constructor() {
    super()

    this.state = {
      mouseDown: false,
      mouseDownX: 0,
      mouseDownY: 0,
      mouseUpX: 0,
      mouseUpY: 0,
      ghostX: 0,
      ghostY: 0,
      ghostWidth: 0,
      ghostHeight: 0,
      componentIsReady: false,
      hasFocus: false,
    }

    this.textInputsRef = React.createRef()
    this.editableInput = React.createRef()
  }

  handleMouseDown = (e) => {
    if (e.target.className !== 'textInputs') return

    this.setState({
      mouseDown: true,
      mouseDownX: e.clientX,
      mouseDownY: e.clientY,
    })
  }

  handleMouseMove = (e) => {
    if (this.state.mouseDown) {
      const c = this.textInputsRef.current
      const fileInfo = c.getBoundingClientRect()

      let width = (e.clientX - fileInfo.x) - (this.state.mouseDownX - fileInfo.x)
      let height = (e.clientY - fileInfo.y) - (this.state.mouseDownY - fileInfo.y)
      let thisXPercent = this.state.mouseDownX - fileInfo.x
      let thisYPercent = this.state.mouseDownY - fileInfo.y

      if (width < 0) {
        thisXPercent = this.state.mouseDownX - fileInfo.x + width
        width = Math.abs(width)
      }

      if (height < 0) {
        thisYPercent = this.state.mouseDownY - fileInfo.y + height
        height = Math.abs(height)
      }

      this.setState({
        ghostX: thisXPercent,
        ghostY: thisYPercent,
        ghostWidth: width,
        ghostHeight: height,
      })
    }
  }

  handleMouseUp = (e) => {
    if (!this.state.mouseDown) return

    this.setState({
      mouseDown: false,
      ghostX: 0,
      ghostY: 0,
      ghostWidth: 0,
      ghostHeight: 0,
    })

    const c = this.textInputsRef.current
    const fileInfo = c.getBoundingClientRect()
    const xPercentStart = ((this.state.mouseDownX - fileInfo.x) * 100) / fileInfo.width
    const yPercentStart = ((this.state.mouseDownY - fileInfo.y) * 100) / fileInfo.height
    const xPercentEnd = ((e.clientX - fileInfo.x) * 100) / fileInfo.width
    const yPercentEnd = ((e.clientY - fileInfo.y) * 100) / fileInfo.height

    if (
      ((e.clientX > this.state.mouseDownX + 5) && (e.clientY > this.state.mouseDownY + 5)) ||
      ((e.clientX > this.state.mouseDownX + 5) && (e.clientY < this.state.mouseDownY - 5)) ||
      ((e.clientX < this.state.mouseDownX - 5) && (e.clientY > this.state.mouseDownY + 5)) ||
      ((e.clientX < this.state.mouseDownX - 5) && (e.clientY < this.state.mouseDownY - 5))) {
      this.handleNewTextInput(xPercentStart, yPercentStart, xPercentEnd, yPercentEnd)
    }
  }

  handleNewTextInput = (xPercentStart, yPercentStart, xPercentEnd, yPercentEnd) => {
    let width = xPercentEnd - xPercentStart
    let height = yPercentEnd - yPercentStart

    let thisXPercent = xPercentStart
    let thisYPercent = yPercentStart

    if (width < 0) {
      thisXPercent = xPercentStart + width
      width = Math.abs(width)
    }

    if (height < 0) {
      thisYPercent = yPercentStart + height
      height = Math.abs(height)
    }

    store.dispatch(
      {
        type: 'ADD_NEW_TEXTINPUT',
        fileId: this.props.fileId,
        id: `textInput-${Math.floor((Math.random() * 100000) + 1)}`,
        xPercent: thisXPercent,
        yPercent: thisYPercent,
        width: width,
        height: height,
        content: '',
        answerState: 'unanswered', // 'unanswered', 'correct', 'wrong'
        correctAnswers: [], // [ 'amar', 'querer' ]
        enableCase: false, // Bool
        enableAccents: false, // Bool

      }
    )

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  deleteTextInput = (textInput) => {
    store.dispatch(
      {
        type: 'DELETE_TEXTINPUT',
        fileId: this.props.fileId,
        id: textInput,
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
        ref={this.textInputsRef}
        className='textInputs'
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          zIndex: this.props.isStudent ? '6' : this.props.isActive ? '5' : '2',
          pointerEvents: this.props.isStudent ? 'none' : this.props.isActive ? 'all' : 'none',
        }}
        onMouseMove={(e) => this.handleMouseMove(e)}
        onMouseDown={(e) => this.handleMouseDown(e)}
        onMouseUp={(e) => this.handleMouseUp(e)}
      >
        {this.props.isLocked &&
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: '100',
              pointerEvents: 'all',
            }}
            onClick={this.props.handleClickWhenLocked}
          >
          </div>
        }
        <div
          key='ghost-textInput'
          className='ghost-textInput'
          style={{
            position: 'absolute',
            display: !!this.state.ghostWidth ? 'block' : 'none',
            top: `${this.state.ghostY}px`,
            left: `${this.state.ghostX}px`,
            width: `${this.state.ghostWidth}px`,
            height: `${this.state.ghostHeight}px`,
            background: 'white',
            boxShadow: 'rgba(16, 22, 26, 0.4) 0px 0px 1px inset, rgba(16, 22, 26, 0) 0px 0px 0px inset, rgba(16, 22, 26, 0.2) 0px 1px 3px inset',
            borderRadius: '6px',
          }}
        ></div>
        {this.state.componentIsReady && this.props.textInputs.map(textInput => {
          const c = this.textInputsRef.current
          const width = c.getBoundingClientRect().width
          const height = c.getBoundingClientRect().height

          const textInputX = (textInput.xPercent * width) / 100
          const textInputY = (textInput.yPercent * height) / 100
          const textInputWidth = (textInput.width * width) / 100
          const textInputHeight = (textInput.height * height) / 100

          return (
            <div
              key={textInput.id}
              className='textInput'
              style={{
                position: 'absolute',
                top: `${textInputY}px`,
                left: `${textInputX}px`,
                width: `${textInputWidth}px`,
                height: `${textInputHeight}px`,
              }}
              >
                <TextInput
                  key={textInput.id}
                  fileId={this.props.fileId}
                  textInput={textInput}
                  deleteTextInput={this.deleteTextInput}
                  isStudent={this.props.isStudent}
                />

            </div>
          )
        })}
      </div>
    )
  }
}

export default TextInputs