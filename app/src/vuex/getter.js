export function getAccountInfo(state) {
	console.log('getAccountInfo');
	return state.account.user;
}

export function getLists(state) {
	return state.lists;
}