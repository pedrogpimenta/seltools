import React from 'react'
import { store } from '../../store/store'
import ReactQuill, {Quill} from 'react-quill'
import 'react-quill/dist/quill.bubble.css'

import {
  Button,
  Popover,
  Tooltip,
} from "@blueprintjs/core"

import {
  RiCheckFill,
  RiMenu2Fill,
  RiDeleteBinLine,
} from 'react-icons/ri'

import TextInputOptions from '../TextInputOptions/TextInputOptions'

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

class TextInputs extends React.Component {
  constructor() {
    super()

    this.state = {
      hasFocus: false,
      mouseOver: false,
      isDrawerOpen: false,
      answerState: 'unanswered',
    }

    this.editableInput = React.createRef()
  }

  handleChange = (e) => {
    store.dispatch({
      type: "EDIT_TEXTINPUT",
      fileId: this.props.fileId,
      id: this.props.textInput.id,
      content: e,
    }) 

    if (e.replace(/<\/?[^>]+(>|$)/g, '') === '') {
      store.dispatch({
        type: 'SET_TEXTINPUT_STATE',
        fileId: this.props.fileId,
        textInputId: this.props.textInput.id,
        answerState: 'unanswered',
      })
    }

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  onInputFocus = (e) => {
    this.setState({hasFocus: true})
  }

  onInputBlur = (e) => {
    this.setState({hasFocus: false})
  }

  handleCheckAnswer = () => {
    const answer = this.props.textInput.correctAnswers.find((answer) => answer === this.props.textInput.content.replace(/<\/?[^>]+(>|$)/g, ''))
    const answerState = this.props.textInput.correctAnswers.length === 0 ? 'unaswered' :
                        this.props.textInput.content.replace(/<\/?[^>]+(>|$)/g, '') === '' ? 'unaswered' :
                        answer ? 'correct' : 'wrong'

    store.dispatch({
      type: 'SET_TEXTINPUT_STATE',
      fileId: this.props.fileId,
      textInputId: this.props.textInput.id,
      answerState: answerState,
    })

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }

  componentDidMount = () => {
    window.setTimeout(() => {
      this.setState({
        componentIsReady: true,
        answerState: this.props.answerState,
      })
    }, 1000)
  }

  render() {
    const inputButtonsWidth = this.props.isStudent ? '42px' : '52px'
    // const boxShadowDefault = 'rgba(16, 22, 26, 0.4) 0px 0px 1px inset, rgba(16, 22, 26, 0) 0px 0px 0px inset, rgba(16, 22, 26, 0.2) 0px 1px 3px inset'
    // const boxShadowCorrect = 'rgba(16, 22, 26, 0.4) 0px 0px 1px inset, rgba(16, 22, 26, 0) 0px 0px 0px inset, rgba(16, 22, 26, 0.2) 0px 1px 3px inset, green 0 0 0px 3px'
    // const boxShadowWrong = 'rgba(16, 22, 26, 0.4) 0px 0px 1px inset, rgba(16, 22, 26, 0) 0px 0px 0px inset, rgba(16, 22, 26, 0.2) 0px 1px 3px inset, red 0 0 0px 3px'

    const boxShadowDefault = 'var(--c-answer-default) 0px 0px 0px 2px, var(--c-answer-default) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 2px 8px 0px'
    const boxShadowCorrect = 'var(--c-answer-correct) 0px 0px 0px 2px, var(--c-answer-correct) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 2px 8px 0px'
    const boxShadowWrong = 'var(--c-answer-wrong) 0px 0px 0px 2px, var(--c-answer-wrong) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 2px 8px 0px'

    return (
      <Tooltip
        placement='top'
        content={`correct answer`}
      >
      <div
        style={{
          position: 'absolute',
          // width: this.state.mouseOver || this.state.isDrawerOpen || this.state.hasFocus ? `calc(100% + ${inputButtonsWidth})` : '100%',
          width: '100%',
          height: '100%',
          top: '0',
          left: '0',
          // paddingRight: inputButtonsWidth,
          // paddingRight: this.state.mouseOver || this.state.isDrawerOpen || this.state.hasFocus ? inputButtonsWidth : '0',
          // background: this.props.textInput.answerState === 'correct' ? 'green' : this.props.textInput.answerState === 'wrong' ? 'red' : 'white',
          background: 'white',
          boxShadow: this.props.textInput.answerState === 'correct' ? boxShadowCorrect : this.props.textInput.answerState === 'wrong' ? boxShadowWrong : boxShadowDefault,
          borderRadius: '6px',
          // transition: 'all 100ms ease-out',
          pointerEvents: this.props.isStudent ? 'all' : 'auto',
        }}
        onMouseOver={()=> {this.setState({mouseOver: true})}}
        onMouseOut={()=> {this.setState({mouseOver: false})}}
      >
          <div
            style={{
              height: '100%',
              zIndex: this.state.hasFocus ? '5': '0'
            }}
          >
            <ReactQuill
              ref={this.editableInput}
              theme="bubble"
              value={this.props.textInput.content}
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              onChange={(e) => {this.handleChange(e)}}
              onKeyDown={(e) => {if (e.code === 'Enter' || e.code === 'Tab') {this.handleCheckAnswer()}}}
              modules={{
                keyboard: {
                  bindings: {
                    tab: false,
                  }
                },
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike', { 'color': [] }, { 'background': [] }],
                ],
                clipboard: {
                  matchVisual: false,
                },
              }}
            />
          </div>
        {!this.props.isStudent &&
          <div
            className={`drawer ${this.state.isDrawerOpen || this.state.hasFocus ? 'open' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              position: 'absolute',
              top: '0',
              opacity: this.state.mouseOver || this.state.isDrawerOpen || this.state.hasFocus ? '1' : '0',
              // right: '0',
              left: 'calc(100% - 3px)',
              width: inputButtonsWidth,
              height: '100%',
              paddingLeft: '6px',
              transition: 'all 100ms ease-out',
              // background: 'white',
              background: this.props.textInput.answerState === 'correct' ? 'var(--c-answer-correct)' : this.props.textInput.answerState === 'wrong' ? 'var(--c-answer-wrong)' : 'var(--c-answer-default)',
              borderRadius: '0 6px 6px 0',
              // boxShadow: 'white 0px 0px 0px 2px, white 0px 0px 0px 1px inset',
              boxShadow: this.props.textInput.answerState === 'correct' ? boxShadowCorrect : this.props.textInput.answerState === 'wrong' ? boxShadowWrong : boxShadowDefault,
              zIndex: '-1',
              cursor: 'pointer',
            }}
          >
            <RiDeleteBinLine
              onClick={() => this.props.deleteTextInput(this.props.textInput.id)}
            />
            <Popover
              autoFocus={false}
              onOpening={() => {this.setState({isDrawerOpen: true})}}
              onClosing={() => {this.setState({isDrawerOpen: false})}}
              position='right-top'
              content={<TextInputOptions
                fileId={this.props.fileId}
                textInput={this.props.textInput}
              />}
            >
              <RiMenu2Fill />
            </Popover>
          </div>
        }
        {this.props.isStudent &&
          <div
            className={`drawer ${this.state.isDrawerOpen || this.state.hasFocus ? 'open' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: '0',
              opacity: this.state.mouseOver || this.state.isDrawerOpen || this.state.hasFocus ? '1' : '0',
              right: '0',
              width: inputButtonsWidth,
              height: '100%',
              // paddingRigth: '4px',
              transition: 'all 100ms ease-out',
              cursor: 'pointer',
              pointerEvents: this.state.mouseOver || this.state.isDrawerOpen || this.state.hasFocus ? 'all' : 'none',
            }}
          >
            <Button
              minimal={true}
              icon={<RiCheckFill />}
              onClick={this.handleCheckAnswer}
            />
          </div>
        }
      </div>
      </Tooltip>
    )
  }
}

export default TextInputs