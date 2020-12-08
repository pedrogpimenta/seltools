import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

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

import IconSel from '../IconSel/IconSel'

class TopBar extends React.Component {
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
                alt= "Seltools"
              />
            </div>
          </NavbarHeading>
          <NavbarDivider />
          <div
            style={{marginLeft: '8px'}}
          >
            {!this.props.isLoadingDocuments &&
              <ul className='bp3-overflow-list bp3-breadcrumbs'>
                {this.props.breadcrumbs.map((crumb, i) => {
                  const icon = crumb.type === 'folder' ? 'folder-open' : <IconSel />
                  return (
                    <li key={`crumb-${crumb.id}`}>
                      <span
                        className={`bp3-breadcrumb ${this.props.breadcrumbs.length - 1 === i ? 'bp3-breadcrumb-current' : ''}`}
                        onClick={() => {
                          this.props.breadcrumbs.length - 1 !== i && this.props.history.push(`/documentos/${crumb.id}`)
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
            }
          </div>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
        </NavbarGroup>
      </Navbar>
    )
  }
}

function mapStateToProps(state) {
  return {
    // id: state.id,
    // name: state.name,
    // breadcrumbs: state.breadcrumbs || [],
    // files: state.files,
    // students: state.students,
    // shared: state.shared || false,
    // isSaved: state.isSaved,
    // isSaving: state.isSaving,
    // locked: state.locked,
    // isLocked: state.isLocked,
    // lockedBy: state.lockedBy,
    // editMode: state.editMode,
    // modifiedDate: state.modifiedDate,
  }
}

export default connect(mapStateToProps)(withRouter(TopBar))