import { FETCH_LISTS, ADD_LIST, DELETE_LIST, EDIT_LIST } from '../constants/actionType';

const initState = {
  data: [],
};

export default function lists(state = initState, action) {
  switch (action.type) {
  case FETCH_LISTS:
    console.log(FETCH_LISTS);
    return {
      data: action.lists,
    };
  case ADD_LIST:
    return {
      data: state.data.concat([action.list]),
      showModal: false,
    };
  case DELETE_LIST:
    return {
      data: state.data.filter((list) => {
        return list.id !== action.list.id;
      }),
      showCurrentList: false,
    };
  case EDIT_LIST:
    return {
      data: state.data.map((list) => {
        if (list.id === action.list.id) {
          return action.list;
        }
        return list;
      }),
      showCurrentList: false,
    };
  default:
    return {
      data: state.data
    };
  }
}
