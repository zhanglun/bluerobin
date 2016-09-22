<template>
  <div class="main-header">
<!--     <label class="robin-checkbox" for="qwer1234">
      <input type="checkbox" id="qwer1234" class="robin-checkbox--input" v-on:change="switchAPI(useRemoteAPI)" :checked="useRemoteAPI" v-model="useRemoteAPI">
      <span class="robin-checkbox--label"></span>
      <span class="robin-checkbox--tick"></span>
      <span class="robin-checkbox--value">使用远端API</span>
    </label> -->

  </div>
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

  .main-header{
    display: flex;
    box-sizing: border-box;
    flex: 1 0 45px;
    width: 100%;
    padding: 0 20px;
    background: #ffc952;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    align-items: center;
    justify-content: space-between;
}
</style>
