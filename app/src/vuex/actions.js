import request from 'superagent';
import agentPrefix from 'superagent-prefix';
import * as mutationType from '../constants/mutationType';

let baseURL = agentPrefix('http://localhost:1234/api');

// action 会收到 store 作为它的第一个参数
// 既然我们只对事件的分发（dispatch 对象）感兴趣。（state 也可以作为可选项放入）
// 我们可以利用 ES6 的解构（destructuring）功能来简化对参数的导入
export const incrementCounter = function({ dispatch, state }) {
  dispatch('INCREMENT', 1);
};

export const authenticate = function({ dispatch, state }) {
  request
    .get('/authenticate')
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then((res) => {
      dispatch(mutationType.AUTHENTICATE, res.body);
    }, (err) => {
    	dispatch(mutationType.AUTHENTICATE_ERROR, err);
    });
};

export const fetchLists = function({ dispatch, state }) {
  request
    .get('/lists')
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .then((res) => {
      dispatch(mutationType.FETCH_LISTS, res.body);
    }, (err) => {});
};
