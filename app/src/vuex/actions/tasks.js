import request from 'superagent';
import * as mutationType from '../mutationType';
import baseURL from './base';

let requestTasks = (query) => {
  return request
    .get('/tasks')
    .query(query)
    .set('x-access-token', window.localStorage.token)
    .use(baseURL);
};

export const fetchTasks = ({ dispatch, state }, query, callback) => {
  requestTasks(query).then((res) => {
    if (typeof callback === 'function') {
      callback(res);
    }
    dispatch(mutationType.FETCH_TASKS, query, res.body);
  }, (err) => {
    dispatch(mutationType.FETCH_TASKS_ERROR, err);
  });
};

export const addTask = ({ dispatch, state }, task) => {
  request
    .post('/tasks')
    .send(task)
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then((res) => {
      dispatch(mutationType.ADD_TASK, res.body);
      dispatch(mutationType.UPDATE_LIST, { id: task.list_id, type: 'total', update: 1 });
    }, (err) => {
      dispatch(mutationType.ADD_TASK_ERROR, err);
    });
};

export const toggleTask = ({ dispatch, state }, taskid, param) => {
  request
    .put('/tasks/' + taskid)
    .send(param)
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then((res) => {
      dispatch(mutationType.EDIT_TASK, res.body);
      if (param.completed) {
        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'completed', update: 1 });
      } else {
        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'completed', update: -1 });
      }
    }, (err) => {
      dispatch(mutationType.EDIT_TASK_ERROR, err);
    });
};

export const deleteTask = ({ dispatch, state }, taskid) => {
  request
    .delete('/tasks/' + taskid)
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then((res) => {
      dispatch(mutationType.DELETE_TASK, res.body);
      dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'total', update: -1 });
      if (res.body.completed) {
        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'completed', update: -1 });
      }
    }, (err) => {
      dispatch(mutationType.EDIT_TASK_ERROR, err);
    });
};
