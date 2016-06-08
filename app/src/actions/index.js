export const addTask = (text) => {
  return {
    type: 'ADD_TASK',
    id: '11111111111',
    text,
  };
};

export const changeMyState = (nextState) => {
  return {
    type: 'CHANGE_STATE',
    nextState: nextState
  };
};
