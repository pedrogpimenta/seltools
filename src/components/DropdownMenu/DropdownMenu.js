import React from 'react';
import { CirclePicker } from 'react-color';

import {
  Classes,
  Icon,
  Intent,
  Menu,
  MenuItem,
} from "@blueprintjs/core"

class DropdownMenu extends React.Component {
  constructor() {
    super()

    this.fileInput = React.createRef()
  }

  render() {
    return (
      <Menu
        className={Classes.ELEVATION_2}
      >
        {/* <MenuItem
          icon="share"
          text="Abrir en una pestaña nueva"
          onClick={(e) => window.open(
            this.props.documentId === 'document' ?
            `/documento/${this.props.documentId}` :
            `/documentos/${this.props.documentId}`, '_blank'
          )}
        /> */}
        {/* <MenuDivider /> */}
        {this.props.documentType !== 'user' &&
          this.props.documentType !== 'student' &&
          (!!this.props.breadcrumbs[1] && this.props.breadcrumbs[1].type === 'student') &&
          <MenuItem
            icon={this.props.documentType === 'document' ? 'document-share' : 'folder-shared'}
            text="Compartir"
            labelElement={this.props.documentShared ? <Icon icon="tick" /> : <Icon icon="cross" />} 
            onClick={(e) => this.props.handleShareDocument(this.props.documentId, this.props.documentShared, this.props.documentType)}
          />
        }
        <MenuItem
          icon="edit"
          text="Cambiar nombre..."
          onClick={(e) => this.props.handleRename(this.props.documentId, this.props.documentName, this.props.documentType)}
        />
        <MenuItem
          icon="tint"
          text="Color"
        >
          <div
            style={{padding: '8px'}}
          >
            <CirclePicker 
              onChange={(e) => this.props.handleColorChange(e, this.props.documentId, this.props.documentType)}
              colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b", "#000"]}
            />
          </div>
        </MenuItem>
        {this.props.documentType === 'document' &&
          <MenuItem
            icon="duplicate"
            text="Duplicar"
            onClick={(e) => this.props.handleCloneDocument(this.props.documentId)}
          />
        }
        {this.props.documentType === 'document' &&
          <MenuItem
            icon="add-to-folder"
            text="Mover a..."
            onClick={(e) => {this.props.handleMoveDialogOpen(this.props.documentId, this.props.documentName)}}
          />
        }
        <MenuItem
          icon="delete"
          text="Eliminar"
          intent={Intent.DANGER}
          onClick={(e) => this.props.handleDeleteDocument(this.props.documentId, this.props.documentName, this.props.documentType)}
        />
      </Menu>
    )
  }
};

export default DropdownMenu
