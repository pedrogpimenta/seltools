import React from 'react'
// import ContentEditable from 'react-contenteditable'
// import Draggable from 'react-draggable'
// import { connect } from 'react-redux'
// import { store } from '../../store/store'
// import { findDOMNode } from 'react-dom'
import MediumEditor from 'medium-editor/dist/js/medium-editor.js'
import Rangy from 'rangy/lib/rangy-core.js'
import RangyClassApplier from 'rangy/lib/rangy-classapplier.js'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/bootstrap.css'

class Editor extends React.Component {
  componentDidMount = () => {
    Rangy.init()
    const thisComponent = this

    var HighlighterButton = MediumEditor.Extension.extend({
      name: 'highlighter',

      init: function () {
        
        this.classApplier = Rangy.createClassApplier('highlight', {
          elementTagName: 'mark',
          normalize: true
        })

        this.button = this.document.createElement('button')
        this.button.classList.add('medium-editor-action')
        this.button.innerHTML = '<b>H</b>'
        this.button.title = 'Highlight'

        this.on(this.button, 'click', this.handleClick.bind(this))
      },
    
      getButton: function () {
        return this.button
      },

      handleClick: function (event) {
        this.classApplier.toggleSelection()
    
        // Ensure the editor knows about an html change so watchers are notified
        // ie: <textarea> elements depend on the editableInput event to stay synchronized
        this.base.checkContentChanged()
      },
      
      isAlreadyApplied: function (node) {
        return node.nodeName.toLowerCase() === 'mark';
      },
    
      isActive: function () {
        return this.button.classList.contains('medium-editor-button-active');
      },
    
      setInactive: function () {
        this.button.classList.remove('medium-editor-button-active');
      },
    
      setActive: function () {
        this.button.classList.add('medium-editor-button-active');
      },
    })

    var StrikerButton = MediumEditor.Extension.extend({
      name: 'striker',

      init: function () {
        
        this.classApplier = Rangy.createClassApplier('striker', {
          elementTagName: 'del',
          normalize: true
        })

        this.button = this.document.createElement('button')
        this.button.classList.add('medium-editor-action')
        this.button.innerHTML = '<s>S</s>'
        this.button.title = 'Striker'

        this.on(this.button, 'click', this.handleClick.bind(this))
      },
    
      getButton: function () {
        return this.button
      },

      handleClick: function (event) {
        this.classApplier.toggleSelection()
    
        // Ensure the editor knows about an html change so watchers are notified
        // ie: <textarea> elements depend on the editableInput event to stay synchronized
        this.base.checkContentChanged()
      },
      
      isAlreadyApplied: function (node) {
        return node.nodeName.toLowerCase() === 'del';
      },
    
      isActive: function () {
        return this.button.classList.contains('medium-editor-button-active');
      },
    
      setInactive: function () {
        this.button.classList.remove('medium-editor-button-active');
      },
    
      setActive: function () {
        this.button.classList.add('medium-editor-button-active');
      },
    })
    var editor = new MediumEditor(`.editable-${thisComponent.props.parentId}`, {
      toolbar: {
          buttons: ['bold', 'underline', 'striker', 'highlighter']
      },
      extensions: {
          'highlighter': new HighlighterButton(),
          'striker': new StrikerButton(),
      },
    })

    editor.setContent(this.props.content)

    editor.subscribe('editableInput', function (event, editable) {
      thisComponent.props.onEditorChange(editable)
    })


  }

  render() {

    return (
      <div>
        <div className={`editable-${this.props.parentId}`}>
          {/* {this.props.content} */}
        </div>
      </div>
    )
  }
};

// function mapStateToProps(state) {
//   return {
//     dragging: state.dragging,
//   }
// }

// export default connect(mapStateToProps)(Editor)
export default Editor