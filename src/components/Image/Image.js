import React from 'react';

class Image extends React.Component {
  render() {
    return (
      <div style={{display: 'flex'}}>
        <img
          src={`data:image/jpeg;base64,${btoa(this.props.file.content)}`}
          style={{
            border: '1px solid red',
            maxWidth: '100%',
            margin: '0 auto',
          }}
        />
      </div>
    )
  }
};

export default Image
