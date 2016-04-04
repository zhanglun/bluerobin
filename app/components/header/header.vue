<style>
</style>

<template>
<header>
<!-- Dropdown Structure -->
<ul id="dropdown1" class="dropdown-content">
  <li><a href="#!">asdf</a></li>
  <li class="divider"></li>
  <li><a href="#!" v-on:click="logout"> 退出登录</a></li>
</ul>
<nav>
  <div class="container">
      <div class="nav-wrapper">
        <a href="#" class="brand-logo">BlueRobin</a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li v-link-active><a class="" href="" v-link="{path: '/file', exact: true}">文件</a></li>
          <li v-link-active><a class="" href="" v-link="{path: '/task', exact: true}">Task</a></li>
          <li v-link-active><a class="" href="" v-link="{path: '/login', exact: true}">登录</a></li>
          <li v-link-active><a class="" href="" v-link="{path: '/signup', exact: true}">注册</a></li>
          <li v-if="account">
            <a class="dropdown-button" href="#!" data-activates="dropdown1">{{account.email}}
              <i class="material-icons right">arrow_drop_down</i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    </nav>
</header>

</template>

<script>
export default {
  props: ['account'],
  data(){
    return {
    };
  },
  ready(){
  },
  methods: {
    logout(){

    }
  }

};

</script>
