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
      documents: [],
      breadcrumbs: [],
      students: [],
      folder: [],
    }
  }

  getCurrentDialogContent = (folderId) => {
    this.setState({
      isLoading: true,
    })

    fetch(`${REACT_APP_SERVER_BASE_URL}/user/${'5f3633a4e93634d14b1df842'}/documents/${folderId}`)
      .then(response => response.json())
      .then(data => {
        let dialogBreadcrumbs = [{
          icon: <IconSel />,
          text: this.props.user.name,
          id: this.props.user._id,
          type: 'folder',
        }]

        if (dialogBreadcrumbs.length > 0) {
          dialogBreadcrumbs = data.breadcrumbs.map(crumb => {
            return({
              icon: 'folder-open',
              id: crumb._id,
              text: crumb.name,
              type: crumb.type,
              color: crumb.color
            })
          })
        }

        dialogBreadcrumbs.push({icon: 'folder-open', text: data.folder.name, id: data.folder._id, type: data.folder.type,  color: data.folder.color})
      
        if (dialogBreadcrumbs[0].type === 'student') {
          dialogBreadcrumbs.unshift({icon: 'folder-open', text: this.props.user.name, id: this.state.user.userfolder, type: 'folder'})
        }

        this.setState({
          isLoading: false,
          students: data.students || [],
          folder: data.folder || [],
          documents: data.documents || [],
          breadcrumbs: dialogBreadcrumbs || [],
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
            width: '1000px',
            maxWidth: '100%',
            maxHeight: '80vh',
          }}
        >
          {this.state.isLoading &&
            <Spinner 
              style={{
                background: 'red',
              }}
            />
          }
          <div className={Classes.DIALOG_BODY}>
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
                            this.getCurrentDialogContent(crumb.id)
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
                              {crumb.text.substr(0, 1).toUpperCase()}
                            </div>
                          }
                          {crumb.type !== 'student' && 
                            <Icon
                              icon={icon}
                              color={crumb.color || '#666'}
                              className='bp3-icon'
                            />
                          }
                          {crumb.text}
                        </span>
                      </li>
                    )}
                )}
              </ul>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                width: '100%',
                background: 'white',
                borderRadius: '4px',
                padding: '8px',
                minHeight: '100px',
                maxHeight: 'calc(100vh - 340px)',
                overflow: 'auto',
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
                {this.state.documents.map((doc) => {
                  return (
                    <div
                      key={`movedialog-${doc._id}`}
                      style={{
                        width: '20%',
                        padding: '6px',
                        pointerEvents: doc.type === 'document' ? 'none' : 'all',
                      }}
                      onClick={() => {
                        if (doc.type === 'document') return false
                        this.getCurrentDialogContent(doc._id)
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 8px',
                          boxShadow: '0 0 2px 0 gray',
                          cursor: doc.type === 'folder' ? 'pointer' : 'default',
                        }}
                      >
                        <Icon
                          icon={doc.type === 'document' ? 'document' : 'folder-close'}
                          color={doc.color || '#666'}
                        />
                        <span
                          style={{
                            marginLeft: '8px',
                            userSelect: 'none',
                            opacity: doc.type === 'document' ? '.4' : '1',
                          }}
                        >
                          {doc.name}
                        </span>
                      </div>
                    </div>
                  )
                })}
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