import request from 'superagent';
import agentPrefix from 'superagent-prefix';
import {
  FETCH_LISTS,
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
            type: 'FETCH_LISTS_ERROR',
            error: err,
          });
        });
      });
  };
};

