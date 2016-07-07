import request from 'superagent';
import * as mutationType from '../mutationType';
import baseURL from './base';

export const fetchLists = function({ dispatch }) {
  request
    .get('/lists')
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then((res) => {
      dispatch(mutationType.FETCH_LISTS, res.body);
    }, (err) => {
      dispatch(mutationType.FETCH_LISTS_ERROR, err);
    });
};

export const addList = ({ dispatch }, param) => {
  request
    .post('/lists')
    .set('x-access-token', window.localStorage.token)
    .send(param)
    .use(baseURL)
    .then((res) => {
      console.log(res);
      dispatch(mutationType.ADD_LIST, res.body);
    }, (err) => {
      dispatch(mutationType.ADD_LIST_ERROR, err);
    });
};

export const deleteList = ({ dispatch }, param) => {
  request
    .delete('/lists/' + param.id)
    .send(param)
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then(() => {
      dispatch(mutationType.DELETE_LIST, param.id);
    }, (err) => {
      dispatch(mutationType.DELETE_LIST_ERROR, err);
    });
};

export const editList = ({ dispatch }, id, param) => {
  request
    .put('/lists/' + id)
    .send(param)
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then((res) => {
      dispatch(mutationType.EDIT_LIST, res.body);
    }, (err) => {
      dispatch(mutationType.EDIT_LIST_ERROR, err);
    });
};
