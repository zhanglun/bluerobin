<template>
  <header class="header">
  <div class="logo">
    BlueRobin
  </div>
  <div v-if="user" class="navigation-account">
    <img v-bind:src="user.avatar" alt="">
    {{user.username}}
  </div>
  </header>
</template>

<script>
import * as getters from '../../vuex/getter';
export default {
  data() {
    return {
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
  },

};

</script>
<style lang="less">
.logo {
  font-size: 30px;
  margin-left: 34px;
}
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
  padding: 0 30px;
  background: fade(#fff, 85%);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  position: fixed;
  z-index: 100;
  align-items: center;
  justify-content: space-between;
}
</style>
