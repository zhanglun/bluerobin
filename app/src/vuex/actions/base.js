import agentPrefix from 'superagent-prefix';

var url = window.localStorage.apiurl || 'http://zhanglun.daoapp.io/api';

let baseURL = agentPrefix(url);
// let baseURL = agentPrefix('http://localhost:1234/api');
// let baseURL = agentPrefix('http://zhanglun.daoapp.io/api');

export default baseURL;
