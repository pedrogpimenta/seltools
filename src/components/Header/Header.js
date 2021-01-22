import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import TimeAgo from 'javascript-time-ago'
import es from 'javascript-time-ago/locale/es'

import ReactTimeAgo from 'react-time-ago'

import {
  Alignment,
  Intent,
  Button,
  Classes,
  EditableText,
  Icon,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Tag,
  Switch,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

import IconSel from '../IconSel/IconSel'

TimeAgo.addDefaultLocale(es)
class Header extends React.Component {
  handleShareDocument = () => {
    const documentObject = {
      shared: !this.props.shared,
    }

    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(documentObject)
    }

    let fetchUrl = `${REACT_APP_SERVER_BASE_URL}/document/${this.props.id}`

    fetch(fetchUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
          this.props.dispatch({
            type: 'CHANGE_DOCUMENT_SHARED',
            shared: data.document.shared,
          })

        })
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
        this.props.handleSaveDocument(true)
      }
    }, 10000)
  }


  // componentDidMount() {
  //   this.handleUnsaveDocument()
  // }

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
            <ul className='bp3-overflow-list bp3-breadcrumbs'>
              {this.props.breadcrumbs.map((crumb, i) => {
                const icon = crumb.type === 'folder' ? 'folder-open' : crumb.type === 'document' ? 'document' : <IconSel />
                if (this.props.breadcrumbs.length - 1 === i) {
                  return (
                    <li>
                      <span className={`bp3-breadcrumb bp3-breadcrumb-current`}>
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
                              fontWeight: 'bold',
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
                          {this.props.isStudent &&
                            this.props.name
                          }
                          {!this.props.isStudent &&
                            <EditableText
                              style={{color: 'black'}}
                              defaultValue={this.props.name}
                              placeholder='Nuevo documento'
                              confirmOnEnterKey={true}
                              onConfirm={(e) => this.handleNameInputConfirm(e)}
                            ></EditableText>
                          }
                      </span>
                    </li>
                  )
                } else {
                  return (
                    <li style={{cursor: 'pointer'}}>
                      <span className='bp3-breadcrumb' onClick={() => {
                        this.props.history.push(this.props.isStudent ? `/alumno/documentos/${crumb._id}` : `/documentos/${crumb._id}`)
                      }}>
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
                              fontWeight: 'bold',
                            }}
                          >
                            {crumb.text.substr(0, 1).toUpperCase()}
                          </div>
                        }
                        {crumb.type !== 'student' && 
                          <Icon
                            icon={icon}
                            color={crumb.color || '#999'}
                            className='bp3-icon'
                          />
                        }
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
          {!this.props.isStudent && !this.props.isLocked &&
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
                checked={this.props.shared}
                label="Compartido"
                onChange={this.handleShareDocument}
              />
            </div>
          }
          {this.props.isLocked && this.props.isStudent &&
            <Tag
              className={Classes.Minimal}
              intent={Intent.DANGER}
              large='true'
              icon='lock'
            >
              Documento bloqueado
            </Tag>
          }
          {!this.props.isLocked &&
            <Button
              intent={this.props.name ? this.props.isSaved ? Intent.SUCCESS : Intent.PRIMARY : Intent.DEFAULT}
              loading={this.props.isSaving}
              style={{marginRight: '8px', marginLeft: '8px'}}
              disabled={!this.props.name}
              icon="floppy-disk"
              text={this.props.isSaved ? "¡Guardado!" : "Guardar"}
              onClick={(e) => this.props.handleSaveDocument(true)}
            />
          }
          {this.props.isLocked && !this.props.isStudent &&
            <>
              <Button
                className={`btn--lock ${Classes.MINIMAL}`}
                intent={Intent.DANGER}
                style={{marginRight: '8px', marginLeft: '8px'}}
                icon="lock"
                text="Desbloquear"
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
    breadcrumbs: state.breadcrumbs || [],
    files: state.files,
    students: state.students,
    shared: state.shared || false,
    isSaved: state.isSaved,
    isSaving: state.isSaving,
    locked: state.locked,
    isLocked: state.isLocked,
    lockedBy: state.lockedBy,
    editMode: state.editMode,
    modifiedDate: state.modifiedDate,
  }
}

export default connect(mapStateToProps)(withRouter(Header))