import { createStore } from 'redux'
import { cloneDeep } from 'lodash'

const initialState = {
  name: '',
  files: [],
  filesOnLoad: [],
  filesLength: 0,
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
      }

    case 'RESET_FILES':
      return {
        ...initialState,
      }

    case 'LOAD_FILES':
      const filesOnLoad = cloneDeep(action.files)
      
      for (let file in filesOnLoad) {
        delete filesOnLoad[file].content
      }
      
      if (!action.noReset) {
        state = initialState
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

      
    case 'HIDE_FILE':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          updatedFiles[file].hidden = !updatedFiles[file].hidden
        }
      }

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

    // case 'CHANGE_DOCUMENT_SHAREDWITH':
    //   // localStorage.setItem('sharedWith', JSON.stringify(action.sharedWith))

    //   return {
    //     ...state,
    //     sharedWith: action.sharedWith || [],
    //   }

    // case 'FILE_HAS_RENDERED':
    //   for (let file in updatedFiles) {
    //     if (updatedFiles[file].id === action.fileId) {
    //       updatedFiles[file].hasRendered = true
    //     }
    //   }

    //   return {
    //     ...state,
    //     files: updatedFiles,
    //   }

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

      return {
        ...state,
        files: updatedFiles,
      }
      
    case 'DELETE_ALL_HIGHLIGHTS':
      for (let file in updatedFiles) {
        updatedFiles[file].highlights = []
      }

      filesForLS = updatedFiles.slice()

      return {
        ...state,
        files: updatedFiles,
      }

    case 'DELETE_ALL_LINES':
      for (let file in updatedFiles) {
        updatedFiles[file].lines = []
      }

      filesForLS = updatedFiles.slice()

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
      // TODO: melhorar esta merda que aí vem
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let marker in updatedFiles[file].markers) {
            if (updatedFiles[file].markers[marker].id === actionId) {
              if (action.content !== undefined) {
                updatedFiles[file].markers[marker].content = action.content
              }
              if (!!action.x || action.x === 0) {
                updatedFiles[file].markers[marker].x = action.x
              }
              if (!!action.y || action.y === 0) {
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
        highlights: [],
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

    case 'ADD_DRAW_FILE':
      filesForLS = updatedFiles.slice()
      const drawFileToAdd = {
        id: `draw-file-${Math.floor((Math.random() * 100000) + 1)}`,
        type: 'draw',
        name: null,
        markers: [],
        highlights: [],
        content: '',
        creator: action.creator,
      }

      filesForLS.splice(action.position + 1, 0, drawFileToAdd)

      return {
        ...state,
        files: filesForLS,
      }

      
    case 'ADD_VIDEO_EMBED':
      filesForLS = updatedFiles.slice()
      const embedToAdd = {
        id: `video-embed-${Math.floor((Math.random() * 100000) + 1)}`,
        type: 'videoembed',
        name: null,
        markers: [],
        highlights: [],
        content: action.url,
        creator: action.creator,
      }

      filesForLS.splice(action.position + 1, 0, embedToAdd)

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

    case 'ADD_NEW_TEXTINPUT':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          if (!updatedFiles[file].textInputs) {
            updatedFiles[file].textInputs = []
          }
          updatedFiles[file].textInputs.push({
            id: action.id,
            xPercent: action.xPercent,
            yPercent: action.yPercent,
            width: action.width,
            height: action.height,
            content: action.content,
            answerState: action.answerState,
            correctAnswers: action.correctAnswers,
            enableCase: action.enableCase,
            enableAccents: action.enableAccents,
          })
        }
      }

      return {
        ...state,
        files: updatedFiles,
      }

    case 'DELETE_TEXTINPUT':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let textInput in updatedFiles[file].textInputs) {
            if (updatedFiles[file].textInputs[textInput].id === action.id) {
              updatedFiles[file].textInputs.splice(textInput, 1)
            }
          }
        }
      }

      return {
        ...state,
        files: updatedFiles,
      }
    
    case 'EDIT_TEXTINPUT':
      // TODO: melhorar esta merda que aí vem
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let textInput in updatedFiles[file].textInputs) {
            if (updatedFiles[file].textInputs[textInput].id === action.id) {
              if (action.content !== undefined) {
                updatedFiles[file].textInputs[textInput].content = action.content
              }
              if (!!action.x || action.x === 0) {
                updatedFiles[file].textInputs[textInput].x = action.x
              }
              if (!!action.y || action.y === 0) {
                updatedFiles[file].textInputs[textInput].y = action.y
              }
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

    case 'ADD_TEXTINPUT_ANSWER': 
      // TODO: melhorar esta merda que aí vem
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let textInput in updatedFiles[file].textInputs) {
            if (updatedFiles[file].textInputs[textInput].id === action.textInputId) {
              updatedFiles[file].textInputs[textInput].correctAnswers.push(action.answer)
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

    case 'DELETE_TEXTINPUT_ANSWER': 
      // TODO: melhorar esta merda que aí vem
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let textInput in updatedFiles[file].textInputs) {
            if (updatedFiles[file].textInputs[textInput].id === action.textInputId) {
              for (let answer in updatedFiles[file].textInputs[textInput].correctAnswers) {
                if (updatedFiles[file].textInputs[textInput].correctAnswers[answer] === action.answer) {
                  updatedFiles[file].textInputs[textInput].correctAnswers.splice(answer, 1)
                }
              }
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

    case 'SET_TEXTINPUT_STATE': 
      // TODO: melhorar esta merda que aí vem
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let textInput in updatedFiles[file].textInputs) {
            if (updatedFiles[file].textInputs[textInput].id === action.textInputId) {
              updatedFiles[file].textInputs[textInput].answerState = action.answerState
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
    
    case 'ADD_NEW_LINE':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          if (!updatedFiles[file].lines) {
            updatedFiles[file].lines = []
          }
          updatedFiles[file].lines.push({
            id: action.id,
            x: action.x,
            y: action.y,
            points: action.points,
          })
        }
      }

      return {
        ...state,
        files: updatedFiles,
      }

    case 'DELETE_LINE':
      for (let file in updatedFiles) {
        if (updatedFiles[file].id === action.fileId) {
          for (let line in updatedFiles[file].lines) {
            if (updatedFiles[file].lines[line].id === action.id) {
              updatedFiles[file].lines.splice(line, 1)
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
        isSaved: state.isLocked ? true : false,
      }
    
    case 'DOCUMENT_SAVED':
      return {
        ...state,
        isSaved: true,
        isSaving: false,
      }

    case 'CHANGE_DOCUMENT_MODIFIED_DATE':
      return {
        ...state,
        modifiedDate: action.modifiedDate,
      }

    case 'CHANGE_DOCUMENT_FILES_LENGTH':
      return {
        ...state,
        filesLength: action.filesLength,
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

    case 'DOCUMENT_IS_LOCKED':
      return {
        ...state,
        locked: action.locked,
        isLocked: action.isLocked,
        lockedBy: action.lockedBy,
      }

    default:
      return state
  }
}

// create store & enable redux dev tools
export const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());