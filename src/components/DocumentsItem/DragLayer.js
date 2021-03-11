import React from 'react'
import { useDragLayer } from 'react-dnd';

import {
  Card,
} from "@blueprintjs/core"

import {
  RiFile3Line,
  RiFileUserLine,
  RiFolderFill,
  RiFolderUserFill,
  RiUserFill,
} from 'react-icons/ri'

export const CustomDragLayer = (props) => {
  const { currentOffset } = useDragLayer((monitor) => ({
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  return (
    <div style={{
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }}>
			<div style={{
        transform: currentOffset ? `translate(${currentOffset.x}px, ${currentOffset.y}px)` : `0`
      }}>
        <Card
          className='document-item-card bp3-elevation-1'
          style={{
            width: '200px',
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
              }}
            >
              {!!props.document.name.trim().length ? props.document.name : 'Documento sin nombre' }
            </h4>
          </div>
        </Card>
			</div>
		</div>
  );
};