<template>
  <div class="main-header header-toolbar">
    <div class="header-toolbar__title">
      {{list.name}}
    </div>
  </div>
</template>

<script>
  import * as getters from '../vuex/getter';
  export default {
    props: ['list'],
    data() {
      return {
        useRemoteAPI: window.localStorage.apiurl === 'http://zhanglun.daoapp.io/api' ? true : false,
      };
    },
    vuex: {
      actions: {
      },
      getters: {
      },
    },
    ready() {
    },
    methods: {
    },

  };

</script>
<style lang="less">
  @import '../public/stylesheets/variables';

  .main-header{
    display: flex;
    box-sizing: border-box;
    flex: 1 0 45px;
    max-height: 45px;
    width: 100%;
    padding: 0 14px;
    background: #ffc952;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    align-items: center;
    justify-content: space-between;
  }
  .header-toolbar {
    &__title{
      font-size: 20px;
      color: #fff;
    }
  }
</style>
