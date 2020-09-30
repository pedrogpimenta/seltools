import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  Alignment,
  Intent,
  Breadcrumbs,
  Breadcrumb,
  Button,
  Classes,
  EditableText,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Switch,
} from "@blueprintjs/core"

class Toolbar extends React.Component {
  changeEditMode = (newEditMode) => {
    this.props.dispatch({
      type: "CHANGE_ACTIVE_MODE",
      editMode: newEditMode,
    }) 
  }

  render() {
    return(
      <div
        className='toolbar'
        style={{
          position: 'fixed',
          top: '70px',
          left: '10px',
        }}
      >
        <Menu className={`tools-menu ${Classes.ELEVATION_1}`}>
          <MenuItem
            active={this.props.editMode === 'marker'}
            icon="widget"
            onClick={() => this.changeEditMode('marker')}
            text="Notas"
          />
          <MenuDivider />
          <MenuItem
            active={this.props.editMode === 'highlight'}
            icon="highlight"
            onClick={() => this.changeEditMode('highlight')}
            text="Resaltar"
          />
        </Menu>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    editMode: state.editMode,
  }
}

export default connect(mapStateToProps)(withRouter(Toolbar))