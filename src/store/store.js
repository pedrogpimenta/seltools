import { createStore } from 'redux'

const initialState = {
  files: [],
}

function reducer(state = initialState, action) {
  let updatedFiles = []
  let filesForLS = []

  switch(action.type) {
    case 'SET_FILES':
      localStorage.setItem('files', JSON.stringify(action.files))

      return {
        ...state,
        files: action.files,
      }

    case 'FILE_HAS_RENDERED':
      updatedFiles = state.files.slice()

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

      filesForLS = state.files.slice()
      for (let file in filesForLS) {
        filesForLS[file].hasRendered = false
      }

      localStorage.setItem('files', JSON.stringify(filesForLS))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'REMOVE_MARKERS':
      updatedFiles = state.files.slice()
      for (let file in updatedFiles) {
        updatedFiles[file].markers = []
      }

      filesForLS = state.files.slice()
      for (let file in filesForLS) {
        filesForLS[file].hasRendered = false
      }

      localStorage.setItem('files', JSON.stringify(filesForLS))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'ADD_MARKER':
      updatedFiles = state.files.slice()

      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.file) {
          updatedFiles[file].markers.push({
            id: action.id,
            content: 'nuevo',
            x: action.x,
            y: action.y,
          })
        }
      }

      filesForLS = state.files.slice()
      for (let file in filesForLS) {
        filesForLS[file].hasRendered = false
      }

      localStorage.setItem('files', JSON.stringify(filesForLS))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'EDIT_MARKER':
      updatedFiles = state.files.slice()

      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.file) {
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

      filesForLS = state.files.slice()
      for (let file in filesForLS) {
        filesForLS[file].hasRendered = false
      }

      localStorage.setItem('files', JSON.stringify(filesForLS))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'DELETE_MARKER':
      updatedFiles = state.files.slice()

      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.file) {
          for (let marker in updatedFiles[file].markers) {
            if (updatedFiles[file].markers[marker].id === action.id) {
              updatedFiles[file].markers.splice(marker, 1)
            }
          }
        }
      }

      filesForLS = state.files.slice()
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