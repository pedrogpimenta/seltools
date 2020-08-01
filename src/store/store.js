import { createStore } from 'redux'

const initialState = {
  files: [],
}

function reducer(state = initialState, action) {
  let updatedFiles = []

  switch(action.type) {
    case 'SET_FILES':
      localStorage.setItem('files', JSON.stringify(action.files))

      return {
        ...state,
        files: action.files,
      }

    case 'SET_FILE_PAGE_NUMBER':
      updatedFiles = state.files.map(file => (file.id === action.fileId ? {...file, page: action.page} : file))
      localStorage.setItem('files', JSON.stringify(updatedFiles))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'ADD_MARKER':
      console.log('add marker to file:', action.file, 'at x:', action.x, 'and y:', action.y)
      updatedFiles = state.files.slice()

      for (let file in updatedFiles) {
        if (updatedFiles[file]. id === action.file) {
          updatedFiles[file].markers.push({
            id: Math.floor((Math.random() * 100000) + 1),
            content: 'oli',
            x: action.x,
            y: action.y,
          })
        }
      }

      return {
        ...state,
        files: updatedFiles,
      }

    case 'SET_MARKER_COORDS':
      // updatedFiles = state.files.map(file => (file.id === '3456' ? {...file, markers: [0, 1]} : file))
      updatedFiles = state.files.slice()

      for (let file in updatedFiles) {
        for (let marker in updatedFiles[file].markers) {
          if (updatedFiles[file].markers[marker].id === '3456') {
            updatedFiles[file].markers[marker].x = action.x
            updatedFiles[file].markers[marker].y = action.y
          }
        }
      }

      return {
        ...state,
        files: updatedFiles,
      }

    default:
      return state
  }
}

// create store & enable redux dev tools
export const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());