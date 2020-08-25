import React from 'react';

class Image extends React.Component {
  render() {
    return (
      <div style={{
        display: 'flex',
        userSelect: 'none',
        }}>
        <img
          src={this.props.file.url}
          alt={this.props.file.id}
          style={{
            maxWidth: '100%',
            margin: '0 auto',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px 0 rgba(0, 0, 0, .1)',
          }}
        />
      </div>
    )
  }
};

export default Image
