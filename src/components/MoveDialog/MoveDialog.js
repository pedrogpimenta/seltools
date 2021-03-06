import React from 'react'

import {
  Button,
  Classes,
  Dialog,
  Intent,
  Spinner,
} from "@blueprintjs/core"

import {
  RiFile3Line,
  RiFolderFill,
  RiFolder5Fill,
} from 'react-icons/ri'

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'
import IconSel from '../IconSel/IconSel'
import UserIcon from '../UserIcon/UserIcon'

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

        const folders = data.documents.filter(doc => doc.type === 'folder').sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name.toUpperCase() > b.name.toUpperCase() ? 1 : 0)
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
                    const icon =
                      crumb.name === 'Sel' ?
                      <IconSel /> :
                      crumb.type === 'folder' ?
                        <RiFolder5Fill size='1.2em' color={crumb.color || '#666'} style={{marginRight: '5px'}} /> :
                        crumb.type === 'teacher' ?
                          <UserIcon username={crumb.name} color={crumb.color} /> :
                          <RiFile3Line size='1.2em' color={crumb.color || '#666'} style={{marginRight: '5px'}} />

                    return (
                      <li key={`menuitem-${crumb._id}`}>
                        <span
                          className={`bp3-breadcrumb ${this.state.breadcrumbs.length - 1 === i ? 'bp3-breadcrumb-current' : ''}`}
                          onClick={() => {
                            this.getCurrentDialogContent(crumb._id)
                          }}
                        >
                          {crumb.type === 'student' && 
                            <UserIcon username={crumb.name} color={crumb.color} />
                          }
                          {crumb.type !== 'student' && icon}
                          <span style={{marginLeft: '4px'}}>
                            {crumb.name}
                          </span>
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
                            <span style={{flexShrink: 0}}><UserIcon username={student.name} color={student.color} /></span>
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
                            <RiFolderFill size='1.2em' color={doc.color || '#888'} />
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
                          <RiFile3Line size='1.2em' color={doc.color || '#666'} style={{opacity: '.4'}} />
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