import { FETCH_LISTS, ADD_LIST, DELETE_LIST, EDIT_LIST } from '../constants/actionType';

export const changeMyState = (text) => {
  return {
    type: 'CHANGE_STATE',
    text,
  };
};
