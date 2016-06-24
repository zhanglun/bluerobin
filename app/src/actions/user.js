import request from 'superagent';
import agentPrefix from 'superagent-prefix';
import {
  AUTHENTICATE,
} from '../constants/actionType';

let baseURL = agentPrefix('http://localhost:1234/api');

/**
 * 获取list列表
 * @return {Function} dispatch
 */
export const authenticate = () => {
  return (dispatch) => {
    // get lists
    request
      .get('/authenticate')
      .set('x-access-token', window.localStorage.token)
      .use(baseURL)
      .then((res) => {
        console.log(res);
        dispatch({
          type: AUTHENTICATE,
          user: res.body,
        }, (err) => {
          dispatch({
            type: FETCH_LISTS_ERROR,
            error: err,
          });
        });
      });
  };
};
