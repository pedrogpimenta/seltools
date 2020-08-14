import React from 'react'
import { Link } from 'react-router-dom'

class Student extends React.Component {
  constructor() {
    super()

    this.state = {
      studentName: '',
      documents: [],
      isLoading: true,
    }
  }

  componentDidMount = () => {
    const studentName = localStorage.getItem('studentName') || window.prompt('Como te llamas?')

    fetch(`http://localhost:3000/student/${studentName}`)
      .then(response => response.json())
      .then(data => {
        if (!!data[0]?.name) {
          // console.log(data[0]?.name)
          this.setState({
            isLoading: false,
            studentName: data[0].name,
            documents: data[0].documents,
          })
          localStorage.setItem('studentName', data[0].name)
        }
      })
  }

  renderDocuments = () => {
    if (this.state.isLoading) return <div>Loading...</div>

    return this.state.documents.map(document => (
      <li key={document._id}>
        <div><Link to={`/documento/${document._id}`}>{document.name}</Link></div>
      </li>
    ))
  }

  render() {
    return (
      <div>
        <h1>Hola, {this.state.studentName}</h1>
        <p>Tus documentos:</p>
        <ul>
          {this.renderDocuments()}
        </ul>
      </div>
    )
  }
}

export default Student
