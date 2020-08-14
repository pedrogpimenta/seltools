import { createStore } from 'redux'

const initialState = {
  files: [],
}

function reducer(state = initialState, action) {
  let updatedFiles = state.files.slice()
  let filesForLS = []

  switch(action.type) {
    case 'ADD_FILES':
      localStorage.setItem('files', JSON.stringify(action.files))

      return {
        ...state,
        files: action.files,
      }

    case 'DELETE_ALL_FILES':
      localStorage.setItem('files', JSON.stringify([]))

      return {
        ...state,
        files: [],
      }

    case 'DELETE_FILE':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          updatedFiles.splice(file, 1)
        }
      }

      filesForLS = updatedFiles.slice()
      for (let file in filesForLS) {
        filesForLS[file].hasRendered = false
      }

      localStorage.setItem('files', JSON.stringify(filesForLS))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'CHANGE_DOCUMENT_NAME':
      localStorage.setItem('name', JSON.stringify(action.name))

      return {
        ...state,
        name: action.name,
      }

    case 'CHANGE_DOCUMENT_ID':
      localStorage.setItem('id', JSON.stringify(action.id))

      return {
        ...state,
        id: action.id,
      }

    case 'CHANGE_DOCUMENT_SHAREDWITH':
      localStorage.setItem('sharedWith', JSON.stringify(action.sharedWith))

      return {
        ...state,
        sharedWith: action.sharedWith,
      }

    case 'FILE_HAS_RENDERED':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          updatedFiles[file].hasRendered = true
        }
      }

      return {
        ...state,
        files: updatedFiles,
      }

    case 'SET_FILE_PAGE_NUMBER':
      updatedFiles = state.files.map(file => (file.id === action.fileId ? {...file, page: action.page} : file))

      filesForLS = updatedFiles.slice()
      for (let file in filesForLS) {
        filesForLS[file].hasRendered = false
      }

      localStorage.setItem('files', JSON.stringify(filesForLS))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'DELETE_ALL_MARKERS':
      for (let file in updatedFiles) {
        updatedFiles[file].markers = []
      }

      filesForLS = updatedFiles.slice()
      for (let file in filesForLS) {
        filesForLS[file].hasRendered = false
      }

      localStorage.setItem('files', JSON.stringify(filesForLS))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'ADD_MARKER':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          updatedFiles[file].markers.push({
            id: action.id,
            content: 'nuevo',
            x: action.x,
            y: action.y,
          })
        }
      }

      filesForLS = updatedFiles.slice()
      for (let file in filesForLS) {
        filesForLS[file].hasRendered = false
      }
      localStorage.setItem('files', JSON.stringify(filesForLS))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'EDIT_MARKER':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let marker in updatedFiles[file].markers) {
            if (updatedFiles[file].markers[marker].id === action.id) {
              if (!!action.content) {
                updatedFiles[file].markers[marker].content = action.content
              }
              if (!!action.x) {
                updatedFiles[file].markers[marker].x = action.x
              }
              if (!!action.y) {
                updatedFiles[file].markers[marker].y = action.y
              }
            }
          }
        }
      }

      filesForLS = updatedFiles.slice()
      for (let file in filesForLS) {
        filesForLS[file].hasRendered = false
      }
      localStorage.setItem('files', JSON.stringify(filesForLS))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'DELETE_MARKER':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let marker in updatedFiles[file].markers) {
            if (updatedFiles[file].markers[marker].id === action.id) {
              updatedFiles[file].markers.splice(marker, 1)
            }
          }
        }
      }

      filesForLS = updatedFiles.slice()
      for (let file in filesForLS) {
        filesForLS[file].hasRendered = false
      }
      localStorage.setItem('files', JSON.stringify(filesForLS))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'IS_DRAGGING':
      return {
        ...state,
        dragging: true,
      }

    case 'NOT_DRAGGING':
      return {
        ...state,
        dragging: false,
      }

    default:
      return state
  }
}

// create store & enable redux dev tools
export const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());