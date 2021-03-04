import React from 'react';
import { CirclePicker } from 'react-color';

import {
  Classes,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
} from "@blueprintjs/core"

import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiDeleteBin5Fill,
  RiDropFill,
  RiExternalLinkFill,
  RiFileCopyFill,
  RiFolderTransferFill,
  RiPencilFill,
  RiUserSharedFill,
} from 'react-icons/ri'

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
        <MenuItem
          icon={<RiExternalLinkFill size='1.2em' />}
          text="Abrir en una pestaña nueva"
          onClick={(e) => window.open(
            this.props.documentType === 'document' ?
            `/documento/${this.props.documentId}` :
            `/documentos/${this.props.documentId}`, '_blank'
          )}
        />
        <MenuDivider />
        {this.props.documentType !== 'user' &&
          this.props.documentType !== 'student' &&
          (!!this.props.breadcrumbs[1] && this.props.breadcrumbs[1].type === 'student') &&
          <MenuItem
            icon={<RiUserSharedFill size='1.2em' />}
            text="Compartir"
            labelElement={this.props.documentShared ? <RiCheckboxCircleFill size='1.2em' /> : <RiCheckboxBlankCircleLine size='1.2em' />} 
            onClick={(e) => this.props.handleShareDocument(this.props.documentId, this.props.documentShared, this.props.documentType)}
          />
        }
        {this.props.documentType === 'student' &&
          <MenuItem
            icon={<RiPencilFill size='1.2em' />}
            text="Editar"
            onClick={(e) => this.props.handleEditDocumentDialogOpen(this.props.documentId, this.props.documentName)}
          />
        }
        {this.props.documentType !== 'student' &&
          <MenuItem
            icon={<RiPencilFill size='1.2em' />}
            text="Cambiar nombre..."
            onClick={(e) => this.props.handleRename(this.props.documentId, this.props.documentName, this.props.documentType)}
          />
        }
        <MenuItem
          icon={<RiDropFill size='1.2em' />}
          text="Color"
        >
          <div
            style={{padding: '8px'}}
          >
            <CirclePicker 
              className={Classes.POPOVER_DISMISS}
              onChange={(e) => this.props.handleColorChange(e, this.props.documentId, this.props.documentType)}
              colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#888", "#000"]}
            />
          </div>
        </MenuItem>
        {this.props.documentType === 'document' &&
          <MenuItem
            icon={<RiFileCopyFill size='1.2em' />}
            text="Duplicar"
            onClick={(e) => this.props.handleCloneDocument(this.props.documentId)}
          />
        }
        {(this.props.documentType === 'document' || this.props.documentType === 'folder') &&
          <MenuItem
            icon={<RiFolderTransferFill size='1.2em' />}
            text="Mover a..."
            onClick={(e) => {this.props.handleMoveDialogOpen(this.props.documentId, this.props.documentName)}}
          />
        }
        <MenuItem
          icon={<RiDeleteBin5Fill size='1.2em' />}
          text="Eliminar"
          intent={Intent.DANGER}
          onClick={(e) => this.props.handleDeleteDocument(this.props.documentId, this.props.documentName, this.props.documentType)}
        />
      </Menu>
    )
  }
};

export default DropdownMenu
