

export const actionTypes = {
    SAVE_FILES:"SAVE_FILES",
    SAVE_FILE:"SAVE_FILE",
    DELETE_FILE:"DELETE_FILE",
    UPDATE_FILE:"UPDATE_FILE",
    SAVE_TEXTS:"SAVE_TEXTS",
    SAVE_TEXT:"SAVE_TEXT",
    DELETE_TEXT:"DELETE_TEXT",
    UPDATE_TEXT:"UPDATE_TEXT"
}



const reducer = () => {

const fileReducer = (state, action) => {
     switch(action.type){
        case actionTypes.SAVE_FILES:
            state.files = [...action.files]
            return state.files
        case actionTypes.SAVE_FILE:
                state.files.push(action.file)
                return state.files
        case actionTypes.DELETE_FILE:
            state.files.forEach((file, index)=>{
                if (file.id === action.fileId)
                    state.files = state.files.splice(0, index).concat(state.files.splice(index+1))
            });
            return state.files
        case actionTypes.UPDATE_FILE:
            state.files.forEach((file, index)=>{
                if (file.id === action.fileId)
                    state.files[index][action.property] = action.value
            });
            return state.files
        default:
            return state.files;
     }}


const textReducer = (state, action) => {
    switch(action.type){
       case actionTypes.SAVE_TEXTS:
        state.texts = [...action.texts]
            return state.texts;
       case actionTypes.SAVE_TEXT:
            state.texts.push(action.text)
                return state.texts;
       case actionTypes.DELETE_TEXT:
            state.texts.forEach((text, index)=>{
                if (text.id === action.textId)
                    state.texts = state.texts.splice(0, index).concat(state.texts.splice(index+1))
            });
            return state.texts;
       case actionTypes.UPDATE_PRIVATE_TEXT:
            state.texts.forEach((text, index)=>{
                if (text.id === action.textId)
                    state.texts[index][action.property] = action.value
            });
            return state.texts
        default:
            return
    }}

      return  {textReducer, fileReducer}
}



export default reducer;
