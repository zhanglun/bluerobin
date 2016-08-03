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

export const fetchTaskDetail = ({ dispatch, state }, taskid) => {
  request
    .get('/tasks/' + taskid)
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then((res) => {
      dispatch(mutationType.FETCH_TASK_DETAIL, res.body);
    }, (err) => {
      dispatch(mutationType.FETCH_TASK_DETAIL_ERROR, err);
    });
};

export const hideTaskDetail = ({ dispatch }) => {
  dispatch(mutationType.HIDE_DETAIL_WINDOW);
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
      console.log('actions toggle task');
      dispatch(mutationType.EDIT_TASK, res.body);
      if (param.hasOwnProperty('archived') && param.archived) {
        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'archived', update: 1 });
      } else if (param.hasOwnProperty('archived') && !param.archived) {
        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'archived', update: -1 });
      }
    }, (err) => {
      dispatch(mutationType.EDIT_TASK_ERROR, err);
    });
};

export const deleteTask = ({ dispatch, state }, task) => {
  request
    .delete('/tasks/' + task.id)
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then((res) => {
      dispatch(mutationType.DELETE_TASK, res.body);
      if (task.istrash == false) {
        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'istrash', update: 1 });
      }
      if (task.archived == true) {
        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'archived', update: -1 });
      }
      if (task.istrash == true) {
        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'istrash', update: -1 });
        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'total', update: -1 });
      }
    }, (err) => {
      dispatch(mutationType.EDIT_TASK_ERROR, err);
    });
};

export const editTask = ({ dispatch, state }, taskid, param) => {
  request
    .put('/tasks/' + taskid)
    .set('x-access-token', window.localStorage.token)
    .send(param)
    .use(baseURL)
    .then((res) => {
      console.log('actions edit task');
      dispatch(mutationType.EDIT_TASK, res.body);
      if (param.istrash) {
        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'istrash', update: 1 });
      } else {
        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'istrash', update: -1 });
      }
    });
};

export const resetTasks = ({ dispatch, state }, taskid, param) => {
  dispatch(mutationType.RESET_TASKS);
}
