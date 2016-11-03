<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <!-- <span class="material-icons">list</span> -->
    </div>
    <div class="sidebar-toolbar">
      <div v-if="user" class="sidebar-toolbar-account">
        <img v-bind:src="user.avatar" alt="">
        {{user.username}}
      </div>
    </div>
    <div class="sidebar-body list-scroll">
      <ul class="side-menu">
        <li>
          <a class="side-menu__item" v-link="{name: 'list', params: {id: 'archive'}}">
            <span class="material-icons">archive</span>
            <span class="side-menu__item-content">归档</span>
          </a>
        </li>
        <li>
          <a class="side-menu__item" v-link="{name: 'list', params: {id: 'trash'}}">
            <span class="material-icons">delete</span>
            <span class="side-menu__item-content">回收站</span>
          </a>
        </li>
      </ul>
      <ul class="side-menu">
        <li v-for="list in lists">
          <a class="side-menu__item" v-link="{name: 'list', params: {id: list.id}}">
            <span class="material-icons">list</span>
            <span class="side-menu__item-content">{{list.name}}</span>
            <span class="side-menu__item-count">{{list.task_count_total - list.task_count_archived - list.task_count_istrash || ''}}</span>
            <span class="material-icons edit" @click="showCurrent(e, list)" data-tooltip="编辑" data-tooltip-pos="down">edit</span>
          </a>
        </li>
      </ul>

    </div>
    <div class="sidebar-footer">
      <div class="side-actions">
        <span class="side-actions__item" @click="showModal = true">
          <span class="material-icons">add</span>
          <span class="side-actions__item-content">新建分类</span>
        </span>
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
    <modal :show="showSelectedList">
      <div slot="content" class="list-editor">
        <div class="list-editor-header">
          <h3 class="list-editor-header--title">编辑清单</h3>
        </div>
        <div class="list-editor-body">
          <div class="robin-textfield">
            <input type="text" class="robin-textfield--input robin-textfield--input_default" v-model="selectedList.name"/>
          </div>
        </div>
        <div class="list-editor-footer">
          <span class="material-icons" @click="deleteList(this.selectedList)">delete</span>
          <button class="robin-btn robin-btn__default" @click="doEditList">确定</button>
        </div>
      </div>
    </modal>
  </div>

</template>
<script>
  import * as listsActions from '../vuex/actions/lists';
  import * as getters from '../vuex/getter';

  export default {
    data() {
      return {
        showModal: false,
        newList: {
          name: '',
        },
        selectedList: null,
        showSelectedList: false,
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
        user: getters.getUserInfo,
      }
    },
    watch: {
      // 监控左侧 list 列表，默认选中第一个
      lists() {
        this.showModal = false;
        this.showSelectedList = false;
        this.newList.name = '';
      },
    },
    ready() {
      document.addEventListener('keyup', (e) => {
        if (e.keyCode === 27) {
          this.showModal = false;
          this.showSelectedList = false;
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
        this.selectedList = list;
        this.showSelectedList = true;
      },
      doEditList() {
        let param = {};
        param.name = this.selectedList.name;
        this.showSelectedList = false;
        this.editList(this.selectedList.id, param);
      },
    },
  };
</script>

<style lang="less">

  @import '../public/stylesheets/variables';
  .sidebar{
    max-width: @sidemenu-width;
    box-sizing: border-box;
    flex: 1 0 @sidemenu-width;
    background: #fff;
    display: flex;
    flex-direction: column;
    &-header{
      min-height: 45px;
      background: #ffc952 ;
    }
    &-body {
      flex: 1 1 auto;
      overflow-y: auto;
    }
    &-toolbar {
      padding: 6px 0 6px;
      box-sizing: border-box;
      display: flex;
      &-account{
        width: 60%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img{
          min-width: 32px;
          width: 32px;
          height: 32px;
          flex: 0 1 32px;
          border-radius: 100%;
          padding: 0 6px 0 6px;
        }
      }
    }
  }

  .side-menu{
    padding:2px 0;
    margin: 0;
    border-bottom: 1px solid @sidemenu-spearate-line;
    li {
      list-style-type: none;
    }
    &__item{
      box-sizing: border-box;
      border-radius: 2px;
      padding: 8px 14px 8px 12px;
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
  .sidebar-footer {
    min-height: 40px;
    .side-actions{
      width: @sidemenu-width;
      border-top: 1px solid @sidemenu-spearate-line;
      font-size: 14px;
      &__item {
        width: 100%;
        box-sizing: border-box;
        border-radius: 2px;
        line-height: 24px;
        padding: 8px;
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
