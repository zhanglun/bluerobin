<style>
</style>

<template>
  <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <!-- Title -->
        <span class="mdl-layout-title">{{$route.params.category}}</span>
        <!-- Add spacer, to align navigation to the right -->
        <div class="mdl-layout-spacer"></div>
        <!-- Navigation -->
        <nav class="mdl-navigation">
        <!-- <a class="mdl-navigation__link" href="" v-link="{path: '/file', exact: true}">文件</a> -->
        <a class="mdl-navigation__link" href="" v-link="{path: '/task', exact: true}">Task</a>
        <a class="mdl-navigation__link" href="" v-link="{path: '/signup', exact: true}">注册</a>
        <a v-if="account">{{account.email}}</a>
        </nav>
      </div>
    </header>
    <div class="mdl-layout__drawer">
      <span class="mdl-layout-title">Title</span>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" href="" v-link="{name: 'list', params:{category: 'today'}}">Today</a>
        <a class="mdl-navigation__link" href="" v-link="{name: 'list', params:{category: 'work'}}">Wrok</a>
        <!-- <a class="mdl-navigation__link" href="" v-link="{path: '/today', exact: true}">Today</a>
        <a class="mdl-navigation__link" href="" v-link="{path: '/work', exact: true}">Work</a> -->
        <!-- <a class="mdl-navigation__link" href="" v-link="{path: '/task/archive', exact: true}">Archive</a>
        <a class="mdl-navigation__link" href="" v-link="{path: '/task/overdue', exact: true}">OverDue</a> -->
      </nav>
    </div>
  <!-- Dropdown Structure -->
  <!-- <ul id="dropdown1" class="dropdown-content">
    <li><a href="#!">asdf</a></li>
    <li class="divider"></li>
    <li><a href="#!" v-on:click="logout"> 退出登录</a></li>
  </ul>
  <nav>
    <div class="container">
        <div class="nav-wrapper">
          <a href="#" class="brand-logo">BlueRobin</a>
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li v-if="account">
              <a class="dropdown-button" href="#!" data-activates="dropdown1">{{account.email}}
                <i class="material-icons right">arrow_drop_down</i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      </nav> -->
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
    console.log('header!!!!!');
  },
  methods: {
    logout(){

    }
  }

};

</script>
