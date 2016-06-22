import request from 'superagent';
import agentPrefix from 'superagent-prefix';
import {
  FETCH_LISTS,
} from '../constants/actionType';

let baseURL = agentPrefix('http://localhost:1234/api');

export const fetchLists = () => {
  return (dispatch) => {
    // get lists
    request
    .get('/lists')
    .set('x-access-token', window.localStorage.token)
    .use(baseURL)
    .end(function(err, res) {
      dispatch({
        type: FETCH_LISTS,
        lists: res.body,
      });
    });
  };
};
