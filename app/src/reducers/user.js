import { AUTHENTICATE } from '../constants/actionType';

export default function lists(state = {}, action) {
  switch (action.type) {
  case AUTHENTICATE:
    return action.user;
  default:
    return state.user || {};
  }
}
