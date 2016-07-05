import request from 'superagent';
import * as mutationType from '../mutationType';
import baseURL from './base';


/**
 * 用户认证
 */
export const authenticate = function({ dispatch, state }) {
  request
    .get('/user/authenticate')
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then((res) => {
      dispatch(mutationType.AUTHENTICATE, res.body);
    }, (err) => {
      dispatch(mutationType.AUTHENTICATE_ERROR, err);
    });
};

/**
 * 用户登录
 */
export const login = function({ dispatch, state }) {
  request
    .get('/user/login')
    .use(baseURL)
    .then((res) => {
      dispatch(mutationType.LOGIN, res.body);
    }, (err) => {});

};