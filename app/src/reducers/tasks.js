import { CHANGE_STATE } from '../constants/actionType';

const initialState = {
  currentState: '最初の状態',
};
/**
 * tasks reducers
 * @param  {Object} state  [description]
 * @param  {Object} action [description]
 * @return {Obejct}        [description]
 */
export default function tasks(state = initialState, action) {
  switch (action.type) {
  case 'ADD_TASK':
    return {};
  case CHANGE_STATE:
    return {
      currentState: state,
    };
  default:
    return state;
  }
}
