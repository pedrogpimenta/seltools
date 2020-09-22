import React from 'react'
import axios from 'axios'

class TestFile extends React.Component {
 constructor(props){
    super(props);
    this.state = {
      success : false,
      url : ""
    }
  }
  
  handleChange = (ev) => {
    this.setState({success: false, url : ""});
    
  }

  handleUpload = (ev) => {
    let file = this.uploadInput.files[0];
    // Split the filename to get the name and type
    let fileParts = this.uploadInput.files[0].name.split('.');
    let fileName = fileParts[0];
    let fileType = fileParts[1];

    axios.post("http://localhost:3000/sign_s3",{
      fileName : fileName,
      fileType : fileType
    })
      .then(response => {
        const returnData = response.data.data.returnData;
        const signedRequest = returnData.signedRequest;
        const url = returnData.url;
        this.setState({url: url})

        const options = {
          headers: {
            'Content-Type': fileType,
            'Expires': 500,
          }
        };
        axios.put(signedRequest,file,options)
        .then(result => {
          this.setState({success: true});
        })
        .catch(error => {
          alert("ERROR " + JSON.stringify(error));
        })
      })
      .catch(error => {
        alert(JSON.stringify(error));
      })
  }
  
  
  render() {
    const SuccessMessage = () => (
      <div style={{padding:50}}>
        <h3 style={{color: 'green'}}>SUCCESSFUL UPLOAD</h3>
        <a href={this.state.url}>Access the file here</a>
        <br/>
      </div>
    )
    return (
      <div className="App">
        <center>
          <h1>UPLOAD A FILE</h1>
          {this.state.success ? <SuccessMessage/> : null}
          <input onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} type="file"/>
          <br/>
          <button onClick={this.handleUpload}>UPLOAD</button>
        </center>
      </div>
    );
  }
}

export default TestFile
