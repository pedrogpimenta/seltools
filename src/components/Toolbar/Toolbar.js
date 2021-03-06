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
  RiSubtractLine,
  RiTBoxLine,
} from 'react-icons/ri'

class Toolbar extends React.Component {
  constructor() {
    super()

    this.state = {
      showRemoveAllMarkersDialog: false,
      showRemoveAllHighlightsDialog: false,
      showRemoveAllLinesDialog: false,
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
  
  handleRemoveAllLines = () => {
    this.props.dispatch({
      type: "DELETE_ALL_LINES",
    }) 
    this.props.dispatch({
      type: "DOCUMENT_UNSAVED",
    }) 
    this.setState({showRemoveAllLinesDialog: false})
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
              labelElement={this.props.user.type === 'teacher' &&
                <RiCloseCircleLine onClick={() => this.setState({showRemoveAllMarkersDialog: true})} size='1.2em' />
              }
            />
            <MenuDivider />
            <MenuItem
              active={this.props.editMode === 'highlight'}
              icon={<RiMarkPenFill size='1.2em' />}
              onClick={() => this.changeEditMode('highlight')}
              text="Destacar"
              labelElement={this.props.user.type === 'teacher' &&
                <RiCloseCircleLine onClick={() => this.setState({showRemoveAllHighlightsDialog: true})} size='1.2em' />
              }
            />
            <MenuDivider />
            <MenuItem
              active={this.props.editMode === 'lines'}
              icon={<RiSubtractLine size='1.2em' />}
              onClick={() => this.changeEditMode('lines')}
              text="Líneas"
              labelElement={this.props.user.type === 'teacher' &&
                <RiCloseCircleLine onClick={() => this.setState({showRemoveAllLinesDialog: true})} size='1.2em' />
              }
            />
            {this.props.user.type === 'teacher' &&
              <>
                <MenuDivider />
                <MenuItem
                  active={this.props.editMode === 'textinputs'}
                  icon={<RiTBoxLine size='1.2em' />}
                  onClick={() => this.changeEditMode('textinputs')}
                  text="Campos de texto"
                  labelElement={this.props.user.type === 'teacher' &&
                    <RiCloseCircleLine onClick={() => this.setState({showRemoveAllLinesDialog: true})} size='1.2em' />
                  }
                />
              </>
            }
          </Menu>
        </div>
        {this.state.showRemoveAllHighlightsDialog &&
          <DialogSimple
            title='Eliminar destacados'
            content='Quieres eliminar todos los destacados de este documento?'
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
        {this.state.showRemoveAllLinesDialog &&
          <DialogSimple
            title='Eliminar líneas'
            content='Quieres eliminar todas las líneas de este documento?'
            yesText='Si, quiero eliminar'
            yes={this.handleRemoveAllLines}
            noText='No, quiero cancelar'
            no={() => this.setState({showRemoveAllLinesDialog: false})}
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