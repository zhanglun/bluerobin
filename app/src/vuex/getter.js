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
  return state.tasks.all;
}

export function isShowDetail(state) {
  console.log(state.tasks.showDeatil);
  return state.tasks.showDeatil;
}

export function getTaskDetail(state) {
  return state.tasks.taskDetail;
}
