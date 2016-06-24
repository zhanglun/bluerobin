import { combineReducers } from 'redux';
// import tasks from './tasks';
import user from './user';
import lists from './lists';

const reducers = combineReducers({
  user,
  lists,
});

export default reducers;
