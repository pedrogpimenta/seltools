import React from 'react';
import { store } from '../../store/store'
import Markers from '../Markers/Markers'

class FileWrapper extends React.Component {
  constructor() {
    super()

    this.state = {
      hover: false
    }
  }

  handleMouseEnter = () => {
    this.setState({hover: true})
  }

  handleMouseLeave = () => {
    this.setState({hover: false})
  }

  handleDelete = () => {
    store.dispatch({
      type: "DELETE_FILE",
      fileId: this.props.id,
    }) 
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          marginBottom: '20px',
        }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Markers 
          fileId={this.props.id}
          markers={this.props.markers}
          hasRendered={this.props.hasRendered}
        />
        {this.props.children}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '100%',
            height: '100%',
            width: '40px',
          }}
        >
          <div
            className='delete'
            style={{
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: '8px',
              // left: this.state.hover ? 'calc(100% - 26px)' : 'calc(100% - 44px)',
              top: '0',
              fontSize: 0,
              // padding: '4px 0 0 0',
              width: '30px',
              height: '30px',
              background: '#DDD',
              borderRadius: '40px',
              opacity: this.state.hover ? '1' : '0',
              transition: 'all 100ms ease-out',
            }}
            onClick={this.handleDelete}
          >
            <svg height="20" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd" stroke="#2a2e3b" strokeLinecap="round" strokeLinejoin="round" transform="translate(2 2)"><circle cx="8.5" cy="8.5" r="8"/><g transform="matrix(0 1 -1 0 17 0)"><path d="m5.5 11.5 6-6"/><path d="m5.5 5.5 6 6"/></g></g></svg>
          </div>
        </div>
      </div>
    )
  }
}

export default FileWrapper
