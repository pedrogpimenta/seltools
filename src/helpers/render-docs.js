import pdf from 'pdfjs-dist/webpack'

export function getDocs(file, canvas) {

  if (file.type === 'pdf') {
    loadPdf(file, canvas)
  } else {
    loadImage(file, canvas)
  }

}

export function loadImage(file, canvas) {
  canvas.drawImage(file.content, 20, 20)
}

export function loadPdf(file, canvas) {
  const loadPdf = pdf.getDocument({data: file.content})

  loadPdf.promise.then((thisPdf) => {
    const numberOfPages = thisPdf.numPages
    let pageToRender = file.page > 0 ? file.page : 0

    if (pageToRender === 0) {
      if (numberOfPages > 1) {
        pageToRender = window.prompt(`Del documento ${file.name}, ¿qué pagina quieres?`, 1)
      } else (
        pageToRender = 1
      )
    }

    file.page = pageToRender
    updateLS(file)
    
    renderDocs(file, canvas)
  })
}

export function renderDocs(file, canvas) {
  const loadPdf = pdf.getDocument({data: file.content})

  loadPdf.promise.then((thisPdf) => {
    let pageToRender = file.page
    
    thisPdf.getPage(parseInt(pageToRender)).then((page) => {
      const pageWidth = page.view[2]
      const pageHeight = page.view[3]
      
      canvas.canvas.width = pageWidth * 2
      canvas.canvas.height = pageHeight * 2
      
      page.render({
        canvasContext: canvas,
        viewport: page.getViewport({scale: 2})
      })
    }, reason => {
      window.alert('Hubo un error: ' + reason)
    })

  })
}

export function updateLS(fileToUpdate) {
  const current = JSON.parse(localStorage.getItem('files'))
  const newFile = current.map((file) => {
    if (file.id === fileToUpdate.id) {
      file.page = fileToUpdate.page
    }
    return file
  })

  localStorage.setItem('files', JSON.stringify(newFile))
}

export function loadFile(inputFile) {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    
    temporaryFileReader.readAsBinaryString(inputFile);
  });
};