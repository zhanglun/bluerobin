<template>
  <div transition="animation_showtask" v-bind:class="{finished: task.archived, editing: task == taskEditing, 'collection-item': iscollection, 'task': !iscollection}" @click="showTaskDetail(task)">
    <div class="task-content">
      <div class="task-content-box">{{task.title}}</div>
    </div>
    <div class="task-labels" v-if="iscollection">
      <span class="task-labels--item">{{task.list_name}}</span>
    </div>
    <div class="task-toolbar" @click.stop>
      <i class="material-icons task-toolbar--icons" @click="toggleTask(task)" data-tooltip="归档" v-if="!task.archived && !task.istrash">archive</i>
      <i class="material-icons task-toolbar--icons" @click="toggleTask(task)" data-tooltip="取消归档" v-if="task.archived && !task.istrash">unarchive</i>
      <i class="material-icons task-toolbar--icons" v-if="task.istrash" data-tooltip="还原" @click="undoTask(task)">undo</i>
      <i class="material-icons task-toolbar--icons" @click="deleteTask(task)" v-if="task.istrash" data-tooltip="彻底删除">delete_forever</i>
      <i class="material-icons task-toolbar--icons" @click="deleteTask(task)" v-if="!task.istrash" data-tooltip="删除">delete</i>
    </span>
  </div>
</template>
<script>
  import * as tasksActions from '../../vuex/actions/tasks';
  import * as getters from '../../vuex/getter';
  export default {
    props: ['iscollection', 'task', 'index'],
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
        edit: tasksActions.editTask,
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
        this.task.archived = !this.task.archived;
        this.toggle(this.task.id, {archived: this.task.archived});
      },
      modifyTask(task) {
        if (task.archived) {
          return false;
        }
        this.taskEditing = task;
      },
      showTaskDetail(task) {
        if(!this.istrash){
          this.fetchDetail(task.id);
        }
      },
      deleteTask(task) {
        this.delete(task);
      },

      undoTask(task) {
        let param = {
          istrash: false,
        };
        this.edit(task.id, param);
        task.istrash = false;
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
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    font-size: 1.6rem;
    color: #343434;
    background: fade(@white, 85%);
    border-bottom: 1px solid #DCDCDC;
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
      .task-toolbar {
        display: block;
      }
    }
  }
  .task-content {
    flex: 1 1 auto;
    overflow: hidden;
    margin-right: 6rem;
    padding: 12px;
    cursor: pointer;
    &-input {
      display: none;
      width: 100%;
      box-sizing: border-box;
    }
    &-box {
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .task-toolbar {
    display: none;
    font-size: 0;
    position: absolute;
    right: 8px;
    top: 30%;
    &--icons {
      margin:0 2px;
      cursor: pointer;
      transition: all 0.3 ease-in-out 0s;
      color: fadeout(#000, 30%);
      &:hover{
        color: #000;
      }
    }
  }

  .collection-item{
    margin-bottom: 10px;
    box-sizing: border-box;
    font-size: 1.4rem;
    color: #343434;
    background: rgba(255, 255, 255, 0.85);
    border-bottom: 1px solid #DCDCDC;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1 0 20%;
    margin: 5px 5px;
    &:hover {
      .task-toolbar {
        visibility: visible;
        display: flex;
      }
    }
    .task-content {
      padding: 12px;
      width: 100%;
      margin: 0;
      box-sizing: border-box;
    }
    .task-labels {
      width: 100%;
      padding: 2px 12px;
      box-sizing: border-box;

      &--item{
        padding: 4px 6px;
        border-radius: 2px;
        font-size: 12px;
        background-color: #e8e8e8;
        color: rgba(0,0,0,0.7);
      }
    }
    .task-metadata {
      padding: 6px 10px;
      &--item {
        display: inline-block;
      }
    }
    .task-toolbar {
      visibility: hidden;
      display: flex;
      width: 100%;
      position: static;
      padding: 2px 6px 6px;
      box-sizing: border-box;
      font-size: 0;
      line-height: normal;
      align-items: center;
      justify-content: flex-end;
      &--icons {
        margin: 0 2px;
        cursor: pointer;
        color: fadeout(#000, 30%);
        &:hover{
          color: #000;
        }
      }
    }
    @media only screen and (max-width : 961px) {
      width: 100%;
    }
    @media only screen and (min-width : 961px) {
      width: 46.5%;
    }
    @media only screen and (min-width : 1025px) {
      width: 32.6%;
    }
    @media only screen and (min-width : 1367px) {
      width: 24.5%;
    }
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
      transition: all 0.5s cubic-bezier(0.55,0,0.1,1);
    }
  }
</style>
