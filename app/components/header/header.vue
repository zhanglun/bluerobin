<style>
</style>

<template>
  <!-- <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">{{$route.params.category}}</span>
        <div class="mdl-layout-spacer"></div>
        <nav class="mdl-navigation">
        <a class="mdl-navigation__link" href="" v-link="{path: '/task', exact: true}">Task</a>
        <a class="mdl-navigation__link" href="" v-link="{path: '/signup', exact: true}">注册</a>
        <span v-if="account" class="navigation-account">
          <img v-bind:src="account.avatar" alt=""></span>
        </nav>
      </div>
    </header>
    </div>
  </header> -->
  <header class="header">

  </header>
</template>

<script>
export default {
  props: [
    'account',
  ],
  data() {
    return {
    };
  },
  ready() {
    console.log('header!!!!!');
  },
  methods: {
    logout() {

    },
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
  height: 50px;
  width: 100%;
  background: fade(#fff, 85%);
  position: fixed;
  z-index: 100;
}
</style>
