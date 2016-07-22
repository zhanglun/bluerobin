<template>
  <div class="modal-mask modal_sign" transition="modal-sign">
    <div class="modal-wrapper" @click="close()" >
      <div class="modal-container" @click.stop>
        <div class="card">
        <div class="card-header">
            <div class="task-checkbox">
              <label class="robin-checkbox" for="{{task.id}}">
                <input type="checkbox" id="{{task.id}}" class="robin-checkbox--input" v-on:change="toggleTask(task)" :checked="task.completed">
                <span class="robin-checkbox--label"></span>
              </label>
            </div>
            <input class="card-header--title card-header--input" :value="task.title" v-autoblur="isEditing" @focus="isEditing = true" @keyup.esc="cancelEdit" @keyup.enter="doEdit" />
          </div>
          <div class="card-body">
            <div class="taskdetail-metadata">
              <div class="taskdetail-create">
                <span>创建时间：</span><span>{{task.create_time}}</span>
              </div>
              <div class="taskdetail-deadline">
                <span>截止时间：</span><span>{{task.deadline}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import * as tasksActions from '../../vuex/actions/tasks';
  import * as getters from '../../vuex/getter';
  export default {
    data() {
      return {
        isEditing: false,
      };
    },
    vuex: {
      actions: {
        edit: tasksActions.editTask,
        hideTaskDetail: tasksActions.hideTaskDetail,
      },
      getters: {
        task: getters.getTaskDetail,
      }
    },
    ready() {
      let _this = this;
      document.addEventListener('keyup', (e) => {
        if(e.keyCode === 27){
          _this.hideTaskDetail();
        }
      });
    },
    directives: {
      'autofocus'(value) {
        if (!value) {
          return;
        }
        var el = this.el;
        setTimeout(() => {
          el.focus();
        }, 0);
      },
      'autoblur'(value) {
        if (value) {
          return;
        }
        var el = this.el;
        setTimeout(() => {
          el.blur();
        }, 0);
      }
    },
    methods: {
      close() {
        this.hideTaskDetail();
      },
      cancelEdit(e) {
        e.target.value = this.task.title;
        this.isEditing = false;
        e.stopPropagation();
      },
      doEdit(e) {
        let task = this.task;
        let param = {
          title: e.target.value.trim(),
        };
        if (!param.title) {
          return false;
        }
        this.isEditing = false;
        this.edit(task.id, param);
      }
    },
  };
</script>
<style lang="less">

  @container-background: #f7f7f7;
  @container-header-background: #fff;
  @modal-spearate-line: #ebebeb;


.card {
  width: 680px;
  height: 540px;
  margin: 0 auto;
  background: @container-background;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all 300ms 0s;
  transform-origin: 50% 0;
}

.card-header {
  display: flex;
  align-items: center;
  margin-top: 0;
  color: spin(#000, 60%);
  padding: 10px 14px;
  border-bottom: 1px solid @modal-spearate-line;
  background: @container-header-background;
  &--input {
    width: 100%;
    padding: 8px 8px;
    background: @container-header-background;
    font-size: 18px;
    font-weight: bolder;
    box-sizing: border-box;
    border: none;
    outline: none;
    &:focus {
      background: @container-header-background;
    }
  }
}

.card-body {
  margin: 20px 0;
}

.card-footer {
  .footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}


</style>