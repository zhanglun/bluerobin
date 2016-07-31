<template>
  <div class="modal-mask modal-animation_sign" transition="modal-animation_sign">
    <div class="modal-wrapper" @click="close()" >
      <div class="modal-container">
        <div class="card" @click.stop>
          <div class="card-header">
            <label class="robin-checkbox" for="{{task.id}}">
              <input type="checkbox" id="{{task.id}}" class="robin-checkbox--input" v-on:change="toggleTask(task)" :checked="task.completed">
              <span class="robin-checkbox--label"></span>
              <span class="robin-checkbox--tick"></span>
            </label>
            <input class="card-header--title card-header--input" :value="task.title" v-autoblur="isTitleEditing" @focus="isTitleEditing = true" @keyup.esc="doEditTitle" @keyup.enter="doEditTitle" />
          </div>
          <div class="card-body">
            <div class="card-metadata">
              <!--  标签 -->
<!--               <div class="card-metadata-item">
                <span class="material-icons card-metadata-item--icons">label_outline</span>

              </div> -->
              <div class="card-metadata-item">
                <span class="material-icons card-metadata-item--icons">insert_invitation</span>
                <span class="card-metadata-item--content">{{task.deadline}}</span>
              </div>
              <div class="card-metadata-item">
                <span class="material-icons card-metadata-item--icons">create</span>
                <div class="card-metadata-item--content" v-bind:class="{editing: isDescEditing}" @dblclick="modifyDesc">
                  <div class="content-value markdownPrased">{{{descriptionMarked}}}</div>
                  <textarea class="content-input" v-autofocus="isDescEditing" @keyup.esc="doEditDesc" @blur="doEditDesc" v-model="task.description"></textarea>
                </div>
              </div>
              <!-- 子任务 -->
<!--               <div class="card-subtasks">
                <ul>
                  <li></li>
                </ul>
                <div class="card-metadata-item">
                  <span class="material-icons card-metadata-item--icons">add</span>
                </div>
              </div> -->
            </div>
          </div>
          <div class="card-footer">
            <span></span>
            <div> 创建于：{{task.create_time}}</div>
            <div class="card-footer--actions">
              <i class="material-icons" @click="deleteTask(task)">delete</i>
              <span>删除</span>
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
  import marked from 'marked';
  import Tool from 'tool';
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  });

  export default {
    data() {
      return {
        isTitleEditing: false,
        isDescEditing: false,
      };
    },
    vuex: {
      actions: {
        edit: tasksActions.editTask,
        delete: tasksActions.deleteTask,
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
    computed: {
      descriptionMarked() {
        return marked(this.task.description || '暂无描述');
      },
      descriptionEncode() {
        return Tool.htmlEncode(this.task.description);
      }
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
        this.isTitleEditing = false;
        e.stopPropagation();
      },
      modifyDesc() {
        console.log('modifyDesc');
        this.isDescEditing  = true;
      },
          deleteTask(task) {
      this.delete(task.id);
    },
      doEditTitle(e) {
        let task = this.task;
        let param = {
          title: e.target.value.trim(),
        };
        if (!param.title) {
          return false;
        }
        this.isTitleEditing = false;
        this.edit(task.id, param);
        e.stopPropagation();
      },
      doEditDesc(e) {
        let task = this.task;
        let param = {
          description: e.target.value.trim(),
        };
        if (!param.description) {
          return false;
        }
        this.isDescEditing = false;
        this.edit(task.id, param);
        e.stopPropagation();
      }
    },
  };
</script>
<style lang="less">
  @import '../../public/stylesheets/variables';
  .card {
    display: flex;
    flex-direction: column;
    width: @modal-card-width;
    height: 540px;
    margin: 0 auto;
    background: @modal-container-background;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all 300ms 0s;
  }

  .card-header {
    display: flex;
    min-height: 55px;
    box-sizing: border-box;
    align-items: center;
    margin-top: 0;
    color: spin(#000, 60%);
    padding: 16px 18px;
    border-bottom: 1px solid @modal-spearate-line;
    background: @modal-container-header-background;
    &--input {
      width: 100%;
      padding: 0 10px;
      background: @modal-container-header-background;
      font-size: 18px;
      font-weight: bolder;
      box-sizing: border-box;
      border: none;
      outline: none;
      .text-overflow();
      &:focus {
        background: @modal-container-header-background;
      }
    }
  }

  .card-body {
    overflow-y: auto;
    flex: 1 1 auto;
  }

  .card-metadata {
    padding: 8px 0;
    &-item {
      display: flex;
      min-height: 46px;
      box-sizing: border-box;
      align-items: flex-start;
      padding: 6px 14px;
      position: relative;
      &::after {
        content: '';
        height: 0;
        border-bottom: 1px solid @modal-spearate-line;
        position: absolute;
        left: 50px;
        right: 50px;
        bottom: 0;
      }
      &--icons {
        margin-right: 6px;
        padding: 4px;
      }
      &--content {
        font-size: 14px;
        padding: 5px 0;
        width: @modal-card-width - 100px;
        .content-input {
          display: none;
          height: 300px;
          width: 100%;
          box-sizing: border-box;
          border: none;
          resize: none;
          outline: none;
          font-size: 14px;
          background: none;
        }
        &.editing {
          .content-input {
            display: block;
          }
          .content-value {
            display: none;
          }
        }
      }
    }
  }

  .card-footer {
    min-height: 46px;
    font-size: 14px;
    padding: 14px;
    color: #a3a3a2;
    border-top: 1px solid @modal-spearate-line;
    background: @modal-container-header-background;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &--actions {
      cursor: pointer;
      display: flex;
      align-items: center;
      color: fadeout(#000, 30%);
      &:hover{
        color:#000;
      }
    }
  }


</style>