import request from 'superagent';
import agentPrefix from 'superagent-prefix';
import {
  AUTHENTICATE,
  AUTHENTICATE_ERROR,
} from '../constants/actionType';

let baseURL = agentPrefix('http://localhost:1234/api');

/**
 * 获取list列表
 * @return {Function} dispatch
 */
export const authenticateAction = ({dispatch, state}) => {
  dispatch(AUTHENTICATE, 1);
  // return (dispatch) => {
  //   // get lists
  //   request
  //     .get('/authenticate')
  //     .set('x-access-token', window.localStorage.token)
  //     .use(baseURL)
  //     .then((res) => {
  //       console.log(res);
  //       dispatch({
  //         type: AUTHENTICATE,
  //         user: res.body,
  //       }, (err) => {
  //         dispatch({
  //           type: AUTHENTICATE_ERROR,
  //           error: err,
  //         });
  //       });
  //     });
  // };
};

