<template>
  <header class="header">
    <label class="robin-checkbox" for="qwer1234">
      <input type="checkbox" id="qwer1234" class="robin-checkbox--input" v-on:change="switchAPI(useRemoteAPI)" :checked="useRemoteAPI" v-model="useRemoteAPI">
      <span class="robin-checkbox--label"></span>
      <span class="robin-checkbox--tick"></span>
      <span class="robin-checkbox--value">使用远端API</span>
    </label>
    <div v-if="user" class="navigation-account">
      <img v-bind:src="user.avatar" alt="">
      <!-- {{user.username}} -->
    </div>

  </header>
</template>

<script>
  import * as getters from '../vuex/getter';
  export default {
    data() {
      return {
        useRemoteAPI: window.localStorage.apiurl == 'http://zhanglun.daoapp.io/api' ? true : false,
      };
    },
    vuex: {
      actions: {
      },
      getters: {
        user: getters.getUserInfo,
      },
    },
    ready() {
    },
    methods: {
      switchAPI(useRemoteAPI) {
        if (useRemoteAPI) {
          window.localStorage.apiurl = 'http://zhanglun.daoapp.io/api';
        } else {
          window.localStorage.apiurl = 'http://localhost:1234/api';
        }
      }
    },

  };

</script>
<style lang="less">
  @import '../public/stylesheets/variables';

  .navigation{
    &-account{
      // width: @sidemenu-width - 20;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      img{
        width: 32px;
        height: 32px;
        margin-right: 10px;
        border-radius: 100%;
      }
    }

    &-search{
      margin-left: 20px;
      flex: 1 0 auto;
    }
  }
  .header{
    display: flex;
    box-sizing: border-box;
    height: 45px;
    width: 100%;
    padding: 0 20px;
    background: #ffc952;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    position: fixed;
    z-index: 1;
    align-items: center;
    // flex-direction: row-reverse;
    justify-content: space-between;
  // justify-content: flex-end;
}
</style>
