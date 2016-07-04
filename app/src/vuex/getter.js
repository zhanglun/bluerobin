export function getAccountInfo(state) {
	console.log('getAccountInfo');
	return state.user.data;
}

export function getLists(state) {
	return state.lists.all;
}