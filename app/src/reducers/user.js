import { AUTHENTICATE } from '../constants/actionType';

export default function lists(state = [], action) {
  switch (action.type) {
  case AUTHENTICATE:
    console.log(AUTHENTICATE);
    return {
      user: action.user,
    };
  default:
    return {
      user: state.user
    };
  }
}
