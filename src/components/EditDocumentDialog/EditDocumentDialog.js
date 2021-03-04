import React from 'react'

import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Intent,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

class EditDocumentDialog extends React.Component {
  constructor() {
    super()

    this.state = {
      student: {
        _id: null,
        username: '',
        email: '',
      }
    }
  }

  componentDidMount = () => {
    this.getCurrentDialogContent(this.props.selectedDocumentId)
  }

  handleEditStudent = () => {
    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify({
        username: this.state.student.username,
        email: this.state.student.email,
        userfolder: this.state.student.userfolder,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
      },
    }

    const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/student/${this.state.student._id}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then((data) => {
        this.props.getDocuments(localStorage.getItem('seltoolsuserfolder'))
      })
  }

  getCurrentDialogContent = (documentId) => {
    this.setState({
      isLoading: true,
    })

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
      },
    }

    let fetchUrl = `${REACT_APP_SERVER_BASE_URL}/student/${documentId}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('data:', data)
        this.setState({
          student: data,
        })
      })
  }

  render() {
    return (
      <>
        <Dialog
          title={`Editar estudiante: ${this.state.student.username}`}
          isOpen={true}
          onClose={() => this.props.handleCloseButton()}
          style={{
            alignSelf: 'flex-start',
            width: '500px',
            maxWidth: '100%',
            // maxHeight: '80vh',
          }}
        >
          <div
            className={Classes.DIALOG_BODY}
          >
            <div>
              <form
                action="submit"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <FormGroup
                  label="Nombre del alumno"
                  labelFor="name-input"
                >
                  <InputGroup
                    id="name-input"
                    type="text"
                    value={this.state.student.username}
                    onChange={(e) => this.setState({
                      student: {
                        ...this.state.student,
                        username: e.target.value,
                      }
                    })}
                  />
                </FormGroup>
                <FormGroup
                  label="Email del alumno"
                  labelFor="email-input"
                  style={{
                    margin: '8px 0',
                  }}
                >
                  <InputGroup
                    id="email-input"
                    type="email"
                    value={this.state.student.email}
                    onChange={(e) => this.setState({
                      student: {
                        ...this.state.student,
                        email: e.target.value,
                      }
                    })}
                  />
                </FormGroup>
              </form>
            </div>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                onClick={() => {
                  this.props.handleCloseButton()
                }}
              >
                Cancelar
              </Button>
              <Button
                intent={Intent.PRIMARY}
                onClick={() => {
                  this.handleEditStudent()
                  this.props.handleCloseButton()
                }}
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        </Dialog>
      </>
    )
  }
}

export default EditDocumentDialog