<style>
</style>

<template>
  <header class="header">
  <div class="log"></div>
  <div v-if="user" class="navigation-account">
    <img v-bind:src="user.avatar" alt="">
    {{user.username}}
  </div>
  </header>
</template>

<script>
import * as userActions  from '../../vuex/actions/user';
import * as getters from '../../vuex/getter';

export default {
  data() {
    return {
    };
  },
  vuex: {
    actions: {
      // authenticate: userActions.authenticate,
    },
    getters: {
      user: getters.getUserInfo,
    },
  },
  ready() {
    console.log('header!!!!!');
  },
  methods: {
  },

};

</script>
<style lang="less">
.navigation-account{

  img{
    width: 40px;
    height: 40px;
    border-radius: 100%;
  }
}
.header{
  display: flex;
  box-sizing: border-box;
  height: 60px;
  width: 100%;
  padding: 0 20px;
  background: fade(#fff, 85%);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  position: fixed;
  z-index: 100;
  align-items: center;
  justify-content: space-between;
}
</style>
