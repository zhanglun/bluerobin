import { CHANGE_STATE } from '../constants/actionType';

/**
 * tasks reducers
 * @param  {Object} state  [description]
 * @param  {Object} action [description]
 * @return {Obejct}        [description]
 */
export default function tasks(state, action) {
  console.log(action);
  switch (action.type) {
  default:
    return state;
  }
}
