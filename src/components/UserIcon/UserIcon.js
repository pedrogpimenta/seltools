import React from 'react';

const UserIcon = (props) => {
  return(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', 
        width: '18px',
        height: '18px',
        backgroundColor: props.color || 'black',
        color: 'white',
        borderRadius: '50%',
        marginRight: '2px',
        fontSize: '12px',
        fontWeight: '700',
        userSelect: 'none',
      }}
    >
      {props.username.substr(0, 1).toUpperCase()}
    </div>
  )
};

export default UserIcon
