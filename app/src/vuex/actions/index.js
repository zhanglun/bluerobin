import * as userActions from './user';
import * as listsActions from './lists';
import * as tasksActions from './tasks';

// export const user = userActions;
// export const lists = listsActions;
// export const tasks = tasksActions;
export default Object.assign({}, userActions, listsActions, tasksActions)