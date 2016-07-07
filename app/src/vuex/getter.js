export function getUserInfo(state) {
	console.log('getUserInfo', state);
  return state.user.data;
}

export function getUserAuth(state) {
	return state.user.auth;
}

export function getLists(state) {
  return state.lists.all;
}

export function getTasks(state) {
  return state.tasks.all;
}
