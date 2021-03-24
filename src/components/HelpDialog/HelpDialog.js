import React from 'react'

import {
  Classes,
  Dialog,
} from "@blueprintjs/core"


const HelpDialog = (props) => {
    return (
      <>
        <Dialog
          title={`Cómo usar Seldocs`}
          isOpen={true}
          onClose={props.handleCloseButton}
          style={{
            width: '1280px',
            maxWidth: '100%',
          }}
        >
          <div
            className={Classes.DIALOG_BODY}
          >
            <img
              alt="ayuda e información sobre cómo funciona Seldocs"
              src="/assets/images/tutorial-1.jpg"
            />
          </div>
        </Dialog>
      </>
    )
}

export default HelpDialog