import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  STAMP_TICK,
  STAMP_CROSS,
  STAMP_STAR,
  STAMP_COOL,
  STAMP_CONFUSED,
} from '../../CONSTANTS'

import {
  Classes,
  Menu,
  MenuItem,
  MenuDivider,
} from "@blueprintjs/core"


class Toolbar extends React.Component {
  changeEditMode = (newEditMode, editType) => {
    this.props.dispatch({
      type: "CHANGE_ACTIVE_MODE",
      editMode: newEditMode,
      editType: editType,
    }) 
  }

  render() {
    return(
      <div
        className='toolbar'
        style={{
          position: 'fixed',
          top: '70px',
          left: '20px',
          zIndex: '5',
        }}
      >
        <Menu className={`tools-menu ${Classes.ELEVATION_1}`}>
          <MenuItem
            active={this.props.editMode === 'normal'}
            icon="eye-open"
            onClick={() => this.changeEditMode('normal')}
            text="Ver"
          />
          <MenuDivider />
          <MenuItem
            active={this.props.editMode === 'marker'}
            icon="widget-button"
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
          <MenuDivider />
          {!this.props.isStudent &&
            <>
              <button
                className={this.props.editMode === 'stamp' && this.props.editType === 'tick' ? 'bp3-menu-item bp3-active bp3-intent-primary bp3-popover-dismiss' : 'bp3-menu-item bp3-popover-dismiss'}
                onClick={() => this.changeEditMode('stamp', 'tick')}
              >
                <div className='st-icon bp3-icon'>{STAMP_TICK}</div>
                <div className='bp3-text-overflow-ellipsis bp3-fill'>¡Eso es!</div>
              </button>
              <button
                className={this.props.editMode === 'stamp' && this.props.editType === 'cross' ? 'bp3-menu-item bp3-active bp3-intent-primary bp3-popover-dismiss' : 'bp3-menu-item bp3-popover-dismiss'}
                onClick={() => this.changeEditMode('stamp', 'cross')}
              >
                <div className='st-icon bp3-icon'>{STAMP_CROSS}</div>
                <div className='bp3-text-overflow-ellipsis bp3-fill'>¡Ups!</div>
              </button>
              <button
                className={this.props.editMode === 'stamp' && this.props.editType === 'star' ? 'bp3-menu-item bp3-active bp3-intent-primary bp3-popover-dismiss' : 'bp3-menu-item bp3-popover-dismiss'}
                onClick={() => this.changeEditMode('stamp', 'star')}
              >
                <div className='st-icon bp3-icon'>{STAMP_STAR}</div>
                <div className='bp3-text-overflow-ellipsis bp3-fill'>¡Genial!</div>
              </button>
            </>
          }
          {this.props.isStudent &&
            <>
              <button
                className={this.props.editMode === 'stamp' && this.props.editType === 'cool' ? 'bp3-menu-item bp3-active bp3-intent-primary bp3-popover-dismiss' : 'bp3-menu-item bp3-popover-dismiss'}
                onClick={() => this.changeEditMode('stamp', 'cool')}
              >
                <div className='st-icon bp3-icon'>{STAMP_COOL}</div>
                <div className='bp3-text-overflow-ellipsis bp3-fill'>¡Genial!</div>
              </button>
              <button
                className={this.props.editMode === 'stamp' && this.props.editType === 'confused' ? 'bp3-menu-item bp3-active bp3-intent-primary bp3-popover-dismiss' : 'bp3-menu-item bp3-popover-dismiss'}
                onClick={() => this.changeEditMode('stamp', 'confused')}
              >
                <div className='st-icon bp3-icon'>{STAMP_CONFUSED}</div>
                <div className='bp3-text-overflow-ellipsis bp3-fill'>¡¿Cómooo?!</div>
              </button>
            </>
          }
        </Menu>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    editMode: state.editMode,
    editType: state.editType,
  }
}

export default connect(mapStateToProps)(withRouter(Toolbar))