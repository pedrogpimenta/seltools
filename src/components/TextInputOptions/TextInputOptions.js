import React from 'react'
import { store } from '../../store/store'

import {
  Button,
  Classes,
  InputGroup,
  Tag,
} from "@blueprintjs/core"

import {
  RiAddLine,
} from 'react-icons/ri'

class TextInputOptions extends React.Component {
  constructor() {
    super()

    this.state = {
      inputContent: '',
    }
  }

  handleChange = (e) => {
    this.setState({
      inputContent: e.target.value,
    })
  }

  handleAddAnswer = () => {
    store.dispatch({
      type: 'ADD_TEXTINPUT_ANSWER',
      fileId: this.props.fileId,
      textInputId: this.props.textInput.id,
      answer: this.state.inputContent,
    })

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 

    this.setState({
      inputContent: '',
    })
  }

  handleDeleteAnswer = (e) => {
    store.dispatch({
      type: 'DELETE_TEXTINPUT_ANSWER',
      fileId: this.props.fileId,
      textInputId: this.props.textInput.id,
      answer: e,
    })

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

  // componentDidMount = () => {

  // }

  render() {

    const addButton = (
      <Button
        icon={<RiAddLine />}
        minimal={true}
        style={{
          opacity: this.state.inputContent.trim(' ') !== '' ? '1' : '0',
          transition: 'all 100ms ease-out',
          pointerEvents: this.state.inputContent.trim(' ') !== '' ? 'all' : 'none',
        }}
        onClick={this.handleAddAnswer}
      />
    )

    return (
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '6px',
        }}
        key="input"
      >
        <label className={Classes.LABEL}>
          Respuestas correctas
          <InputGroup
            onChange={this.handleChange}
            onKeyDown={(e) => {if (e.code === 'Enter') this.handleAddAnswer()}}
            value={this.state.inputContent}
            rightElement={addButton}
          />
        </label>
        <div>
          {this.props.textInput.correctAnswers.map((answer, i) => {
            return (
              <Tag
                key={answer}
                large={true}
                fill={true}
                style={{
                  marginBottom: i !== this.props.textInput.correctAnswers.length - 1 ? '8px' : '',
                }}
                onRemove={() => {this.handleDeleteAnswer(answer)}}
              >
                {answer}
              </Tag>
            )
          })}
        </div>
      </div>
    )
  }
}

export default TextInputOptions