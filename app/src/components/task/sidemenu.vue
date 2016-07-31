<template>
  <div class="sidebar">
    <div class="sidebar-container">
      <ul class="side-menu">
        <li v-for="list in lists">
          <a class="side-menu__item" v-link="{name: 'list', params: {id: list.id}}">
            <span class="material-icons">list</span>
            <span class="side-menu__item-content">{{list.name}}</span>
            <span class="side-menu__item-count">{{list.task_count_total - list.task_count_completed - list.task_count_istrash || ''}}</span>
            <span class="material-icons edit" @click="showCurrent(e, list)" data-tooltip="编辑" data-tooltip-pos="down">edit</span>
          </a>
        </li>
      </ul>
      <ul class="side-menu">
        <li>
          <a class="side-menu__item" v-link="{name: 'completed', params: {id: 'completed'}}">
            <span class="material-icons">done_all</span>
            <span class="side-menu__item-content">已完成</span>
          </a>
        </li>
        <li>
          <a class="side-menu__item" v-link="{name: 'trash', params: {id: 'trash'}}">
            <span class="material-icons">delete</span>
            <span class="side-menu__item-content">回收站</span>
          </a>
        </li>
      </ul>
      <div class="side-actions">
        <span class="side-actions__item" @click="showModal = true">
          <span class="material-icons">add</span>
          <span class="side-actions__item-content">新建分类</span>
        </span>
      </div>
    </div>
  </div>
      <modal :show="showModal">
      <div slot="content" class="list-editor">
        <div class="list-editor-header">
          <h3 class="list-editor-header--title">创建新的清单</h3>
        </div>
        <div class="list-editor-body">
          <div class="robin-textfield">
            <input type="text" class="robin-textfield--input robin-textfield--input_default" v-model="newList.name"/>
          </div>
        </div>
        <div class="list-editor-footer">
          <span></span>
          <button class="robin-btn robin-btn__default" @click="createNewList">创建</button>
        </div>
      </div>
    </modal>
    <modal :show="showCurrentList">
      <div slot="content" class="list-editor">
        <div class="list-editor-header">
          <h3 class="list-editor-header--title">编辑清单</h3>
        </div>
        <div class="list-editor-body">
          <div class="robin-textfield">
            <input type="text" class="robin-textfield--input robin-textfield--input_default" v-model="currentList.name"/>
          </div>
        </div>
        <div class="list-editor-footer">
          <span class="material-icons" @click="deleteList(this.currentList)">delete</span>
          <button class="robin-btn robin-btn__default" @click="doEditList">确定</button>
        </div>
      </div>
    </modal>
</template>
<script>
  import * as listsActions from '../../vuex/actions/lists';
  import * as getters from '../../vuex/getter';

  export default {
    data() {
      return {
        showModal: false,
        newList: {
          name: '',
        },
        currentList: null,
        showCurrentList: false,
      };
    },
    vuex: {
      actions: {
        addList: listsActions.addList,
        deleteList: listsActions.deleteList,
        editList: listsActions.editList,
      },
      getters: {
        lists: getters.getLists,
      }
    },
    watch: {
      // 监控左侧 list 列表，默认选中第一个
      lists() {
        if (this.lists && this.lists.length) {
          this.$router.go({name: 'list', params: {id: this.lists[0].id}});
        }
        this.showModal = false;
        this.showCurrentList = false;
        this.newList.name = '';
      },
    },
    ready() {
      document.addEventListener('keyup', (e) => {
        if (e.keyCode === 27) {
          this.showModal = false;
          this.showCurrentList = false;
        }
      });
    },
    methods: {
      createNewList() {
        if (!this.newList.name) {
          return false;
        }
        var param = {
          name: this.newList.name,
        };
        this.showModal = false;
        this.newList.name = '';
        this.addList(param);
      },
      showCurrent(e, list) {
        this.currentList = list;
        this.showCurrentList = true;
      },
      doEditList() {
        let param = {};
        param.name = this.currentList.name;
        this.showCurrentList = false;
        this.editList(this.currentList.id, param);
      },
    },
  };
</script>

<style lang="less">

  @import '../../public/stylesheets/variables';
  .sidebar{
    float:left;
    width: @sidemenu-width;
    // padding: 20px 30px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    top: 70px;
    overflow: auto;
    z-index: 2;
    &-container {
      padding-bottom: 40px;
    }
  }
  .side-menu{
    padding:10px 0 16px 0;
    margin: 0;
    border-bottom: 1px solid @sidemenu-spearate-line;
    &__item{
      box-sizing: border-box;
      border-radius: 2px;
      padding: 10px 10px 10px 22px;
      color: #000;
      text-decoration: none;
      display: flex;
      cursor: pointer;
      .edit{
        display: none;
      }
      &:hover{
        background: rgba(0,0,0,.03);
      }
      &--active{
        background: #e0e0e0;
        .edit{
          float:right;
          display: block;
        }
      }
      &-content{
        margin-left: 10px;
        flex: 1 0 26px;
        .text-overflow();
      }
      &-count {
        margin-right: 6px;
      }
    }
  }
  .side-actions{
    position: fixed;
    bottom: 0;
    width: @sidemenu-width;
    background: @body-background;
    border-top: 1px solid @sidemenu-spearate-line;
    font-size: 14px;
    &__item {
      width: 100%;
      box-sizing: border-box;
      border-radius: 2px;
      line-height: 24px;
      padding: 10px;
      color: #000;
      text-decoration: none;
      display: flex;
      justify-content: center;
      cursor: pointer;
      &:hover{
        background: rgba(0,0,0,.03);
      }
      &-content {
        margin-left: 10px;
        flex: 0 1 76px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .list-editor {
    width: 340px;
    margin: 0 auto;
    background: #fff;
    border-radius: 2px;
    &-header {
      padding: 14px 14px 0px;
      text-align: center;
      &--title {
        font-size: 26px;
        margin: 0px;
      }
    }
    &-body {
      padding: 4px 14px 10px;
    }
    &-footer {
      padding: 12px;
      border-top: 1px solid #e0e0df;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }


</style>
