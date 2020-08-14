import React from 'react'
import { Link } from 'react-router-dom'
// import './Documents.css'

import Button from '../Button/Button'

class Documents extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoadingStudents: true,
      isLoadingDocuments: true,
      documents: [],
      students: [],
    }
  }

  getUser = () => {
    fetch('http://localhost:3000/user/Selen')
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoadingStudents: false,
          students: data[0].students,
        })
      })
  }

  getDocuments = () => {
    fetch('http://localhost:3000/documents')
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoadingDocuments: false,
          documents: data,
        })
      })
  }

  handleAddStudent = () => {
    const studentName = window.prompt('Como se llama tu nuevo alumno?')

    if (studentName.length > 0) {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: studentName})
      }

      const fetchUrl = `http://localhost:3000/student/`

      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          // console.log('data:', data)
        })
    }
  }

  renderDocuments = () => {
    if (this.state.isLoadingDocuments) return <div>Loading...</div>

    return this.state.documents.map(document => (
      <li key={document._id}>
        <div><Link to={`/documento/${document._id}`}>{document.name}</Link></div>
      </li>
    ))
  }

  renderStudents = () => {
    if (this.state.isLoadingStudents) return <div>Loading...</div>

    return this.state.students.map(student => (
      <li key={student.id} style={{display: 'inline-block', marginRight: '8px'}}>
        <div>{student.name}</div>
      </li>
    ))
  }

  componentDidMount = () => {
    this.getDocuments()
    this.getUser()
  }

  render() {
    return (
      <div>
        <Link to='/documento' isNew={true}>Nuevo documento</Link>
        <div>
          <span style={{marginRight: '16px'}}>
            Alumnos:
          </span>
          <span style={{marginRight: '16px', display: 'inline-block'}}>
            <ul style={{margin: '0', padding: '0', listStyle: 'none'}}>
              {this.renderStudents()}
            </ul>
          </span>
          <Button
            type='button'
            text='Añadir alumno'
            onClick={(e) => this.handleAddStudent(e)}
          />
        </div>
        <ul>
          {this.renderDocuments()}
        </ul>
      </div>
    )
  }
}

export default Documents
