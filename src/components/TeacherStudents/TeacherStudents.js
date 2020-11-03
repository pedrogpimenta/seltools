import React from 'react'
import './TeacherStudents.css'

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

class TeacherStudents extends React.Component {
  renderStudents = () => {
    if (this.props.isLoading) return <div>Cargando...</div>

    if (this.props.students < 1) return <div>No tienes estudiantes, añade uno:</div>

    return this.props.students.sort((a, b) => a.name > b.name ? 1 : -1).map(student => (
      <li
        key={student._id}
      >
        {/* <div
          style={{padding: '4px 0'}}
        > */}
        <Card
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '8rem',
            padding: '8px',
            marginBottom: '12px',
          }}
        >
          <Icon
            icon='user'
            style={{marginRight: '6px'}}
          />
            {student.name}
        </Card>
        {/* </div> */}
      </li>
    ))
  }

  render() {
    return (
      <div className='students'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1>Alumnos</h1>
          <Button
            type='button'
            icon='add'
            intent={Intent.PRIMARY}
            text='Añadir alumno'
            onClick={this.props.handleAddStudent}
            style={{marginTop: '16px'}}
            />
        </div>
        <div>
          <div>
            <ul style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridGap: '20px',
              margin: '0',
              padding: '0',
              listStyle: 'none',
            }}>
              {this.renderStudents()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default TeacherStudents
