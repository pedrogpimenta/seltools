import React from 'react';

class Button extends React.Component {
  constructor() {
    super()

    this.fileInput = React.createRef()
  }

  renderButton = () => {
    const buttonStyles = {
      display: 'inline-flex',
      backgroundColor: 'var(--c-button-bg)',
      color: 'var(--c-button-text)',
      padding: 'var(--py-button) var(--px-button)',
    }

    if (this.props.type === 'file') {
      return (
        <>
          <input
            ref={this.fileInput}
            multiple
            accept='image/png, image/jpeg, image/webp, image/svg+xml, image/bmp, image/gif, application/pdf'
            type={this.props.type}
            onChange={(e) => this.props.onChange(e)}
            style={{display: 'none'}}
          />
          <button
            style={buttonStyles}
            onClick={() => this.fileInput.current.click()}
          >
            {this.props.text}
          </button>
        </>
      )
    } else if (this.props.type === 'button') {
      return (
        <button
          style={buttonStyles}
          onClick={(e) => this.props.onClick(e)}
        >
          {this.props.text}
        </button>
      )
    }
  }

  render() {
    return this.renderButton()
  }
};

export default Button
