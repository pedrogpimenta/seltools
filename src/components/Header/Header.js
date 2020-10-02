import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  Alignment,
  Intent,
  Breadcrumbs,
  Breadcrumb,
  Button,
  Classes,
  EditableText,
  Icon,
  Popover,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Switch,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

class Header extends React.Component {

  handleStudentShare = (e, studentId) => {
    this.props.dispatch({
      type: 'CHANGE_SHAREDWITH',
      sharedWithStudent: studentId,
    })

    const documentObject = {
      _id: this.props.id,
      name: this.props.name,
    }

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/student/${studentId}/document`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
      })
  }

  handleNameInputConfirm = (e) => {
    if (e.trim() === '') return

    this.props.dispatch({
      type: 'CHANGE_DOCUMENT_NAME',
      name: e,
    })

    this.props.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 

    this.setState({
      showEditDialog: false,
    })
  }

  handleUnsaveDocument = () => {
    window.setInterval(() => {
      if (!this.props.isSaved) {
        this.handleSaveDocument()
      }
    }, 30000)
  }

  handleSaveDocument = () => {
    this.props.dispatch({
      type: 'DOCUMENT_IS_SAVING',
    })

    const documentObject = {
      name: this.props.name,
      files: this.props.files,
    }

    for (let file in documentObject.files) {
      for (let marker in documentObject.files[file].markers) {
        delete documentObject.files[file].markers[marker].hasFocus
      }
    }

    const requestOptions = {
      method: !this.props.id ? 'POST' : 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    const fetchUrl = !this.props.id
      ? `${REACT_APP_SERVER_BASE_URL}/document/`
      : `${REACT_APP_SERVER_BASE_URL}/document/${this.props.id}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        this.props.dispatch({
          type: 'CHANGE_DOCUMENT_ID',
          id: data.id,
        })

        this.props.dispatch({
          type: 'DOCUMENT_SAVED',
        })

        this.props.history.push(this.props.isStudent? `/alumno/documento/${data.id}` : `/documento/${data.id}`)
      })

  }

  renderCurrentBreadcrumb = ({ text, ...restProps }) => {
    return (
      <Breadcrumb>
        <Icon icon='document' color='#182026' />
        <EditableText
          style={{color: 'black'}}
          defaultValue={this.props.documentIsLoading ? 'Cargando...' : this.props.name}
          placeholder='Nuevo documento'
          confirmOnEnterKey={true}
          onConfirm={(e) => this.handleNameInputConfirm(e)}
        >
        </EditableText>
      </Breadcrumb>
    )
  }

  componentDidMount() {
    this.handleUnsaveDocument()
  }

  renderStudents = () => {
    if (this.props.sharedWith) {
      return this.props.students.map(student => {
        return (
          <li key={student._id} style={{display: 'block'}}>
            <Switch 
              label={student.name}
              defaultChecked={this.props.sharedWith.find(withStudent => withStudent._id === student._id)}
              onChange={(e) => this.handleStudentShare(e, student._id)}
            />
          </li>
        )
      })
    }
  }

  render() {
    return(
      <Navbar fixedToTop={true}>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading
            style={{
              marginRight: '8px'
            }}
          >
            <div style={{
              maxHeight: '44px',
              width: '43px',
              overflow: 'hidden',
            }}>
              <img 
                style={{
                  maxHeight: '44px',
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
            <Breadcrumbs
              currentBreadcrumbRenderer={this.props.isStudent ? null : this.renderCurrentBreadcrumb}
              items={[
                { href: this.props.isStudent ? '/alumno/documentos' : '/documentos',
                  icon: 'arrow-left',
                  text: 'Documentos',
                },
                {
                  icon: 'document',
                  text: this.props.name,
                },
              ]}
            />
          </div>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          {!this.props.isStudent &&
            <Popover
              boundary='viewport'
            >
              <Button 
                intent={Intent.PRIMARY}
                icon="share"
                text="Compartir"
                style={{marginRight: '2px', marginLeft: '2px'}}
              />
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: '16px',
                }}
              >
                {this.renderStudents()}
              </ul>
            </Popover>
          }
          <Button
            intent={this.props.name ? this.props.isSaved ? Intent.SUCCESS : Intent.PRIMARY : Intent.DEFAULT}
            loading={this.props.isSaving}
            style={{marginRight: '8px', marginLeft: '8px'}}
            disabled={!this.props.name}
            icon="floppy-disk"
            text={this.props.isSaved ? "¡Guardado!" : "Guardar"}
            onClick={(e) => this.handleSaveDocument(e)}
          />
          <NavbarDivider />
          <Button className={Classes.MINIMAL} icon="user" />
        </NavbarGroup>
      </Navbar>
    )
  }
}

function mapStateToProps(state) {
  return {
    id: state.id,
    name: state.name,
    files: state.files,
    students: state.students,
    sharedWith: state.sharedWith || [],
    isSaved: state.isSaved,
    isSaving: state.isSaving,
    editMode: state.editMode,
  }
}

export default connect(mapStateToProps)(withRouter(Header))



