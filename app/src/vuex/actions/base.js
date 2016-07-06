import agentPrefix from 'superagent-prefix';

let baseURL = agentPrefix('http://localhost:1234/api');

export default baseURL;
