export const getUserInfo = (state) => {
  return state.user.data;
};

export const getUserAuth = (state) => {
  return state.user.auth;
};

export const getLists = (state) => {
  return state.lists.all;
};

export const getTasks = (state) => {
  return state.tasks.all;
};

export const isShowDetail = (state) => {
  return state.tasks.showDetail;
};

export const getTaskDetail = (state) => {
  return state.tasks.taskDetail;
};
