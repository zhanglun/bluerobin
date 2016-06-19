import { combineReducers } from 'redux';
import tasks from './tasks';
import lists from './lists';

const taskReducer = combineReducers({
  tasks,
  lists,
});

export default taskReducer;
