import React from 'react';
import pdf from 'pdfjs-dist/webpack'

class Canvas extends React.Component {
  constructor() {
    super()

    this.canvas = React.createRef()
  }

  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d')
    this.renderDocs()
  }

  componentDidUpdate() {
    this.renderDocs()
  }

  renderDocs() {
    // this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height)

    const loadPdf = pdf.getDocument({url: this.props.file.content})

    loadPdf.promise.then((thisPdf) => {
      thisPdf.getPage(1).then((page) => {
        console.log(page.view)

        const pageWidth = page.view[2]
        const pageHeight = page.view[3]

        this.ctx.canvas.width = pageWidth
        this.ctx.canvas.height = pageHeight

        page.render({
          canvasContext: this.ctx,
          viewport: page.getViewport({scale: 1})
        })
      })
    })
  }

  render() {
    return (
      <div>
        <canvas style={{border: '1px solid red'}} ref={this.canvas} />
      </div>
    )
  }
};

export default Canvas;
