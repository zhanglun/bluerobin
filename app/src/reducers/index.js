import { combineReducers } from 'redux';
import tasks from './tasks';

const taskReducer = combineReducers({
  tasks,
});

export default taskReducer;
