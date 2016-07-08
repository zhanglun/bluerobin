export function getUserInfo(state) {
  return state.user.data;
}

export function getUserAuth(state) {
  return state.user.auth;
}

export function getLists(state) {
  return state.lists.all;
}

export function getTasks(state) {
  // return state.tasks.all;
  console.log(state);
  return {
    active: state.tasks.active,
    completed: state.tasks.completed,
  };
}
