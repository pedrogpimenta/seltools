import { createStore } from 'redux'
import { cloneDeep } from 'lodash'

const initialState = {
  files: [],
  filesOnLoad: [],
  documents: [],
  students: [],
  sharedWith: [],
  isSaved: true,
  isSaving: false,
  documentIsLoading: true,
  editMode: 'marker',
}

// TODO: this is an util
function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};


function reducer(state = initialState, action) {
  let updatedFiles = state.files.slice()
  let filesForLS = []

  switch(action.type) {
    case 'LOAD_STUDENTS':
      return {
        ...state,
        students: action.students,
        // sharedWith: action.sharedWith,
      }

    case 'LOAD_FILES':
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
      const files = cloneDeep(state.files)
      
      for (let file in action.files) {
        files.splice(action.position + 1 + parseInt(file), 0, action.files[file])
      }

      return {
        ...state,
        files: files,
      }

    case 'DELETE_ALL_FILES':
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
      return {
        ...state,
        name: action.name,
      }
      
    case 'CHANGE_DOCUMENT_BREADCRUMBS':
      return {
        ...state,
        breadcrumbs: action.breadcrumbs,
      }

    case 'CHANGE_DOCUMENT_SHARED':
      return {
        ...state,
        shared: action.shared,
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
        sharedWith: action.sharedWith || [],
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

    case 'MOVE_FILE_UP':
      updatedFiles = array_move(updatedFiles, action.position, action.position - 1)
      
      return {
        ...state,
        files: updatedFiles,
      }

    case 'MOVE_FILE_DOWN':
      updatedFiles = array_move(updatedFiles, action.position, action.position + 1)
      
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
            content: '',
            x: action.x,
            y: action.y,
            hasFocus: true,
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

    case 'REMOVE_MARKER_FOCUS':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let marker in updatedFiles[file].markers) {
            delete updatedFiles[file].markers[marker].hasFocus
          }
        }
      }

      return {
        ...state,
        files: updatedFiles,
      }

    case 'EDIT_MARKER':
      const actionId = parseInt(action.id)
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let marker in updatedFiles[file].markers) {
            if (updatedFiles[file].markers[marker].id === actionId) {
              if (action.content !== undefined) {
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

      return {
        ...state,
        files: updatedFiles,
      }

    case 'CHANGE_MARKER_BACKGROUND':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let marker in updatedFiles[file].markers) {
            if (updatedFiles[file].markers[marker].id === action.id) {
              updatedFiles[file].markers[marker].background = action.background
            }
          }
        }
      }

      filesForLS = updatedFiles.slice()
      for (let file in filesForLS) {
        filesForLS[file].hasRendered = false
      }

      return {
        ...state,
        files: updatedFiles,
      }

    case 'ADD_TEXT_FILE':
      filesForLS = updatedFiles.slice()
      const fileToAdd = {
        id: `text-file-${Math.floor((Math.random() * 100000) + 1)}`,
        type: 'txt',
        name: null,
        markers: [],
        content: '',
        creator: action.creator,
      }

      filesForLS.splice(action.position + 1, 0, fileToAdd)

      return {
        ...state,
        files: filesForLS,
      }

    case 'EDIT_TEXT_FILE':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.id) {
          updatedFiles[file].content = action.content
        }
      }

      filesForLS = updatedFiles.slice()
      for (let file in filesForLS) {
        filesForLS[file].hasRendered = false
      }

      return {
        ...state,
        files: filesForLS,
      }

    case 'ADD_NEW_HIGHLIGHT':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          if (!updatedFiles[file].highlights) {
            updatedFiles[file].highlights = []
          }
          updatedFiles[file].highlights.push({
            id: action.id,
            xPercent: action.xPercent,
            yPercent: action.yPercent,
            width: action.width,
            height: action.height,
          })
        }
      }

      return {
        ...state,
        files: updatedFiles,
      }

    case 'DELETE_HIGHLIGHT':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let highlight in updatedFiles[file].highlights) {
            if (updatedFiles[file].highlights[highlight].id === action.id) {
              updatedFiles[file].highlights.splice(highlight, 1)
            }
          }
        }
      }

      return {
        ...state,
        files: updatedFiles,
      }

    case 'CHANGE_ACTIVE_MODE':
      return {
        ...state,
        editMode: action.editMode,
      }
      
    case 'CHANGE_SHAREDWITH':
      const currentSharedWith = state.sharedWith

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

    case 'DOCUMENT_IS_SAVING':
      return {
        ...state,
        isSaving: true,
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
        isSaving: false,
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