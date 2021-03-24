import React from 'react'
import { withRouter } from 'react-router-dom'

import TimeAgo from 'javascript-time-ago'
import es from 'javascript-time-ago/locale/es'
import ReactTimeAgo from 'react-time-ago'

import {
  Alignment,
  Button,
  Classes,
  EditableText,
  Intent,
  Menu,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Tag,
  Tooltip,
  Switch,
  Popover,
  PopoverInteractionKind,
  Position,
} from "@blueprintjs/core"

import {
  RiFile3Line,
  RiFileLockFill,
  RiFolder5Fill,
  RiLock2Fill,
  RiLogoutCircleRLine,
  RiSave3Fill,
  RiTimeLine,
  RiUserSmileFill,
  RiQuestionLine,
} from 'react-icons/ri'

import IconSel from '../IconSel/IconSel'
import UserIcon from '../UserIcon/UserIcon'
import HelpDialog from '../HelpDialog/HelpDialog'

TimeAgo.addDefaultLocale(es)

class TopBar extends React.Component {
  constructor() {
    super()

    this.state = {
      isHelpDialogOpen: false,
    }
  }

  handleLogout = () => {
    localStorage.removeItem('seltoolstoken')
    localStorage.removeItem('seltoolsuserid')
    localStorage.removeItem('seltoolsuserfolder')

    this.props.history.push('/')
  }

  renderHelpDialog = () => {
    if (!this.state.isHelpDialogOpen) return false

    return(
      <HelpDialog
        handleCloseButton={() => this.setState({isHelpDialogOpen: false})}
      />
    )
  }

  render() {
    return(
      <>
        <Navbar
          fixedToTop={true}
          style={{
            background: 'var(--c-primary-lightest)',
          }}
        >
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
                    maxWidth: 'none',
                  }}
                  src="/assets/images/logo-seltools.png"
                  alt= "Seldocs"
                />
              </div>
            </NavbarHeading>
            <NavbarDivider />
            <div
              style={{marginLeft: '8px'}}
            >
              {!this.props.isLoading &&
                <ul className='bp3-overflow-list bp3-breadcrumbs'>
                  {this.props.breadcrumbs.map((crumb, i) => {
                    const icon =
                      crumb.name === 'Sel' ?
                      <IconSel /> :
                      crumb.type === 'folder' ?
                        <RiFolder5Fill size='1.2em' color={crumb.color || '#666'} /> :
                        crumb.type === 'teacher' ?
                          <UserIcon username={crumb.name} color={crumb.color} /> :
                          <RiFile3Line size='1.2em' color={crumb.color || '#666'} />

                    return (
                      <li key={`crumb-${crumb._id}`}>
                        <span
                          className={`bp3-breadcrumb ${this.props.breadcrumbs.length - 1 === i ? 'bp3-breadcrumb-current' : ''}`}
                          onClick={() => {
                            if (this.props.breadcrumbs.length - 1 !== i) {
                              this.props.history.push(`/documentos/${crumb._id}`)
                              if (!this.props.isDocument) this.props.getDocuments(crumb._id)
                            }
                          }}
                        >
                          {crumb.type === 'student' && 
                            <UserIcon username={crumb.name} color={crumb.color} />
                          }
                          {crumb.type !== 'student' && icon}
                          <span style={{marginLeft: '6px'}}>
                            {this.props.user.type === 'teacher' && crumb.type === 'document' &&
                              <EditableText
                                style={{color: 'black'}}
                                defaultValue={this.props.documentName}
                                placeholder='Nuevo documento'
                                confirmOnEnterKey={true}
                                onConfirm={(e) => this.props.handleNameInputConfirm(e)}
                              ></EditableText>
                            }
                            {this.props.user.type !== 'teacher' && crumb.type === 'document' &&
                              crumb.name
                            }
                            {crumb.type !== 'document' && 
                              crumb.name
                            }
                          </span>
                        </span>
                      </li>
                    )}
                  )}
                </ul>
              }
            </div>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            {!this.props.isStudent && this.props.connectedStudents &&
              <div
                style={{
                  display: 'flex',
                }}
              >
                {this.props.connectedStudents.map((student) => {
                  return(
                    <Tooltip
                      key={student._id}
                      content={student.username}
                      position={Position.BOTTOM}
                    >
                      <UserIcon username={student.username} color={student.color} />
                    </Tooltip>
                  )
                })}
                {this.props.connectedStudents.length > 0 &&
                  <NavbarDivider />
                }
              </div>
            }
            {this.props.isDocument && 
              <>
                {!this.props.isStudent && this.props.documentIsLocked &&
                  <>
                    <Button
                      className={`btn--lock ${Classes.MINIMAL}`}
                      intent={Intent.DANGER}
                      style={{marginRight: '8px', marginLeft: '8px'}}
                      icon={<RiFileLockFill size='1.2em' />}
                      // text="Desbloquear"
                      onClick={this.props.handleUnlock}
                    />
                    <Tag
                      className={Classes.MINIMAL}
                      intent={Intent.DANGER}
                      large='true'
                      icon={<RiTimeLine size='1.2em' />}
                    >
                      <ReactTimeAgo date={this.props.modifiedDate} locale="en-US"/>
                    </Tag>
                  </>
                }
                {this.props.isStudent && this.props.documentIsLocked && 
                  <Tag
                    className={Classes.Minimal}
                    intent={Intent.DANGER}
                    large='true'
                    icon={<RiLock2Fill size='1.2em' />}
                  >
                    Documento bloqueado
                  </Tag>
                }
                {!this.props.isStudent && !this.props.documentIsLocked &&
                  <div
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: '6px',
                      fontSize: '14px',
                      justifyContent: 'center',
                      padding: '6px 12px',
                      textAlign: 'left',
                      verticalAlign: 'middle',
                      lineHeight: '20px',
                      minHeight: '30px',
                      minWidth: '30px',
                      border: '1px solid rgba(24,32,38,.2)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Switch
                      style={{marginBottom: '0'}}
                      checked={this.props.documentIsShared}
                      label="Compartido"
                      onChange={this.props.handleShareDocument}
                    />
                  </div>
                }
                {!this.props.documentIsLocked &&
                  <Button
                    intent={this.props.documentName ? this.props.documentIsSaved ? Intent.SUCCESS : Intent.PRIMARY : Intent.DEFAULT}
                    loading={this.props.documentIsSaving}
                    style={{marginRight: '8px', marginLeft: '8px'}}
                    disabled={!this.props.documentName}
                    icon={<RiSave3Fill size='1.2em' />}
                    text={this.props.documentIsSaved ? "¡Guardado!" : "Guardar"}
                    onClick={(e) => this.props.handleSaveDocument(true)}
                  />
                }
                <NavbarDivider />
              </>
            }
            <RiQuestionLine
              className='openHelpButton'
              style={{
                marginRight: '10px',
              }}
              size='1.4em'
              onClick={() => this.setState({isHelpDialogOpen: true})}
              handleCloseButton={() => this.setState({isHelpDialogOpen: false})}
            />
            <Popover
                autoFocus={false}
                interactionKind={PopoverInteractionKind.HOVER}
                position={Position.BOTTOM_RIGHT}
                hoverOpenDelay={0}
                content={
                  <Menu
                    className={Classes.ELEVATION_2}
                  >
                    <MenuItem
                      icon={<RiLogoutCircleRLine size='1.2em' />}
                      text="Salir"
                      onClick={this.handleLogout}
                    />
                  </Menu>
                }
              >
                <RiUserSmileFill size='1.4em' />
              </Popover>
          </NavbarGroup>
        </Navbar>
        {this.renderHelpDialog()}
      </>
    )
  }
}

export default withRouter(TopBar)