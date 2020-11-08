import React from 'react'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { store } from '../../store/store'

import {
  Alignment,
  AnchorButton,
  Breadcrumbs,
  Button,
  Classes,
  Card,
  Icon,
  Intent,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core"

import { REACT_APP_SERVER_BASE_URL } from '../../CONSTANTS'

class DocumentsItem extends React.Component {
  // constructor() {
  //   super()

  //   this.state = {
  //   }
  // }


  // componentDidMount = () => {

  // }

  render() {
    return (
      <li className='document-item' key={this.props.document._id}>
        <Card
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            height: '8rem',
            padding: '16px',
          }}
          onClick={(e) => {
            if (this.props.type === 'document') {
              window.open(`/documento/${this.props.document._id}`, '_blank')
            } else {
              this.getDocuments(this.props.document._id)
            }
          }}
        >
          {this.props.type === 'document' &&
            <Icon
              icon='document'
              iconSize={Icon.SIZE_LARGE} 
              style={{
                marginRight: '6px'}}
            />
          }
          {this.props.type === 'folder' &&
            <Icon
              icon='folder-close'
              iconSize={Icon.SIZE_LARGE} 
              style={{
                marginRight: '6px'}}
            />
          }
          <h2 style={{fontWeight: '400', margin: '8px 0 0 0'}}>
            {!!this.props.document.name.trim().length ? this.props.document.name : 'Documento sin nombre' }
          </h2>
          {/* <Button
            type='button'
            icon='delete'
            intent={Intent.PRIMARY}
            className={`button__delete-document ${Classes.MINIMAL}`}
            text='Eliminar'
            onClick={(e) => this.handleDeleteDocument(document._id)}
          /> */}
        </Card>
      </li>
    )
  }
}

export default withRouter(DocumentsItem)
