<template>
  <side-container></side-container>
  <div class="main">
    <main-header></main-header>
    <router-view ></router-view>
  </div>
  <task-detail v-if="show" transition="animation-showtaskdetail"></task-detail>
</template>

<script>
  import Vue from 'vue';
  import store from '../vuex/store';

  import * as userActions from '../vuex/actions/user';
  import * as listsActions from '../vuex/actions/lists';
  import * as getters from '../vuex/getter';

  import SideContainerView from './SideContainer.vue';
  import TaskDetailView from './TaskDetail.vue';

  import HeaderView from './Header.vue';

  // 创建 modal 组件
  Vue.component('modal', {
    template: '' + 
    '<div class="modal-mask" v-if="show" transition="modal-animation_default">' +
    '<div class="modal-wrapper">' + 
    '<div class="modal-container">' + 
    '<slot name="content"></slot>' + 
    '</div>' + 
    '</div>' + 
    '</div>',
    props: [
    'show',
    ],
  });

  export default {
    vuex: {
      actions: {
        fetchLists: listsActions.fetchLists,
      },
      getters: {
        auth: getters.getUserAuth,
        show: getters.isShowDetail,
      }
    },
    data() {
      return {
        msg: 'Hello from BlueRobin',
        finished: false,
      };
    },
    computed: {
    },
    watch: {
      lists() {
        let firstId = '';
        let toId = '';
        if(this.lists && this.lists.length) {
          firstId = this.lists[0].id;
        }
        toId = this.$route.params.id || firstId;
        this.$router.go({name: 'list', params: {id: toId}});
        this.finished = true;
      }
    },
    created() {
      this.fetchLists();
    },
    ready() {
    },
    methods: {
    },
    components: {
      'side-container': SideContainerView,
      'main-header': HeaderView,
      'task-detail': TaskDetailView,
    },
  };
</script>

<style lang="less">
  .app {
    min-height: 100%;
    height: 100%;
    display: flex;
  }
  .main{
    min-height: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
  }
  .animate_routerview-transition{
    transition: all 0.4s ease;
  }
  .animate_routerview-enter, .animate_routerview-leave{
    opacity: 0;
    height:0;
    transform: translate3d(20px, 0, 0);
  }
  .loading{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: #f1f1f1;
    z-index: 100;
    height: 100%;
  }

</style>
