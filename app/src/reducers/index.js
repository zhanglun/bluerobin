import { combineReducers } from 'redux';
import tasks from './tasks';
import lists from './lists';

const reducers = combineReducers({
  tasks,
  lists,
});

export default reducers;
