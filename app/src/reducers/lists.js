import actionType from '../constants/actionType';

export default function lists(state, action) {
  switch (action.type) {
  case actionType.ADD_LIST:
    console.log(actionType.ADD_LIST);
    return {
      list: action.list,
    };
  case actionType.DELETE_LIST:
    console.log(actionType.ADD_LIST);
    return {
      list: action.list,
    };
  case actionType.EDIT_LIST:
    console.log(actionType.ADD_LIST);
    return {
      list: action.list,
    };
  default:
    break;
  }
}
