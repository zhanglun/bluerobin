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
      <h3 slot="header">创建新的任务清单</h3>
      <div slot="body">
        <input type="text" class="text" v-model="newList.name"/>
      </div>
      <div slot="footer">
        <button @click="createNewList">创建</button>
      </div>
    </modal>
    <modal :show="showCurrentList">
      <h3 slot="header" class="center">编辑清单</h3>
      <div slot="body">
        <input type="text" class="text" v-model="currentListCopy.name"/>
      </div>
      <div slot="footer">
        <button @click="doEditList(currentList)">确定</button>
      </div>
    </modal>

  </div>
</template>
<script>
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
        currentListCopy: null,
        showCurrentList: false,
      };
    },
    watch: {
      // 监控左侧 list 列表，默认选中第一个
      lists(val, oldVal) {
        if (this.lists.length) {
          this.$router.go({name: 'list', params: {id: this.lists[0].id}});
        }
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
        this.$http
          .post('lists', {
            name: this.newList.name,
          }).then((list) => {
            this.showModal = false;
            this.lists.push(list);
          });
      },
      showCurrent(e, list) {
        this.currentList = list;
        this.currentListCopy = Object.assign({}, list);
        this.showCurrentList = true;
      },
      doEditList(currentlist) {
        let param = {};
        param.name = this.currentListCopy.name;
        this.$http.put('lists/' + this.currentListCopy.id, param)
          .then((res) => {
            console.log(res.data);
            currentlist = res.data;
          }, function() {

          });
      }
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
