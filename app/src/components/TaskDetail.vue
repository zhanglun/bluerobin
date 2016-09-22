<template>
  <div class="card" @click.stop v-bind:class="{card__trash: task.istrash}">
    <div class="loader loader__hover" v-show="isRequestingTaskDetail" transition="animation-loader">
      <div class="loader-inner ball-clip-rotate-multiple">
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="card-status card-status__archived" v-if="task.archived && !task.istrash">
      该任务已经归档
    </div>
    <div class="card-status card-status__trash" v-if="task.istrash">
      该任务已被删除，无法编辑
    </div>
    <div class="card-header">
      <input class="card-header--title card-header--input" :value="task.title" v-autoblur="isTitleEditing" @focus="isTitleEditing = true" @keyup.esc="doEditTitle" @keyup.enter="doEditTitle" :disabled="task.istrash" />
    </div>
    <div class="card-body">
      <div class="card-metadata">
        <!--  标签 -->
        <div class="card-metadata-item">
          <span class="material-icons card-metadata-item--icons">label_outline</span>
        </div>
        <div class="card-metadata-item">
          <i class="material-icons card-metadata-item--icons" data-tooltip="更新时间">update</i>
          <span class="card-metadata-item--content">{{task.update_time}}</span>
        </div>
        <div class="card-metadata-item">
          <i class="material-icons card-metadata-item--icons" data-tooltip="截止时间">alarm</i>
          <span class="card-metadata-item--content">Due: {{task.deadline}}</span>
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
      <div class="card-footer--toolbar">
        <i class="material-icons" @click="toggleTask(task)" data-tooltip="归档" data-tooltip-pos="down" v-if="!task.archived">archive</i>
        <i class="material-icons" @click="toggleTask(task)" data-tooltip="取消归档" data-tooltip-pos="down" v-if="task.archived">unarchive</i>
        <i class="material-icons" @click="deleteTask(task)" v-if="task.istrash" data-tooltip="彻底删除">delete_forever</i>
        <i class="material-icons" @click="deleteTask(task)" v-if="!task.istrash" data-tooltip="删除">delete</i>
      </div>
    </div>
  </div>
</template>
<script>
  import * as tasksActions from '../vuex/actions/tasks';
  import * as getters from '../vuex/getter';
  import marked from 'marked';
  import Tool from 'tool';

  let markedRenderer = new marked.Renderer();
  markedRenderer.listitem = function(text) {
    if (/^\s*\[[x ]\]\s*/.test(text)) {
      text = text
      .replace(/^\s*\[ \]\s*/, '<input type="checkbox" class="empty checkbox icon" />')
      .replace(/^\s*\[x\]\s*/, '<input type="checkbox" checked class="checked checkbox icon" />');
      return '<li style="list-style: none">' + text + '</li>';
    } else {
      return '<li>' + text + '</li>';
    }
  };
  marked.setOptions({
    renderer: markedRenderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
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
        toggle: tasksActions.toggleTask,
        delete: tasksActions.deleteTask,
        hideTaskDetail: tasksActions.hideTaskDetail,
      },
      getters: {
        task: getters.getTaskDetail,
        isRequestingTaskDetail: getters.isRequestingTaskDetail,
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
        if(this.task.istrash){
          this.isDescEditing  = false;
          return false;
        }
        this.isDescEditing  = true;
      },
      toggleTask(task) {
        task.archived = !task.archived;
        this.toggle(task.id, {archived: task.archived});
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
  @import '../public/stylesheets/variables';
  .card {
    display: flex;
    flex-direction: column;
    flex: 0 0 @taskdetail-card-width;
    height: 100%;
    margin: 0 auto;
    background: @taskdetail-container-background;
    border-radius: 2px;
    // box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all 300ms 0s;
    position: relative;
    &__trash {
      .card-header, .card-metadata {
        cursor: not-allowed;
      }
    }
    &-status{
      color: fadeout(#000, 60%);
      font-size: 14px;
      padding: 12px 18px;
      &__archived{
        background-color: #fdfae5;
        background-image: -webkit-linear-gradient(top left, rgba(0,0,0,.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,.05) 50%, rgba(0,0,0,.05) 75%, transparent 75%, transparent);
        background-image: -o-linear-gradient(top left, rgba(0,0,0,.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,.05) 50%, rgba(0,0,0,.05) 75%, transparent 75%, transparent);
        background-image: linear-gradient(to bottom right, rgba(0,0,0,.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,.05) 50%, rgba(0,0,0,.05) 75%, transparent 75%, transparent);
        background-size: 14px 14px;
      }
      &__trash{
        background-color: fade(#ff7473, 80%);
        background-image: linear-gradient(to bottom right, #ff7473 25%, transparent 25%, transparent 50%, #ff7473 50%, #ff7473 75%, transparent 75%, transparent);
        background-size: 14px 14px;
      }
    }
  }

  .card-header {
    display: flex;
    min-height: 55px;
    box-sizing: border-box;
    align-items: center;
    color: fadeout(#000, 60%);
    margin-top: 0;
    padding: 16px 18px;
    border-bottom: 1px solid @taskdetail-spearate-line;
    background: @taskdetail-container-header-background;
    &--input {
      width: 100%;
      background: none;
      font-size: 18px;
      font-weight: bolder;
      box-sizing: border-box;
      border: none;
      outline: none;
      .text-overflow();
      &:focus {
        background: @taskdetail-container-header-background;
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
        border-bottom: 1px solid @taskdetail-spearate-line;
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
        width: @taskdetail-card-width - 100px;
        word-break: all;
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
    font-size: 14px;
    padding: 12px;
    min-height: 26px;
    color: #a3a3a2;
    border-top: 1px solid @taskdetail-spearate-line;
    background: @taskdetail-container-header-background;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &--toolbar {
      cursor: pointer;
      display: flex;
      align-items: center;
      color: fadeout(#000, 30%);
      &:hover{
        color:#000;
      }
    }
  }

  /**
   * animation slide
   */

  .animation-showtaskdetail{
    &-transition {
      transition: all 0.3s ease;
      overflow: hidden;
    }
    &-enter,
    &-leave {
      flex: 0;
    }
  }

  </style>