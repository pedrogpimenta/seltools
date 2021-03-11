import React, { useRef, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useDrag, useDrop } from "react-dnd"
import { getEmptyImage } from 'react-dnd-html5-backend';

import {
  Card,
  Icon,
  Popover,
} from "@blueprintjs/core"

import {
  RiFile3Line,
  RiFileUserLine,
  RiFolderFill,
  RiFolderUserFill,
  RiMoreFill,
  RiUserFill,
} from 'react-icons/ri'

import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { CustomDragLayer } from './DragLayer'

const DocumentsItem = (props) => {

  const ref = useRef(null)

  const [{ isDragging }, dragRef, preview] = useDrag({
    type: props.document.type,
    item: {_id: props.document._id, name: props.document.name},
    canDrag: () => props.document.type !== 'student',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  });

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: props.document.type === 'document' ? 'none' : ['document', 'folder'],
    drop: (item) => {props.handleMoveDocument(props.document._id, item._id)},
    canDrop: (item) => item._id !== props.document._id,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  })

  dragRef(dropRef(ref))

  return (
    <li
      key={props.document._id}
      ref={props.user.type !== 'student' ? ref : null}
      className='document-item'
      style={{
        position: 'relative',
        listStyle: 'none',
        borderRadius: '6px',
        boxShadow: (isOver && canDrop) ? '0 0 0 3px var(--c-primary)' : 'none',
      }}
    >
      {isDragging && <CustomDragLayer document={props.document} user={props.user} />}
      <Card
        className='document-item-card bp3-elevation-1'
        style={{
          opacity: isDragging ? '.5' : '1',
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflow: 'hidden',
          }}
          onClick={() => {
            props.history.push(`/${props.document.type === 'document' ? 'documento' : 'documentos'}/${props.document._id}`)
            if (props.document.type !== 'document') props.getDocuments(props.document._id)
          }}
        >
          {props.document.type === 'student' &&
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', 
                width: '18px',
                height: '18px',
                backgroundColor: props.document.color || 'black',
                color: 'white',
                borderRadius: '50%',
                marginRight: '2px',
                fontSize: '12px',
                fontWeight: '700',
                userSelect: 'none',
              }}
            >
              {props.document.name.substr(0, 1).toUpperCase()}
            </div>
          }
          {props.document.type !== 'student' &&
            <>
              {props.user.type === 'student' && props.document.type === 'document' ? <RiFile3Line color={props.document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} /> : 
              props.user.type === 'student' && props.document.type === 'folder' ? <RiFolderFill color={props.document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} /> : 
              props.document.type === 'document' && props.document.shared === true ? <RiFileUserLine color={props.document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} /> :
              props.document.type === 'document' ? <RiFile3Line color={props.document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} /> :
              props.document.type === 'folder' && props.document.shared === true ? <RiFolderUserFill color={props.document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} /> :
              props.document.type === 'folder' ? <RiFolderFill color={props.document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} /> :
              <RiUserFill color={props.document.color || '#888'} size='1.2em' style={{marginRight: '2px'}} />}
            </>
          }
          <h4
            style={{
              flex: '1',
              fontWeight: '300',
              margin: '0 0 0 4px',
              // pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {!!props.document.name.trim().length ? props.document.name : 'Documento sin nombre' }
          </h4>
        </div>
      </Card>
      {props.user.type === 'teacher' && !isDragging &&
        <Popover
          autoFocus={false}
          content={<DropdownMenu
            documentId={props.document._id}
            documentName={props.document.name}
            documentType={props.document.type}
            documentShared={props.document.shared}
            breadcrumbs={props.breadcrumbs}
            handleShareDocument={props.handleShareDocument}
            handleRename={props.handleRename}
            handleColorChange={props.handleColorChange}
            handleCloneDocument={props.handleCloneDocument}
            handleDeleteDocument={props.handleDeleteDocument}
            handleMoveDialogOpen={props.handleMoveDialogOpen}
            handleEditDocumentDialogOpen={props.handleEditDocumentDialogOpen}
          />}
        >
          <div
            className={'card-actions'}
            style={{
              background: 'rgb(197, 197, 197)',
              padding: '4px',
              borderRadius: '3px',
              lineHeight: '0',
            }}
          >
            <Icon
              icon={<RiMoreFill size='1.2em' color='white' />}
              color='white'
            />
          </div>
        </Popover>
      }
    </li>
  )
}

export default withRouter(DocumentsItem)
