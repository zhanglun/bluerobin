import request from 'superagent';
import * as mutationType from '../mutationType';
import baseURL from './base';

// 用户认证
export const authenticate = function({ dispatch, state }, callback) {
  request
    .get('/authenticate')
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then((res) => {
      dispatch(mutationType.AUTHENTICATE, res.body);
      if (callback) {
        callback(res.body);
      }
    }, () => {
      dispatch(mutationType.AUTHENTICATE_ERROR, {});
      if (callback) {
        callback(null);
      }
    });
};

// 用户登录
export const login = function({ dispatch, state }, param) {
  request
    .post('/users/login')
    .use(baseURL)
    .send(param)
    .then((res) => {
      window.localStorage.token = res.body.token;
      dispatch(mutationType.LOGIN, res.body);
    }, () => {});
};
