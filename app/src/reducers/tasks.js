import { CHANGE_STATE } from '../constants/actionType';

const initialState = {
  text: '最初の状態',
};
/**
 * tasks reducers
 * @param  {Object} state  [description]
 * @param  {Object} action [description]
 * @return {Obejct}        [description]
 */
export default function tasks(state = initialState, action) {
  console.log(action);
  switch (action.type) {
  case CHANGE_STATE:
    return {
      text: action.text,
    };
  default:
    return state;
  }
}
