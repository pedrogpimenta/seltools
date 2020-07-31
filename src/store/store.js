import { createStore } from 'redux'

const initialState = {
  files: [],
}

function reducer(state = initialState, action) {
  switch(action.type) {
    case 'SET_FILES':
      localStorage.setItem('files', JSON.stringify(action.files))

      return {
        ...state,
        files: action.files,
      }

    case 'SET_FILE_PAGE_NUMBER':
      const updatedFiles = state.files.map(file => (file.id === action.fileId ? {...file, page: action.page} : file))
      localStorage.setItem('files', JSON.stringify(updatedFiles))

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