import React from 'react'
import './TeacherDocuments.css'

import {
  Alignment,
  AnchorButton,
  Breadcrumbs,
  Button,
  Classes,
  Card,
  Icon,
  Intent,
  Link,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core"

class TeacherDocuments extends React.Component {
  renderDocuments = () => {
    if (this.props.isLoading) return <div>Cargando...</div>
    
    if (this.props.documents < 1) return <div>Aún no tienes ningún documento. Empieza haciendo un nuevo: <Link to='/documento' isNew={true}>Nuevo documento</Link></div>
    
    return this.props.documents.map(document => (
      <li className='document-item' key={document._id}>
        <Card
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px',
            marginBottom: '12px',
          }}
        >
          <Link to={`/documento/${document._id}`}>
            {!!document.name.trim().length ? document.name : 'Documento sin nombre' }
          </Link>
          <Button
            type='button'
            icon='delete'
            intent={Intent.PRIMARY}
            className={`button__delete-document ${Classes.MINIMAL}`}
            text='Eliminar'
            onClick={(e) => this.handleDeleteDocument(document._id)}
          />
        </Card>
      </li>
    ))
  }

  render() {
    return (
      <div className='documents'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1>Documentos</h1>
          <AnchorButton
            type='button'
            icon='add'
            intent={Intent.PRIMARY}
            text='Nuevo documento'
            href='/documento'
          />
        </div>
        <ul style={{
          margin: '8px 0 32px',
          padding: '0',
          listStyle: 'none'
        }}>
          {this.renderDocuments()}
        </ul>
      </div>
    )
  }
}

export default TeacherDocuments
