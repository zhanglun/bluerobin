export function getUserInfo(state) {
  return state.user.data;
}

export function getLists(state) {
  return state.lists.all;
}

export function getTasks(state) {
  return state.tasks.active;
}
