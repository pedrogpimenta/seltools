import React from 'react'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { store } from '../../store/store'

import {
  Alignment,
  AnchorButton,
  Breadcrumbs,
  Button,
  Classes,
  Card,
  Icon,
  Intent,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

import TeacherStudents from '../TeacherStudents/TeacherStudents'

class Documents extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoadingStudents: true,
      isLoadingDocuments: true,
      userFolders: [],
      userDocuments: [],
      // documents: [],
      students: [],
      isUserAllowed: false,
      currentPath: [],
      currentPathName: [],
      breadcrumbs: [
        { icon: 'folder-open',
          text: 'Documentos',
        },
      ],
    }
  }

  auth = () => {
    if (this.state.isUserAllowed) return null

    const pass = window.prompt('¿Cuál es tu contraseña?')

    if (pass === 'amor') {
      this.setState({isUserAllowed: true})
      localStorage.setItem('isUserAllowed', true)
    }
  }

  getUser = (currentPath) => {
    console.log('get user,p ath:', currentPath)
    fetch(`${REACT_APP_SERVER_BASE_URL}/user/Selen${currentPath.length > 0 ? `/${currentPath.join('/')}` : ''}`)
      .then(response => response.json())
      .then(data => {

        this.setState({
          isLoadingStudents: false,
          // isLoadingDocuments: false,
          students: data.user.students || [],
          // userFolders: data.folders || [],
          // userDocuments: data.documents || [],
          // documents: data.documents || [],
        })
      })
  }
  
  getDocuments = (folderId) => {
    this.setState({
      isLoadingDocuments: true,
    })
    
    // const requestOptions = {
    //   method: 'GET',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({folder: folder})
    // }

    fetch(`${REACT_APP_SERVER_BASE_URL}/user/documents/${folderId}`)
      .then(response => response.json())
      .then(data => {
        let newBreadcrumbs = [{icon: 'folder-open', text: 'Documentos', id: 'Selen'}]

        if (newBreadcrumbs.length > 0) {
          newBreadcrumbs = data.breadcrumbs.map(crumb => {
            return({
              icon: 'folder-open',
              id: crumb._id,
              text: crumb.name,
            })
          })
        }

        // newBreadcrumbs.unshift({icon: 'folder-open', text: 'Documentos', id: 'Selen'})
        // if (data.folder.name !== 'Selen') {
          newBreadcrumbs.push({icon: 'folder-open', text: data.folder.name, id: data.folder._id})
        // }

        this.setState({
          isLoadingDocuments: false,
          userDocuments: data.documents || [],
          breadcrumbs: newBreadcrumbs,
        })

        this.props.history.push(`/documentos/${folderId}`)
      })
  }

  renderStudents = () => {
    if (this.state.isLoadingStudents) return <div>Cargando...</div>

    if (this.state.students < 1) return <div>No tienes estudiantes, añade uno:</div>

    return this.state.students.sort((a, b) => a.name > b.name ? 1 : -1).map(student => (
      <li
        key={student._id}
      >
        {/* <div
          style={{padding: '4px 0'}}
        > */}
        <Card
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '8rem',
            padding: '8px',
            marginBottom: '12px',
          }}
        >
          <Icon
            icon='user'
            style={{marginRight: '6px'}}
          />
            {student.name}
        </Card>
        {/* </div> */}
      </li>
    ))
  }

  handleAddStudent = () => {
    const studentName = window.prompt('¿Cómo se llama tu nuevo alumno?')

    if (!!studentName && studentName.length > 0) {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: studentName})
      }

      const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/student/`

      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then((data) => {
          const updatedStudents = this.state.students.slice()
          updatedStudents.push({_id: data._id, name: data.name})
          this.setState({
            students: updatedStudents,
          })
        })
    }
  }

  handleDeleteDocument = (documentId) => {
    const confirmDelete = window.confirm('¿Quieres eliminar el documento?')

    if (confirmDelete) {
      const requestOptions = {
        method: 'DELETE',
      }

      const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${documentId}`

      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          const currentDocuments = [...this.state.documents]
          const index = currentDocuments.findIndex((document) => document._id === documentId)

          if (index !== -1) {
            currentDocuments.splice(index, 1)
          }

          this.setState({
            documents: currentDocuments,
          })
        })
    }
  }

  handleAddFolder = () => {
    const folderName = window.prompt('¿Qué nombre tiene la nueva carpeta?')

    if (!!folderName && folderName.length > 0) {
      const parent = this.state.breadcrumbs[this.state.breadcrumbs.length - 1].id
      const level = this.state.breadcrumbs.length

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: folderName, parent: parent, username: 'Selen'})
      }

      const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/userfolder/`

      fetch(fetchUrl, requestOptions)
        .then(response => response.json())
        .then((data) => {
          // const updatedDocuments = this.state.students.slice()
          // updatedStudents.push({_id: data._id, name: data.name})
          console.log('data:', data)

          this.setState({
            // userFolders: data.folders,
            userDocuments: data,
          })
        })
    }
  }

  renderDocuments = () => {
    if (this.state.isLoadingDocuments) return <div>Cargando...</div>

    if (this.state.userDocuments.length < 1 && this.state.userFolders.length < 1) return <div>Aún no tienes ningún documento. Empieza haciendo un nuevo: <Link to='/documento' isNew={true}>Nuevo documento</Link></div>

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridGap: '20px',
        }}
      >
        {/* {this.state.currentPath.length === 0 && this.renderStudents()} */}
        {/* {this.state.userFolders.map(document => {
          return (
            <li
              key={document._id}
              className='folder-item'
            >
            <Card
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                height: '8rem',
                padding: '16px',
              }}
              onClick={() => {
                // const newPath = this.state.currentPath
                // newPath.push(document._id)
                // const newPathName = this.state.currentPathName
                // newPathName.push(document.name)
                // const newBreadcrumbs = this.state.breadcrumbs
                // newBreadcrumbs.push(
                //   { icon: 'folder-open',
                //     text: document.name,
                //     id: document._id,
                //   })
                // this.setState({currentPath: newPath, currentPathName: newPathName, breadcrumbs: newBreadcrumbs})
                this.getDocuments(document._id)
              }}
            >
              <Icon
                icon='folder-close'
                iconSize={Icon.SIZE_LARGE} 
                style={{
                  marginRight: '6px'}}
              />
              <h2 style={{fontWeight: '400', margin: '8px 0 0 0'}}>
                {!!document.name.trim().length ? document.name : 'Documento sin nombre' }
              </h2>
            </Card>
          </li>
          )
        })} */}
        {this.state.userDocuments.map(document => {
          const docType = document.type || 'document'
  
          return (
            <li className='document-item' key={document._id}>
              <Card
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  height: '8rem',
                  padding: '16px',
                }}
                onClick={(e) => {
                  if (docType === 'document') {
                    window.open(`/documento/${document._id}`, '_blank')
                  } else {
                    this.getDocuments(document._id)
                  }
                }}
              >
                {docType === 'document' &&
                  <Icon
                    icon='document'
                    iconSize={Icon.SIZE_LARGE} 
                    style={{
                      marginRight: '6px'}}
                  />
                }
                {docType === 'folder' &&
                  <Icon
                    icon='folder-close'
                    iconSize={Icon.SIZE_LARGE} 
                    style={{
                      marginRight: '6px'}}
                  />
                }
                <h2 style={{fontWeight: '400', margin: '8px 0 0 0'}}>
                  {!!document.name.trim().length ? document.name : 'Documento sin nombre' }
                </h2>
                {/* <Button
                  type='button'
                  icon='delete'
                  intent={Intent.PRIMARY}
                  className={`button__delete-document ${Classes.MINIMAL}`}
                  text='Eliminar'
                  onClick={(e) => this.handleDeleteDocument(document._id)}
                /> */}
              </Card>
            </li>
          )
        })}
      </div>
    )
  }


  componentDidMount = () => {
    store.dispatch({
      type: 'LOAD_FILES',
      files: [],
      filesOnLoad: [],
    })

    if (!localStorage.getItem('isUserAllowed')) {
      this.auth()
    }

    if (localStorage.getItem('isUserAllowed')) {
      console.log('params:', this.props.match.params)
      this.getDocuments(this.props.match.params.folder || 'Selen')
      this.getUser([])
    }
  }

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
              <NavbarHeading
                style={{
                  marginRight: '8px'
                }}
              >
                <div style={{
                  maxHeight: '44px'
                }}>
                  <img 
                    style={{
                      maxHeight: '44px'
                    }}
                    src="/assets/images/logo-seltools.png"
                    alt= "Seltools"
                  />
                </div>
              </NavbarHeading>
              <NavbarDivider />
              <div
                style={{marginLeft: '8px'}}
              >
                <ul className='bp3-overflow-list bp3-breadcrumbs'>
                  {this.state.breadcrumbs.map((crumb, i) => {
                    if (this.state.breadcrumbs.length - 1 === i) {
                      return (
                        <li>
                          <span className={`bp3-breadcrumb bp3-breadcrumb-current`}>
                            <Icon icon='folder-open' className='bp3-icon' />
                            {crumb.text}
                          </span>
                        </li>
                      )
                    } else {
                      return (
                        <li style={{cursor: 'pointer'}}>
                          <span className='bp3-breadcrumb' onClick={() => {
                            this.getDocuments(crumb.id)
                          }}>
                            <Icon icon='folder-open' className='bp3-icon' />
                            {crumb.text}
                          </span>
                        </li>
                      )

                    }}
                  )}
                </ul>
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
                  width: '75%',
                  paddingRight: '16px',
                }}
              >
                {/* {this.state.currentPath.length === 0 &&
                  <TeacherStudents
                    students={this.state.students}
                    isLoading={this.state.isLoadingStudents}
                    handleAddStudent={this.handleAddStudent}
                  />
                } */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {/* <h1>Documentos</h1> */}
                  <AnchorButton
                    type='button'
                    icon='add'
                    intent={Intent.PRIMARY}
                    text='Nuevo documento'
                    href={`/documento?parent=${this.props.match.params.folder}`}
                    target='_blank'
                  />
                  <Button
                    type='button'
                    icon='add'
                    intent={Intent.PRIMARY}
                    text='Nueva carpeta'
                    onClick={this.handleAddFolder}
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// export default Documents
export default withRouter(Documents)
