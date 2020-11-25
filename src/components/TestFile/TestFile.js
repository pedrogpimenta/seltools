import React from 'react'
import io from 'socket.io-client'

class TestFile extends React.Component {
 constructor(props){
    super(props)

    this.state = {
    }
  }

  componentDidMount() {
    const socket = io('ws://localhost:3000/')

    socket.on('connect', () => {
      console.log('1')

      socket.emit('document open', 'userId', 'documentId')
    });
  }
  
  render() {
    return (
      <div className="App">
        <div>
          test
        </div>
      </div>
    );
  }
}

export default TestFile
