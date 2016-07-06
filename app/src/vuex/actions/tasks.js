import request from 'superagent';
import * as mutationType from '../mutationType';
import baseURL from './base';

export const fetchTasks = function({ dispatch, state}, query) {
  request
    .get('/tasks')
    .query(query)
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then((res) => {
      console.log(mutationType.FETCH_TASKS);
      dispatch(mutationType.FETCH_TASKS, res.body);
    }, (err) => {
      dispatch(mutationType.FETCH_TASKS_ERROR, err);
    });
};
