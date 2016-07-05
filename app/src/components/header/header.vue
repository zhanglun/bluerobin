<style>
</style>

<template>
  <header class="header">
  <span v-if="user" class="navigation-account">
    <img v-bind:src="user.avatar" alt="">
    {{user.username}}
  </span>
  </header>
</template>

<script>
import * as actions  from '../../vuex/actions';
import * as getters from '../../vuex/getter';

export default {
  data() {
    return {
    };
  },
  vuex: {
    actions: {
      authenticate: actions.authenticate,
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
  height: 60px;
  width: 100%;
  background: fade(#fff, 85%);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  position: fixed;
  z-index: 100;
}
</style>
