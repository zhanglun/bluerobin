<template>
  <header class="header">
<!--     <div class="logo">
      BlueRobin
    </div> -->
    <div class="navigation-search">
      <div class="robin-textfield">
        <input type="text" class="robin-textfield--input robin-textfield--input_default" />
      </div>
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
@import '../../public/stylesheets/variables';

.navigation{
  &-account{
    width: @sidemenu-width - 20;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    img{
      width: 40px;
      height: 40px;
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
  height: 60px;
  width: 100%;
  padding: 0 20px;
  background: fade(#fff, 85%);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  position: fixed;
  z-index: 1;
  align-items: center;
  flex-direction: row-reverse;
  // justify-content: space-between;
  justify-content: flex-end;
}
</style>
