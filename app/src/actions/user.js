import request from 'superagent';
import agentPrefix from 'superagent-prefix';
import * as mutationType from '../mutationType';

let baseURL = agentPrefix('http://localhost:1234/api');

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
