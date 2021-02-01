import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import DialogSimple from '../DialogSimple/DialogSimple'

import {
  Classes,
  Menu,
  MenuItem,
  MenuDivider,
} from "@blueprintjs/core"

import {
  RiCloseCircleLine,
  RiMarkPenFill,
  RiTBoxLine,
} from 'react-icons/ri'

class Toolbar extends React.Component {
  constructor() {
    super()

    this.state = {
      showRemoveAllMarkersDialog: false,
      showRemoveAllHighlightsDialog: false,
    }
  }

  changeEditMode = (newEditMode) => {
    this.props.dispatch({
      type: "CHANGE_ACTIVE_MODE",
      editMode: newEditMode,
    }) 
  }


  handleRemoveAllHighlights = () => {
    this.props.dispatch({
      type: "DELETE_ALL_HIGHLIGHTS",
    }) 
    this.props.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
    this.setState({showRemoveAllHighlightsDialog: false})
  }

  handleRemoveAllMarkers = () => {
    this.props.dispatch({
      type: "DELETE_ALL_MARKERS",
    }) 
    this.props.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
    this.setState({showRemoveAllMarkersDialog: false})
  }

  render() {
    return(
      <>
        <div
          className='toolbar'
          style={{
            position: 'fixed',
            top: '70px',
            left: '10px',
            zIndex: '2',
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
            {this.props.user.type === 'teacher' &&
              <MenuItem
                icon={<RiCloseCircleLine size='1.2em' />}
                onClick={() => this.setState({showRemoveAllMarkersDialog: true})}
                text="Eliminar Notas"
              />
            }
            <MenuDivider />
            <MenuItem
              active={this.props.editMode === 'highlight'}
              icon={<RiMarkPenFill size='1.2em' />}
              onClick={() => this.changeEditMode('highlight')}
              text="Resaltar"
            />
            {this.props.user.type === 'teacher' &&
              <MenuItem
                icon={<RiCloseCircleLine size='1.2em' />}
                onClick={() => this.setState({showRemoveAllHighlightsDialog: true})}
                text="Eliminar Resaltados"
              />
            }
          </Menu>
        </div>
        {this.state.showRemoveAllHighlightsDialog &&
          <DialogSimple
            title='Eliminar resaltados'
            content='Quieres eliminar todos los resaltados de este documento?'
            yesText='Si, quiero eliminar'
            yes={this.handleRemoveAllHighlights}
            noText='No, quiero cancelar'
            no={() => this.setState({showRemoveAllHighlightsDialog: false})}
          />
        }
        {this.state.showRemoveAllMarkersDialog &&
          <DialogSimple
            title='Eliminar notas'
            content='Quieres eliminar todas las notas de este documento?'
            yesText='Si, quiero eliminar'
            yes={this.handleRemoveAllMarkers}
            noText='No, quiero cancelar'
            no={() => this.setState({showRemoveAllMarkersDialog: false})}
          />
        }
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    editMode: state.editMode,
  }
}

export default connect(mapStateToProps)(withRouter(Toolbar))