<template>
  <div class="sidebar">
    <ul class="side-menu">
      <li v-for="list in lists">
        <a class="side-menu__item" v-link="{name: 'list', params: {id: list.id}}">
          <span class="material-icons">list</span>
          <span class="side-menu__item-content">{{list.name}}</span>
          <span class="material-icons edit" @click="showCurrent(e, list)">edit</span>
        </a>
      </li>
    </ul>
    <div class="side-actions">
      <span class="side-menu__item" @click="showModal = true">
        <span class="material-icons">add</span>
        <span class="side-menu__item-content">新建分类</span>
      </span>
    </div>

    <modal :show="showModal">
      <div slot="header">
        <h3 class="text-center">创建新的清单</h3>
      </div>
      <div slot="body">
        <div class="robin-textfield">
          <input type="text" class="robin-input robin-input__default" v-model="newList.name"/>
        </div>
      </div>
      <div slot="footer">
        <button class="robin-btn robin-btn__default" @click="createNewList">创建</button>
      </div>
    </modal>
    <modal :show="showCurrentList">
      <div slot="header" class="center">
        <h3>编辑清单</h3>
      </div>
      <div slot="body">
        <div class="robin-textfield">
          <input type="text" class="robin-input robin-input__default" v-model="currentList.name"/>
        </div>
      </div>
      <div slot="footer">
        <span class="material-icons" @click="deleteList">delete</span>
        <button class="robin-btn robin-btn__default" @click="doEditList">确定</button>
      </div>
    </modal>
  </div>
</template>
<script>
  import { addList, deleteList } from '../../actions/lists';

  export default {
    props: [
      'lists',
    ],
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
    watch: {
      // 监控左侧 list 列表，默认选中第一个
      // lists(val, oldVal) {
      //   if (this.lists.length) {
      //     this.$router.go({name: 'list', params: {id: this.lists[0].id}});
      //   }
      // },
    },
    ready() {
      document.addEventListener('keyup', (e) => {
        if (e.keyCode === 27) {
          this.showModal = false;
          this.showCurrentList = false;
        }
      });

      this.$root.store.subscribe(() => {
        this.showModal = this.$root.store.getState().lists.showModal;
        this.showCurrentList = this.$root.store.getState().lists.showCurrentList;
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
        this.$root.store.dispatch(addList(param));
      },
      showCurrent(e, list) {
        this.currentList = list;
        this.showCurrentList = true;
      },
      doEditList() {
        let param = {};
        param.name = this.currentList.name;
        this.$http.put('lists/' + this.currentList.id, param)
          .then((res) => {
            this.currentList = res.data;
            this.showCurrentList = false;
          }, function() {

          });
      },
      deleteList() {
        var param = {
          id: this.currentList.id,
        };
        this.$root.store.dispatch(deleteList(param));
      },
    },
  };
</script>

<style lang="less">

  @import '../../public/stylesheets/variables';
  .sidebar{
    float:left;
    width: @sideMenuWidth;
    padding: 20px 30px;
    box-sizing: border-box;
  }
  .side-menu{
    padding: 0;
    margin: 0;
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
        flex: 1 0 auto;
      }
    }
   }
   .side-actions{
     font-size: 14px;
   }
   .center{
     text-align: center;
   }

</style>
