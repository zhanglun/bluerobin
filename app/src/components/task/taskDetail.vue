<template>
  <div class="taskdetail-mask" v-if="show"  transition="taskdetail">
    <div class="taskdetail-wrapper" @click="close()" >
      <div class="taskdetail-container" @click.stop>
        <div class="taskdetail-header">
        <span class="">Title:</span>
          <input class="taskdetail-header--title taskdetail-header--input" v-model="taskDetail.title" v-autoblur="titleEditing" v-on:focus="titleEditing = true" v-on:blur="doEdit" v-on:keyup.enter="doEdit"/>
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
        titleEditing: false,
      };
    },
    vuex: {
      actions: {
        edit: tasksActions.editTask,
        hideTaskDetail: tasksActions.hideTaskDetail,
      },
      getters: {
        show: getters.isShowDetail,
        taskDetail: getters.getTaskDetail,
      }
    },
    ready() {
      document.addEventListener("keyup", (e) => {
        if (this.show && e.keyCode === 27) {
          this.close();
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
      doEdit() {
        let task = this.taskDetail;
        let param = {
          title: task.title,
        };
        this.titleEditing = false;
        this.edit(task.id, param);
      }
    },
  };
</script>
<style lang="less">
@containerBg: #ececec;

//  taskdetail
.taskdetail-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.taskdetail-wrapper {
  display: table-cell;
  vertical-align: middle;
  perspective: 1300px;
}

.taskdetail-container {
  width: 740px;
  height: 540px;
  padding: 10px;
  margin: 0 auto;
  background: @containerBg;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all 300ms 0s;
  transform-origin: 50% 0;
}

.taskdetail-header {
  display: flex;
  align-items: center;
  margin-top: 0;
  color: spin(#000, 60%);
  padding: 0 30px;
  &--input {
    width: 100%;
    padding: 8px 8px;
    background: @containerBg;
    font-size: 18px;
    font-weight: bolder;
    box-sizing: border-box;
    border: none;
    outline: none;
    &:focus {
      background: #fff;
    }
  }
}

.taskdetail-body {
  margin: 20px 0;
}

.taskdetail-footer {
  .footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.taskdetail-enter,
.taskdetail-leave {
  opacity: 0;
}

.taskdetail-enter .taskdetail-container{
  transform: rotateX(60deg);
  opacity: 1;
}

.taskdetail-leave .taskdetail-container {
  transform: rotateX(-60deg);
  opacity: 1;
}
</style>