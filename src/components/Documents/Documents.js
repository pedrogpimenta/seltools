import React from 'react'
import { Link } from 'react-router-dom'
import { store } from '../../store/store'

import {
  Alignment,
  AnchorButton,
  Breadcrumbs,
  Button,
  Card,
  Icon,
  Intent,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

// import Button from '../Button/Button'

class Documents extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoadingStudents: true,
      isLoadingDocuments: true,
      documents: [],
      students: [],
      isUserAllowed: false,
    }
  }

  auth = () => {
    if (this.state.isUserAllowed) return null

    const pass = window.prompt('Cual es tu contraseña?')

    if (pass === 'amor') {
      this.setState({isUserAllowed: true})
      localStorage.setItem('isUserAllowed', true)
    }
  }

  getUser = () => {
    fetch(`${REACT_APP_SERVER_BASE_URL}/user/Selen`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoadingStudents: false,
          students: data[0].students || [],
        })
      })
  }

  getDocuments = () => {
    fetch(`${REACT_APP_SERVER_BASE_URL}/documents`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoadingDocuments: false,
          documents: data || [],
        })
      })
  }

  handleAddStudent = () => {
    const studentName = window.prompt('Como se llama tu nuevo alumno?')

    if (!!studentName && studentName.length > 0) {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: studentName})
      }

      const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/student/`

      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
        })
    }
  }

  renderDocuments = () => {
    if (this.state.isLoadingDocuments) return <div>Cargando...</div>

    if (this.state.documents.length < 1) return <div>Aun no tienes ningun documento. Empieza haciendo un nuevo: <Link to='/documento' isNew={true}>Nuevo documento</Link></div>

    return this.state.documents.map(document => (
      <li key={document._id}>
        <Card
          style={{
            padding: '8px',
            marginBottom: '12px',
          }}
        >
            <Link to={`/documento/${document._id}`}>{document.name}</Link>
        </Card>
      </li>
    ))
  }

  renderStudents = () => {
    if (this.state.isLoadingStudents) return <div>Cargando...</div>

    if (this.state.students < 1) return <div>No tienes estudiantes, añade uno:</div>

    return this.state.students.map(student => (
      <li key={student._id}>
        <div
          style={{padding: '4px 0'}}
        >
          <Icon
            icon='user'
            style={{marginRight: '6px'}}
          />
            {student.name}
          </div>
      </li>
    ))
  }

  componentDidMount = () => {
    // if (localStorage.getItem('isUserAllowed')) this.setState({isUserAllowed: true})

    store.dispatch({
      type: 'LOAD_FILES',
      files: [],
      filesOnLoad: [],
    })

    if (!localStorage.getItem('isUserAllowed')) {
      this.auth()
    }

    if (localStorage.getItem('isUserAllowed')) {
      this.getDocuments()
      this.getUser()
    }
  }

  // componentDidUpdate = () => {
  //   if (this.state.isUserAllowed) {
  //     this.getDocuments()
  //     this.getUser()
  //   }
  // }

  render() {
    if (!localStorage.getItem('isUserAllowed')) return <div>No eres Selen!</div>

    return (
      <div
        className='App'
        style={{
          display: 'flex',
          overflow: 'hidden',
          cursor: this.props.dragging ? 'grabbing' : 'default',
        }}
      >
        <div
          style={{
            width: '100%',
            cursor: this.props.dragging ? 'grabbing' : 'default',
          }}
        >
          <Navbar fixedToTop={true}>
            <NavbarGroup align={Alignment.LEFT}>
              <NavbarHeading>Seltools</NavbarHeading>
              <NavbarDivider />
              <div
                style={{marginLeft: '8px'}}
              >
                <Breadcrumbs
                  // currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
                  items={[
                    { icon: 'folder-open',
                      text: 'Documentos',
                    },
                  ]}
                />
              </div>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
              {/* <NavbarDivider />
              <Button className={Classes.MINIMAL} icon="user" /> */}
            </NavbarGroup>
          </Navbar>
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              paddingTop: '70px',
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
              >
              <div
                style={{
                  width: '70%',
                  paddingRight: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                <h1>Documentos</h1>
                <AnchorButton
                  type='button'
                  icon='add'
                  intent={Intent.PRIMARY}
                  text='Nuevo documento'
                  href='/documento'
                />
                </div>
                <ul style={{
                  margin: '8px 0 32px',
                  padding: '0',
                  listStyle: 'none'
                }}>
                  {this.renderDocuments()}
                </ul>
              </div>
              <div
                style={{
                  width: '20%',
                  minWidth: '200px',
                }}
              >
                <Card
                  style={{
                    padding: '1px 16px 16px',
                    marginTop: '81px',
                    marginBottom: '12px',
                  }}
                >
                  <h3>Alumnos</h3>
                  <div>
                    <ul style={{margin: '0', padding: '0', listStyle: 'none'}}>
                      {this.renderStudents()}
                    </ul>
                  </div>
                  <Button
                    type='button'
                    icon='add'
                    intent={Intent.PRIMARY}
                    text='Añadir alumno'
                    onClick={(e) => this.handleAddStudent(e)}
                    style={{marginTop: '16px'}}
                    />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Documents
