import React from 'react'

import MediumEditor from 'medium-editor/dist/js/medium-editor.js'
import Rangy from 'rangy/lib/rangy-core.js'
import 'rangy/lib/rangy-classapplier.js'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/bootstrap.css'

class Editor extends React.Component {
  constructor() {
    super()

    this.editableInput = React.createRef()
  }

  onBlur = () => {
    this.props.onInputBlur()
  }

  componentDidMount = () => {
    Rangy.init()
    const thisComponent = this
    
    var BoldButton = MediumEditor.Extension.extend({
      name: 'bold',

      init: function () {
        
        this.classApplier = Rangy.createClassApplier('bold', {
          elementTagName: 'strong',
          normalize: true
        })

        this.button = this.document.createElement('button')
        this.button.classList.add('medium-editor-action')
        this.button.innerHTML = '<span icon="bold" class="bp3-icon bp3-icon-bold"><svg data-icon="bold" width="16" height="16" viewBox="0 0 16 16"><desc>bold</desc><path d="M11.7 7c.2-.4.3-1 .3-1.5v-.4V5c0-.1 0-.2-.1-.3v-.1C11.4 3.1 10.1 2 8.5 2H4c-.5 0-1 .4-1 1v10c0 .5.4 1 1 1h5c2.2 0 4-1.8 4-4 0-1.2-.5-2.3-1.3-3zM6 5h2c.6 0 1 .4 1 1s-.4 1-1 1H6V5zm3 6H6V9h3c.6 0 1 .4 1 1s-.4 1-1 1z" fill-rule="evenodd"></path></svg></span>'
        this.button.title = 'Bold'

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
        return node.nodeName.toLowerCase() === 'strong';
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

    var UnderlineButton = MediumEditor.Extension.extend({
      name: 'underline',

      init: function () {
        
        this.classApplier = Rangy.createClassApplier('underline', {
          elementTagName: 'u',
          normalize: true
        })

        this.button = this.document.createElement('button')
        this.button.classList.add('medium-editor-action')
        this.button.innerHTML = '<span icon="underline" class="bp3-icon bp3-icon-underline"><svg data-icon="underline" width="16" height="16" viewBox="0 0 16 16"><desc>underline</desc><path d="M8 14c2.8 0 5-2.2 5-5V3c0-.6-.4-1-1-1s-1 .4-1 1v6c0 1.7-1.3 3-3 3s-3-1.3-3-3V3c0-.6-.4-1-1-1s-1 .4-1 1v6c0 2.8 2.2 5 5 5zM13.5 15h-11c-.3 0-.5.2-.5.5s.2.5.5.5h11c.3 0 .5-.2.5-.5s-.2-.5-.5-.5z" fill-rule="evenodd"></path></svg></span>'
        this.button.title = 'Underline'

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
        return node.nodeName.toLowerCase() === 'u';
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

    var HighlighterButton = MediumEditor.Extension.extend({
      name: 'highlighter',

      init: function () {
        
        this.classApplier = Rangy.createClassApplier('highlight', {
          elementTagName: 'mark',
          normalize: true
        })

        this.button = this.document.createElement('button')
        this.button.classList.add('medium-editor-action')
        this.button.innerHTML = '<span icon="highlight" class="bp3-icon bp3-icon-highlight"><svg data-icon="highlight" width="16" height="16" viewBox="0 0 16 16"><desc>highlight</desc><path d="M9.12 11.07l2-2.02.71.71 4-4.04L10.17 0l-4 4.04.71.71-2 2.02 4.24 4.3zM2 12.97h4c.28 0 .53-.11.71-.3l1-1.01-3.42-3.45-3 3.03c-.18.18-.29.44-.29.72 0 .55.45 1.01 1 1.01zm13 1.01H1c-.55 0-1 .45-1 1.01S.45 16 1 16h14c.55 0 1-.45 1-1.01s-.45-1.01-1-1.01z" fill-rule="evenodd"></path></svg></span>'
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
        this.button.innerHTML = '<span icon="strikethrough" class="bp3-icon bp3-icon-strikethrough"><svg data-icon="strikethrough" width="16" height="16" viewBox="0 0 16 16"><desc>strikethrough</desc><path d="M14 7H8.65c-.38-.09-.73-.18-1.04-.26-.31-.08-.49-.13-.54-.14-.43-.11-.79-.29-1.05-.52-.27-.23-.4-.55-.4-.95 0-.29.07-.53.21-.72s.32-.34.54-.46c.22-.11.46-.19.72-.24.26-.05.52-.07.77-.07.74 0 1.36.15 1.84.46.32.2.55.5.68.9h2.22c-.06-.33-.17-.64-.32-.92-.25-.45-.59-.84-1.02-1.15-.43-.31-.93-.54-1.49-.7S8.59 2 7.95 2c-.55 0-1.1.07-1.63.2-.54.13-1.02.34-1.45.62-.42.28-.76.63-1.02 1.05-.26.42-.39.92-.39 1.5 0 .3.04.59.13.88.08.26.21.51.39.75H2c-.55 0-1 .45-1 1s.45 1 1 1h7.13c.25.07.49.14.71.22.25.09.48.23.7.44.21.21.32.53.32.97 0 .21-.05.43-.14.63-.09.21-.24.39-.45.55-.21.16-.48.29-.81.39-.33.1-.73.15-1.2.15-.44 0-.84-.05-1.21-.14-.37-.09-.7-.24-.99-.43-.29-.2-.51-.45-.67-.76-.01 0-.01-.01-.02-.02H3.14a3.68 3.68 0 001.39 2.03c.46.34 1 .58 1.62.74.61.15 1.27.23 1.97.23.61 0 1.2-.07 1.79-.2.58-.13 1.11-.34 1.56-.63.46-.29.83-.66 1.11-1.11.28-.45.42-1 .42-1.64 0-.3-.05-.6-.15-.9-.05-.19-.13-.36-.22-.52H14c.55 0 1-.45 1-1s-.45-1-1-1z" fill-rule="evenodd"></path></svg></span>'
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

    var RedTextButton = MediumEditor.Extension.extend({
      name: 'redtext',

      init: function () {
        
        this.classApplier = Rangy.createClassApplier('redtext', {
          elementTagName: 'span',
          normalize: true
        })

        this.button = this.document.createElement('button')
        this.button.classList.add('medium-editor-action')
        this.button.innerHTML = '<span icon="full-circle" class="bp3-icon bp3-icon-full-circle"><svg data-icon="full-circle" width="16" height="16" viewBox="0 0 16 16"> <defs><clipPath id="cut-off-bottom-'+thisComponent.props.parentId+'"><path d="M8 0a8 8 0 100 16A8 8 0 108 0z"></path></clipPath></defs><desc>full-circle</desc><path d="M8 0a8 8 0 100 16A8 8 0 108 0z" stroke="white" stroke-width="3px" fill="var(--c-redtext)" fill-rule="evenodd" clip-path="url(#cut-off-bottom-'+thisComponent.props.parentId+')" ></path></svg></span>'
        this.button.title = 'Red text'

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
        return node.nodeName.toLowerCase() === 'span';
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

    var CenterTextButton = MediumEditor.Extension.extend({
      name: 'centertext',

      init: function () {
        
        this.classApplier = Rangy.createClassApplier('centertext', {
          elementTagName: 'div',
          normalize: true
        })

        this.button = this.document.createElement('button')
        this.button.classList.add('medium-editor-action')
        this.button.innerHTML = '<span icon="full-circle" class="bp3-icon bp3-icon-full-circle"><svg data-icon="full-circle" width="16" height="16" viewBox="0 0 16 16"> <defs><clipPath id="cut-off-bottom-'+thisComponent.props.parentId+'"><path d="M8 0a8 8 0 100 16A8 8 0 108 0z"></path></clipPath></defs><desc>full-circle</desc><path d="M8 0a8 8 0 100 16A8 8 0 108 0z" stroke="white" stroke-width="3px" fill="var(--c-redtext)" fill-rule="evenodd" clip-path="url(#cut-off-bottom-'+thisComponent.props.parentId+')" ></path></svg></span>'
        this.button.title = 'Red text'

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
        return node.nodeName.toLowerCase() === 'span';
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
      // disableDoubleReturn: true,
      // disableExtraSpaces: true,
      placeholder: {text: ''},
      buttonLabels: 'fontawesome',
      toolbar: {
        diffTop: -14,
        buttons: this.props.fileType === 'txt' ?
          ['bold', 'underline', 'striker', 'highlighter', 'justifyLeft', 'justifyCenter', 'justifyRight'] :
          ['bold', 'underline', 'striker', 'highlighter', 'redtext'],
      },
      extensions: {
        'bold': new BoldButton(),
        'underline': new UnderlineButton(),
        'highlighter': new HighlighterButton(),
        'striker': new StrikerButton(),
        'redtext': new RedTextButton(),
      },
    })

    editor.setContent(this.props.content)

    editor.subscribe('editableInput', function (event, editable) {
      thisComponent.props.onEditorChange(editable)
    })

    if (this.props.hasFocus) {
      window.setTimeout(() => {
        this.editableInput.current.focus()
      }, 1)
    }
  }

  render() {

    return (
      <div
        style ={{
          width: '100%',
        }}
      >
        <div
          ref={this.editableInput}
          className={`editable-${this.props.parentId}`}
          onFocus={(e) => this.props.onInputFocus()}
          onBlur={(e) => this.onBlur()}
          style={{
            width: '100%',
            minWidth: '16px',
            minHeight: '19px',
            cursor: 'text',
            // textAlign: 'center',
          }}
        >
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