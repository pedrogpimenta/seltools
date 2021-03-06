import React from 'react'
import { store } from '../../store/store'
import {
  Button,
  Classes,
  Intent,
} from "@blueprintjs/core"

import {
  RiLock2Fill,
  RiPencilFill,
} from 'react-icons/ri'

import ReactQuill, {Quill} from 'react-quill'
import 'react-quill/dist/quill.snow.css'

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


class TextFile extends React.Component {
  constructor() {
    super();

    this.state = {
      editMode: 'markers',
    }
  }

  handleChange = (e) => {
    store.dispatch({
      type: "EDIT_TEXT_FILE",
      id: this.props.file.id,
      content: e,
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

  componentDidMount = () => {
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
          marginBottom: '20px',
          width: 'var(--doc-width)',
          maxWidth: '100%',
          minHeight: '40px',
          padding: '0',
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
            bottom: '100%',
            left: 0,
            marginBottom: '4px',
            cursor: 'pointer',
            transition: 'all 100ms ease-out',
            opacity: this.state.editMode === 'text' ? '.9' : '0',
          }}
        >
          <Button
            style={{
              margin: '0 4px',
            }}
            intent={this.state.editMode === 'markers' ? Intent.DEFAULT : Intent.PRIMARY}
            className={this.state.editMode === 'markers' && Classes.MINIMAL}
            icon={this.state.editMode === 'markers' ? <RiPencilFill /> : <RiLock2Fill />}
            onClick={this.handleChangeMode}
          />
        </div>
        <ReactQuill
          theme="snow"
          value={this.props.file.content}
          onChange={this.handleChange}
          readOnly={this.props.isLocked}
          scrollingContainer="html"
          modules={{
            toolbar: [
              [{ 'font': ['opensans', 'comfortaa', 'lobster', 'amatic'] }],
              [{ 'header': [1, 2, false] }],
              [{ 'align': [] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              [{ 'color': [] }, { 'background': [] }],
              ['link'],
              ['clean'],
            ],
            clipboard: {
              matchVisual: false,
            },
          }}
        />

        {/* <Editor
          content={this.props.file.content}
          parentId={this.props.file.id}
          fileId={this.props.file.id}
          fileType={this.props.file.type}
          // hasFocus={this.props.hasFocus}
          onEditorChange={(e) => {this.handleChange(e, this.props.file.id)}}
          onInputFocus={(e) => {this.onInputFocus(e)}}
          onInputBlur={(e) => {this.onInputBlur(e)}}
        /> */}
        {/* {this.props.file.content} */}
      </div>
    )
  }
};

export default TextFile
