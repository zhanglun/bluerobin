export function getUserInfo(state) {
	console.log('getUserInfo');
	return state.user.data;
}

export function getLists(state) {
	return state.lists.all;
}