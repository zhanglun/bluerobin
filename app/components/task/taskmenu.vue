<template>
  <div class="sidebar">
    <ul class="side-menu">
      <li v-for="list in lists">
        <a href="" class="side-menu__item" v-link="{name: 'list', params: {id: list.id}}">
          <span class="side-menu__item-content">{{list.name}}</span>
        </a>
      </li>
      <!-- <li>
        <a href="" class="side-menu__item" v-link="{name: 'list', params:{category: 'inbox'}}">
          <span class="material-icons">inbox</span>
          <span class="side-menu__item-content">Inbox</span>
        </a>
      </li>
              <li>
        <a href="" class="side-menu__item" v-link="{name: 'list', params:{category: 'today'}}">
          <span class="material-icons">today</span>
          <span class="side-menu__item-content">Today</span>
        </a>
      </li>
      <li>
        <a href="" class="side-menu__item" v-link="{name: 'list', params:{category: 'work'}}">
          <span class="material-icons">work</span>
          <span class="side-menu__item-content">Work</span>
        </a>
      </li> -->
    </ul>
    <div class="side-actions">
      <span @click="showModal = true">新建分类</span>
    </div>

    <modal :show="showModal">
      <h3 slot="header">创建新的任务清单</h3>
      <div slot="body">
        这里是 body
        <input type="text" class="text" v-model="newList.name"/>
      </div>
      <div slot="footer">
        这里是 footer
        <button @click="createNewList">创建</button>
      </div>
    </modal>

  </div>
</template>
<script>

  export default {
    data(){
      return {
        showModal: false,
        newList: {
          name: '',
        },
        lists: [],
      }
    },
    ready(){
      // 获取 list 列表
      this.$http.get('lists')
        .then(res=>{
          this.lists = res.data;
        })
      document.addEventListener('keyup', e => {

        if(e.keyCode == 27){
          this.showModal = false;
        }
      });
    },
    methods: {
      createNewList(){
        if(!this.newList.name){
          return false;
        }
        this.$http.post('lists', {name: this.newList.name})
          .then(res=>{
              this.showModal = false;
          }, function(){});
      },

    }

  }
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
      padding: 10px 0 10px 22px;
      color: #000;
      text-decoration: none;
      display: flex;
      &:hover{
        background: rgba(0,0,0,.03);
      }
      &--active{
        background: #e0e0e0;
      }
      &-content{
        margin-left: 10px;
      }
    }

   }

  //  modal
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
  }
  /*
 * the following styles are auto-applied to elements with
 * v-transition="modal" when their visiblity is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter, .modal-leave {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
