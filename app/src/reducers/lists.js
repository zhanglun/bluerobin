import { FETCH_LISTS, ADD_LIST, DELETE_LIST, EDIT_LIST } from '../constants/actionType';

export default function lists(state = [], action) {
  switch (action.type) {
  case FETCH_LISTS:
    console.log(FETCH_LISTS);
    return {
      lists: action.lists,
    };
  case ADD_LIST:
    return {
      lists: state.lists.concat([action.list]),
      showModal: false,
    };
  case DELETE_LIST:
    console.log(DELETE_LIST);

    return {
      lists: state.lists.filter((list) => {
        return list.id !== action.list.id;
      }),
      showCurrentList: false,
    };
  case EDIT_LIST:
    console.log(EDIT_LIST);
    return {
      list: action.list,
    };
  default:
    return {
      lists: state.lists
    };
  }
}
