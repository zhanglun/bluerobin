export const changeMyState = (text) => {
  return {
    type: 'CHANGE_STATE',
    text,
  };
};
