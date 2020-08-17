import { createStore } from 'redux'
import { cloneDeep } from 'lodash'

const initialState = {
  files: [],
  filesOnLoad: [],
  documents: [],
  students: [],
  isSaved: true,
  documentIsLoading: true,
}

function reducer(state = initialState, action) {
  let updatedFiles = state.files.slice()
  let filesForLS = []

  switch(action.type) {
    case 'LOAD_FILES':
      // localStorage.setItem('files', JSON.stringify(action.files))

      const filesOnLoad = cloneDeep(action.files)
      
      for (let file in filesOnLoad) {
        delete filesOnLoad[file].content
      }

      return {
        ...state,
        files: action.files,
        filesOnLoad: filesOnLoad,
      }

    case 'ADD_FILES':
      // localStorage.setItem('files', JSON.stringify(action.files))

      // const files = cloneDeep(action.files)
      const files = cloneDeep(state.files)
      
      for (let file in action.files) {
        files.push(action.files[file])
      }

      return {
        ...state,
        files: files,
      }

    case 'DELETE_ALL_FILES':
      // localStorage.setItem('files', JSON.stringify([]))

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

      // filesForLS = updatedFiles.slice()
      // for (let file in filesForLS) {
      //   filesForLS[file].hasRendered = false
      // }

      // localStorage.setItem('files', JSON.stringify(filesForLS))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'RESET_DOCUMENT':
      return {
        ...state,
        id: '',
        name: '',
        files: [],
        filesOnLoad: [],
        sharedWith: [],
      }

    case 'CHANGE_DOCUMENT_NAME':
      // localStorage.setItem('name', JSON.stringify(action.name))

      return {
        ...state,
        name: action.name,
      }

    case 'CHANGE_DOCUMENT_ID':
      // localStorage.setItem('id', JSON.stringify(action.id))

      return {
        ...state,
        id: action.id,
      }

    case 'CHANGE_DOCUMENT_SHAREDWITH':
      // localStorage.setItem('sharedWith', JSON.stringify(action.sharedWith))

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

      // localStorage.setItem('files', JSON.stringify(filesForLS))

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

      // localStorage.setItem('files', JSON.stringify(filesForLS))

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
      // localStorage.setItem('files', JSON.stringify(filesForLS))

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
      // localStorage.setItem('files', JSON.stringify(filesForLS))

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
      // localStorage.setItem('files', JSON.stringify(filesForLS))

      return {
        ...state,
        files: updatedFiles,
      }

    case 'CHANGE_SHAREDWITH':
      const currentSharedWith = state.sharedWith || []

      let studentHasFile = false

      for (let student in currentSharedWith) {
        if (currentSharedWith[student]._id === action.sharedWithStudent) {
          studentHasFile = student
        }
      }

      if (studentHasFile) {
        currentSharedWith.splice(studentHasFile, 1)
      } else {
        currentSharedWith.push({_id: action.sharedWithStudent})
      }

      return {
        ...state,
        sharedWith: currentSharedWith,
      }
    
    case 'DOCUMENT_UNSAVED':
      return {
        ...state,
        isSaved: false,
      }
    
    case 'DOCUMENT_SAVED':
      return {
        ...state,
        isSaved: true,
      }

    case 'DOCUMENT_IS_LOADED':
      return {
        ...state,
        documentIsLoading: false,
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