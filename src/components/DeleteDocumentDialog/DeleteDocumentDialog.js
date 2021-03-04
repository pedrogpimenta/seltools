import React from 'react'
import { withRouter } from 'react-router-dom'

import {
  Button,
  Classes,
  Dialog,
  Intent,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

class DeleteDocumentDialog extends React.Component {
  handleDeleteDocument = () => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('seltoolstoken')}`,
      },
    }

    const fetchUrl = `${REACT_APP_SERVER_BASE_URL}/student/${this.props.selectedDocumentId}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(() => {
        if (!this.props.match.params.folder) {
          this.props.getDocuments(this.props.user.userfolder)
        } else {
          this.props.getDocuments(this.props.match.params.folder)
        }
      })
  }

  render() {
    return (
      <>
        <Dialog
          title={`Eliminar ${this.props.selectedDocumentName}`}
          isOpen={true}
          onClose={() => this.props.handleCloseButton()}
          style={{
            alignSelf: 'flex-start',
            width: '500px',
            maxWidth: '100%',
          }}
        >
          <div
            className={Classes.DIALOG_BODY}
          >
            <div>
              <p>Estás a punto de eliminar "{this.props.selectedDocumentName}"
              {(this.props.selectedDocumentType === 'folder' || this.props.selectedDocumentType === 'student') &&
                <span> y todos sus documentos y carpetas.</span> 
              }
              </p>
              <p>Este proceso es <strong>irreversible</strong>.</p>
            </div>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                onClick={() => {
                  this.props.handleCloseButton()
                }}
              >
                No, cancelar
              </Button>
              <Button
                intent={Intent.PRIMARY}
                onClick={() => {
                  this.handleDeleteDocument()
                  this.props.handleCloseButton()
                }}
              >
                Eliminar {this.props.selectedDocumentName}
              </Button>
            </div>
          </div>
        </Dialog>
      </>
    )
  }
}

export default withRouter(DeleteDocumentDialog)