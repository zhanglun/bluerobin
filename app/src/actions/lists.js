import request from 'superagent';
import agentPrefix from 'superagent-prefix';
import {
  FETCH_LISTS,
  FETCH_LISTS_ERROR,
  ADD_LIST,
  ADD_LIST_ERROR,

  DELETE_LIST,
  DELETE_LIST_ERROR,
} from '../constants/actionType';

let baseURL = agentPrefix('http://localhost:1234/api');

/**
 * 获取list列表
 * @return {Function} dispatch
 */
export const fetchLists = () => {
  return (dispatch) => {
    // get lists
    request
      .get('/lists')
      .set('x-access-token', window.localStorage.token)
      .use(baseURL)
      .then((res) => {
        console.log(res);
        dispatch({
          type: FETCH_LISTS,
          lists: res.body,
        }, (err) => {
          dispatch({
            type: FETCH_LISTS_ERROR,
            error: err,
          });
        });
      });
  };
};

export const addList = (param) => {
  return (dispatch) => {
    request
      .post('/lists')
      .set('x-access-token', window.localStorage.token)
      .send(param)
      .use(baseURL)
      .then((res) => {
        console.log(res);
        dispatch({
          type: ADD_LIST,
          list: res.body,
        }, (err) => {
          dispatch({
            type: ADD_LIST_ERROR,
            error: err,
          });
        });
      });
  };
};

export const deleteList = (param) => {
  return (dispatch) => {
    request
      .delete('/lists/' + param.id)
      .set('x-access-token', window.localStorage.token)
      .send(param)
      .use(baseURL)
      .then((res) => {
        dispatch({
          type: DELETE_LIST,
          list: {
            id: param.id,
          },
        }, (err) => {
          dispatch({
            type: DELETE_LIST_ERROR,
            error: err,
          });
        });
      });
  };
};
