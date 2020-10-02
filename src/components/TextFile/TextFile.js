import React from 'react'
import { store } from '../../store/store'
import {
  Button,
  Classes,
  Intent,
} from "@blueprintjs/core"

import Editor from '../Editor/Editor'

class TextFile extends React.Component {
  constructor() {
    super();

    this.state = {
      editMode: 'markers',
    }
  }

  handleChange = (e, fileId) => {
    store.dispatch({
      type: "EDIT_TEXT_FILE",
      fileId: this.props.file.id,
      id: e.parentNode.parentNode.classList[1],
      content: e.innerHTML,
      name: null,
    }) 

    store.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
  }
  
  onInputFocus = (e) => {
    // this.setState({hasFocus: true})
  }

  onInputBlur = (e) => {
    // this.setState({hasFocus: false})
  }

  handleChangeMode = () => {
    this.setState({editMode: this.state.editMode === 'text' ? 'markers' : 'text'})
  }

  // handleChangeMode = (prevState) => {
  //   this.setState({editMode: prevState === 'text' ? 'markers' : 'text'})
  // }

  render() {
    return (
      <div
        className={`text-editor ${this.props.file.id} bp3-running-text`}
        style={{
          position: 'relative',
          display: 'flex',
          marginBottom: '20px',
          width: 'var(--doc-width)',
          maxWidth: '100%',
          padding: '8px 16px',
          margin: '0 auto',
          boxShadow: '0 2px 10px 0 rgba(0, 0, 0, .1)',
          borderRadius: '6px',
          fontSize: '16px',
          backgroundColor: 'white',
          zIndex: this.state.editMode === 'text' ? '10' : '1',
        }}
      >
        <div
          className='text-editor__edit-button'
          style={{
            position: 'absolute',
            top: '5px',
            right: '100%',
            cursor: 'pointer',
            transition: 'all 100ms ease-out',
            opacity: this.state.editMode === 'text' ? '.9' : '0',
          }}
        >
          <Button
            style={{margin: '0 4px'}}
            intent={this.state.editMode === 'markers' ? Intent.DEFAULT : Intent.PRIMARY}
            className={this.state.editMode === 'markers' && Classes.MINIMAL}
            icon={this.state.editMode === 'markers' ? 'edit' : 'lock'}
            onClick={this.handleChangeMode}
          />
        </div>
        <Editor
          content={this.props.file.content}
          parentId={this.props.file.id}
          fileId={this.props.file.id}
          fileType={this.props.file.type}
          // hasFocus={this.props.hasFocus}
          onEditorChange={(e) => {this.handleChange(e, this.props.file.id)}}
          onInputFocus={(e) => {this.onInputFocus(e)}}
          onInputBlur={(e) => {this.onInputBlur(e)}}
        />
        {/* {this.props.file.content} */}
      </div>
    )
  }
};

export default TextFile
