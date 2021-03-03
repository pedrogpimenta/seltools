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

class MoveDialog extends React.Component {
  constructor() {
    super()

    this.state = {
      name: '',
      email: '',
    }
  }

  // componentDidMount = () => {
  //   this.getCurrentDialogContent(this.props.initialFolder)
  // }

  handleAddStudent = () => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        teacherId: localStorage.getItem('seltoolsuserid'),
        teacherFolder: localStorage.getItem('seltoolsuserfolder'),
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
      },
    }

    const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/newStudent`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then((data) => {
        this.props.getDocuments(localStorage.getItem('seltoolsuserfolder'))
      })
  }

  render() {
    return (
      <>
        <Dialog
          title={`Añadir estudiante`}
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
            <div
              style={{
                // display: 'flex',
                // flexDirection: 'column',
                // width: '100%',
                // minHeight: '100px',
                // background: 'white',
                // borderRadius: '4px',
              }}
            >
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
                    placeholder="Sara"
                    onChange={(e) => this.setState({name: e.target.value})}
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
                    placeholder="email@ejemplo.com"
                    onChange={(e) => this.setState({email: e.target.value})}
                  />
                </FormGroup>
              </form>
            </div>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                intent={Intent.PRIMARY}
                onClick={() => {
                  this.handleAddStudent()
                  this.props.handleCloseButton()
                }}
              >
                Añadir {this.state.name}
              </Button>
            </div>
          </div>
        </Dialog>
      </>
    )
  }
}

// export default withRouter(Dialog)
export default MoveDialog