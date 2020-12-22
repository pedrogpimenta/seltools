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
  Icon,
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

import IconSel from '../IconSel/IconSel'

TimeAgo.addDefaultLocale(es)

class TopBar extends React.Component {
  handleLogout = () => {
    localStorage.removeItem('seltoolstoken')
    localStorage.removeItem('seltoolsuserid')
    localStorage.removeItem('seltoolsuserfolder')

    this.props.history.push('/')
  }

  render() {
    return(
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
                      'folder-open' :
                      crumb.type === 'user' ?
                        <Icon icon='user' /> :
                        'document'

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
                            {crumb.name && crumb.name.substr(0, 1).toUpperCase()}
                          </div>
                        }
                        {crumb.type !== 'student' && 
                          <Icon
                            icon={icon}
                            color={crumb.color || '#666'}
                            className='bp3-icon'
                          />
                        }
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', 
                        width: '18px',
                        height: '18px',
                        backgroundColor: document.color || 'black',
                        color: 'white',
                        borderRadius: '50%',
                        marginRight: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        userSelect: 'none',
                      }}
                    >
                      {student.username.substr(0, 1).toUpperCase()}
                    </div>
                  </Tooltip>
                )
              })}
              <NavbarDivider />
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
                    icon="lock"
                    // text="Desbloquear"
                    onClick={this.props.handleUnlock}
                  />
                  <Tag
                    className={Classes.MINIMAL}
                    intent={Intent.DANGER}
                    large='true'
                    icon='time'
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
                  icon='lock'
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
                    borderRadius: '3px',
                    fontSize: '14px',
                    justifyContent: 'center',
                    padding: '5px 10px',
                    textAlign: 'left',
                    verticalAlign: 'middle',
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
                  icon="floppy-disk"
                  text={this.props.documentIsSaved ? "¡Guardado!" : "Guardar"}
                  onClick={(e) => this.props.handleSaveDocument(true)}
                />
              }
              <NavbarDivider />
            </>
          }
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
                    icon='log-out'
                    text="Salir"
                    onClick={this.handleLogout}
                  />
                </Menu>
              }
            >
              <Button className={Classes.MINIMAL} icon="user" />
            </Popover>
        </NavbarGroup>
      </Navbar>
    )
  }
}

export default withRouter(TopBar)