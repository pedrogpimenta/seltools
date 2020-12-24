import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  Classes,
  Menu,
  MenuItem,
  MenuDivider,
} from "@blueprintjs/core"

import {
  RiMarkPenFill,
  RiTBoxLine,
} from 'react-icons/ri'

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
        {this.props.isLocked &&
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              // background: 'red',
            }}
            onClick={this.props.handleClickWhenLocked}
          >
          </div>
        }
        <Menu className={`tools-menu ${Classes.ELEVATION_1}`}>
          <MenuItem
            active={this.props.editMode === 'marker'}
            icon={<RiTBoxLine size='1.2em' />}
            onClick={() => this.changeEditMode('marker')}
            text="Notas"
          />
          <MenuDivider />
          <MenuItem
            active={this.props.editMode === 'highlight'}
            icon={<RiMarkPenFill size='1.2em' />}
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