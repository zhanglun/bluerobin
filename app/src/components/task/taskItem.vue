<template>
  <div class="task" transition="animation_showtask" v-bind:class="{finished: task.completed, editing: task == taskEditing}" >
    <div class="task-checkbox">
      <label class="robin-checkbox" for="{{task.id}}">
        <input type="checkbox" id="{{task.id}}" class="robin-checkbox--input" v-on:change="toggleTask(task)" :checked="task.completed">
        <span class="robin-checkbox--label"></span>
      </label>
    </div>
    <div class="task-content" @click="showTaskDetail(task)">
      <div class="task-content-box">{{task.title}}</div>
      <div class="task-metadata" v-if="task.completed">
        <span>更新时间：{{task.update_time}}</span>
        <span>创建时间：{{task.create_time}}</span>
      </div>
<!--       <div class="robin-textfield task-content-input">
        <input class="robin-textfield--input robin-textfield--input_default" type="text" v-task-autofocus="task == taskEditing" v-model="task.title" class="edit" @blur="doEdit(task)"  @keyup.esc="doEdit(task)" @keyup.enter="doEdit(task, $event)" v-model="titleAfterParse"/>
      </div>
  -->     
    </div>
    <span class="task-controller">
      <i class="material-icons" @click="deleteTask(task)">clear</i>
    </span>
  </div>
</template>

<script>
import * as tasksActions from '../../vuex/actions/tasks';
import * as getters from '../../vuex/getter';
export default {
  props: ['tasktitle', 'task', 'index'],
  data() {
    return {
      editing: false,
      titleAfterParse: '',
      taskEditing: null,
      taskDetail: {}
    };
  },
  vuex: {
    actions: {
      toggle: tasksActions.toggleTask,
      delete: tasksActions.deleteTask,
      // edit: tasksActions.editTask,
      fetchDetail: tasksActions.fetchTaskDetail,
    },
    getters: {
      showDetail: getters.isShowDetail,
    }
  },
  computed: {
    titleAfterParse() {
      return twemoji.parse(this.task.title);
    }
  },
  ready() {
  },

  directives: {
    'task-autofocus'(value) {
      if (!value) {
        return;
      }
      var el = this.el;
      setTimeout(() => {
        el.focus();
      }, 0);
    }
  },
  methods: {
    toggleTask() {
      this.task.completed = !this.task.completed;
      this.toggle(this.task.id, {completed: this.task.completed});
    },
    modifyTask(task) {
      if (task.completed) {
        return false;
      }
      this.taskEditing = task;
    },
    showTaskDetail(task) {
      this.fetchDetail(task.id);
    },
    deleteTask(task) {
      this.delete(task.id);
    },

    doEdit(task) {
      console.log('taskitem do edit');
      if (!this.taskEditing) {
        return false;
      }
      // if (this.taskEditing.title === task.title) {
      this.taskEditing = null;
      //   return false;
      // }
      task.title = task.title.replace(/</g, "&lt").replace(/>/g, "&gt;");
      this.titleAfterParse = twemoji.parse(task.title);
      this.edit(task);
    },
  },
};
</script>

<style lang="less">

@import '../../public/stylesheets/variables';

@editbox-height: 34px;

.modify {
  width: 100%;
  box-sizing: border-box;
  line-height: @editbox-height;
  height: @editbox-height;
  padding: 0 4px;
}
.task {
  // flex: 1 1 320px;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  font-size: 1.6rem;
  color: #343434;
  background: fade(@white, 85%);
  border-bottom: 1px solid #DCDCDC;
  padding: 0 0.5em;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  &:hover {
    background: fade(#000, 10%)
  }
  &.finished {
    font-size: 12px;
    .task-content {
      cursor: default;
      text-decoration: line-through;
      color: lighten(#343434, 40%);
    }
  }
  &.editing {
    .task-content {
      &-box {
        display: none;
      }
      &-input {
        display: block;
      }
    }
  }
  &:hover {
    .task-controller {
      display: block;
    }
  }
}
.task-content {
  flex: 1 1 auto;
  overflow: hidden;
  margin-right: 6rem;
  cursor: pointer;
  &-input {
    display: none;
    width: 100%;
    box-sizing: border-box;
  }
  &-box {
    line-height: 31px;
    margin-top: -3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.task-controller {
  display: none;
  position: absolute;
  right: 8px;
  top: 30%;
}

/*
  Task item animation
 */
.animation_showtask-transition {
  transition: all 0.5s ease;
}
.animation_showtask-enter, .animation_showtask-leave {
  opacity: 0;
  transform: rotateX(180deg);
}
.animation_showtask {
  &-enter {
    opacity: 0;
    transform: rotateX(180deg);
  }
  &-levae {
    opacity: 0;
    transform: rotateX(180deg);
    transition: all 0.3s ease;
  }
}
</style>
