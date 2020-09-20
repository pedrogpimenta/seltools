import React from 'react'
import { store } from '../../store/store'

import Editor from '../Editor/Editor'

class TextFile extends React.Component {

  handleChange = (e, fileId) => {
    console.log('edit1:', e.parentNode.parentNode.classList[1])
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
    console.log('file: id:', this.props.file.id, 'content:', this.props.file.content)
    return (
      <div
        className={`text-editor ${this.props.file.id}`}
        style={{
          display: 'flex',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '100%',
          padding: '8px',
          margin: '0 auto',
          boxShadow: '0 2px 10px 0 rgba(0, 0, 0, .1)',
          borderRadius: '6px',

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
