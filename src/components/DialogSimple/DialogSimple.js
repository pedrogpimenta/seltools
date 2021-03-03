import React from 'react'

import {
  Button,
  Classes,
  Dialog,
  Intent,
} from "@blueprintjs/core"

class DialogSimple extends React.Component {
  render() {
    return (
      <>
        <Dialog
          title={this.props.title}
          isOpen={true}
          onClose={this.props.no}
          style={{
            alignSelf: 'flex-start',
            width: '500px',
            maxWidth: '100%',
          }}
        >
          <div
            className={Classes.DIALOG_BODY}
          >
            {this.props.content}
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                // intent={Intent.PRIMARY}
                className={Classes.MINIMAL}
                onClick={this.props.no}
              >
                {this.props.noText}
              </Button>
              <Button
                intent={Intent.PRIMARY}
                onClick={this.props.yes}
              >
                {this.props.yesText}
              </Button>
            </div>
          </div>
        </Dialog>
      </>
    )
  }
}

export default DialogSimple