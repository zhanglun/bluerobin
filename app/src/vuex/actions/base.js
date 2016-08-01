import agentPrefix from 'superagent-prefix';

let baseURL = agentPrefix('http://localhost:1234/api');
// let baseURL = agentPrefix('http://zhanglun.daoapp.io/api');

export default baseURL;
