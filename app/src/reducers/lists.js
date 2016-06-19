import { LOAD_LISTS, ADD_LIST, DELETE_LIST, EDIT_LIST } from '../constants/actionType';
export default function lists(state, action) {
  switch (action.type) {
  case LOAD_LISTS:
    console.log(LOAD_LISTS);
    return {
      lists: action.lists,
    };
  case ADD_LIST:
    console.log(ADD_LIST);
    return {
      list: action.list,
    };
  case DELETE_LIST:
    console.log(DELETE_LIST);
    return {
      list: action.list,
    };
  case EDIT_LIST:
    console.log(EDIT_LIST);
    return {
      list: action.list,
    };
  default:
    return {
      list: action.list
    };
  }
}
