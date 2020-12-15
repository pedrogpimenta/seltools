import React from 'react'

import {
  Button,
  Classes,
  Dialog,
  Icon,
  Intent,
  Spinner,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'
import IconSel from '../IconSel/IconSel'

class MoveDialog extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoading: true,
      students: [],
      folders: [],
      documents: [],
      breadcrumbs: [],
      folder: [],
    }
  }

  getCurrentDialogContent = (folderId) => {
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

    let fetchUrl = localStorage.getItem('seltoolsuserfolder') === folderId ?
      `${REACT_APP_SERVER_BASE_URL}/user/${this.props.user._id}/documents/${folderId}?isTeacherFolder=true` :
      `${REACT_APP_SERVER_BASE_URL}/user/${this.props.user._id}/documents/${folderId}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        const newBreadcrumbs = data.breadcrumbs
        newBreadcrumbs.push({icon: 'folder-open', name: data.folder.name, _id: data.folder._id, type: data.folder.type, color: data.folder.color})
        if (this.props.user.type === 'student') {
          newBreadcrumbs.shift()
        }

        const folders = data.documents.filter(doc => doc.type === 'folder')
        const documents = data.documents.filter(doc => doc.type === 'document')
        const folder = newBreadcrumbs[newBreadcrumbs.length - 1]

        this.setState({
          isLoading: false,
          students: data.students,
          folders: folders,
          documents: documents,
          breadcrumbs: newBreadcrumbs,
          folder: folder,
        })
      })
  }

  componentDidMount = () => {
    this.getCurrentDialogContent(this.props.initialFolder)
  }

  render() {
    const {
      selectedDocumentId,
      selectedDocumentName,
    } = this.props

    return (
      <>
        <Dialog
          title={`Mover "${selectedDocumentName}" a:`}
          isOpen={true}
          onClose={() => this.props.handleCloseButton()}
          style={{
            alignSelf: 'flex-start',
            width: '1000px',
            maxWidth: '100%',
            // maxHeight: '80vh',
          }}
        >
          {this.state.isLoading &&
            <Spinner 
              style={{
                background: 'red',
              }}
            />
          }
          <div
            className={Classes.DIALOG_BODY}
            style={{
              // maxHeight: '70vh',
            }}
          >
            <div
              style={{marginLeft: '8px', marginBottom: '8px'}}
            >
              <ul className='bp3-overflow-list bp3-breadcrumbs'>
                {this.state.breadcrumbs.map((crumb, i) => {
                    const icon = crumb.type === 'folder' ? 'folder-open' : <IconSel />
                    return (
                      <li key={`menuitem-${crumb}`}>
                        <span
                          className={`bp3-breadcrumb ${this.state.breadcrumbs.length - 1 === i ? 'bp3-breadcrumb-current' : ''}`}
                          onClick={() => {
                            this.getCurrentDialogContent(crumb._id)
                          }}
                        >
                          {crumb.type === 'student' && 
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', 
                                width: '18px',
                                height: '18px',
                                backgroundColor: crumb.color || 'black',
                                color: 'white',
                                borderRadius: '50%',
                                marginRight: '6px',
                                fontSize: '12px',
                                fontWeight: '700',
                              }}
                            >
                              {crumb.name.substr(0, 1).toUpperCase()}
                            </div>
                          }
                          {crumb.type !== 'student' && 
                            <Icon
                              icon={icon}
                              color={crumb.color || '#666'}
                              className='bp3-icon'
                            />
                          }
                          {crumb.name}
                        </span>
                      </li>
                    )}
                )}
              </ul>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minHeight: '100px',
                background: 'white',
                borderRadius: '4px',
              }}
              interactive={false}
              striped={false}
            >
              {!!this.state.students.length && 
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    padding: '8px',
                  }}
                  interactive={true}
                  striped={true}
                >
                    {this.state.students.map((student) => {
                      return (
                        <div
                          key={`movedialog-${student._id}`}
                          style={{
                            width: '20%',
                            padding: '6px',
                          }}
                          onClick={() => {
                            this.getCurrentDialogContent(student._id)
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '10px 8px',
                              boxShadow: '0 0 2px 0 gray',
                              cursor: 'pointer',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', 
                                width: '18px',
                                height: '18px',
                                backgroundColor: student.color || 'black',
                                color: 'white',
                                borderRadius: '50%',
                                marginRight: '6px',
                                fontSize: '12px',
                                fontWeight: '700',
                              }}
                            >
                              {student.name.substr(0, 1).toUpperCase()}
                            </div>
                            <span
                              style={{
                                marginLeft: '6px',
                                userSelect: 'none',
                              }}
                            >{student.name}</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              }
              {!!this.state.folders.length &&
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    padding: '8px',
                  }}
                  interactive={true}
                  striped={true}
                >
                    {this.state.folders.map((doc) => {
                      return (
                        <div
                          key={`movedialog-${doc._id}`}
                          style={{
                            width: '20%',
                            padding: '6px',
                          }}
                          onClick={() => {
                            this.getCurrentDialogContent(doc._id)
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '10px 8px',
                              boxShadow: '0 0 2px 0 gray',
                              cursor: 'pointer',
                            }}
                          >
                            <Icon
                              icon='folder-close'
                              color={doc.color || '#666'}
                            />
                            <span
                              style={{
                                marginLeft: '8px',
                                userSelect: 'none',
                              }}
                            >
                              {doc.name}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              }
              {!!this.state.documents.length &&
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    padding: '8px',
                  }}
                  interactive={true}
                  striped={true}
                >
                  {this.state.documents.map((doc) => {
                    return (
                      <div
                        key={`movedialog-${doc._id}`}
                        style={{
                          width: '20%',
                          padding: '6px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 8px',
                            boxShadow: '0 0 2px 0 gray',
                          }}
                        >
                          <Icon
                            icon='document'
                            color={doc.color || '#666'}
                          />
                          <span
                            style={{
                              marginLeft: '8px',
                              userSelect: 'none',
                              opacity: '.4',
                            }}
                          >
                            {doc.name}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              }
            </div>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                intent={Intent.PRIMARY}
                onClick={() => {
                  this.props.handleMoveDocument(this.state.folder._id, selectedDocumentId)
                  this.props.handleCloseButton()
                }}
              >
                Mover a "{this.state.folder.name}"
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