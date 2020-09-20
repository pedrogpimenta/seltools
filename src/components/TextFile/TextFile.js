import React from 'react'
import { store } from '../../store/store'

import Editor from '../Editor/Editor'

class TextFile extends React.Component {

  handleChange = (e, fileId) => {
    store.dispatch({
      type: "EDIT_TEXT_FILE",
      fileId: this.props.file.id,
      id: e.parentNode.parentNode.classList[1],
      content: e.innerHTML,
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

  render() {
    return (
      <div
        className={`text-editor ${this.props.file.id} bp3-running-text`}
        style={{
          display: 'flex',
          marginBottom: '20px',
          width: 'var(--doc-width)',
          maxWidth: '100%',
          padding: '8px',
          margin: '0 auto',
          boxShadow: '0 2px 10px 0 rgba(0, 0, 0, .1)',
          borderRadius: '6px',
          fontSize: '16px',
        }}
      >
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
