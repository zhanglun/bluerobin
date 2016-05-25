<template>
    <div class="sidebar">
      <ul class="side-menu">
        <li>
          <a href="" class="side-menu__item" v-link="{name: 'list', params:{category: 'inbox'}}">
            <span class="material-icons">inbox</span>
            <span class="side-menu__item-content">Inbox</span>
          </a>
        </li>
                <li>
          <a href="" class="side-menu__item" v-link="{name: 'list', params:{category: 'today'}}">
            <span class="material-icons">today</span>
            <span class="side-menu__item-content">Today</span>
          </a>
        </li>
        <li>
          <a href="" class="side-menu__item" v-link="{name: 'list', params:{category: 'work'}}">
            <span class="material-icons">work</span>
            <span class="side-menu__item-content">Work</span>
          </a>
        </li>
      </ul>
      <div class="side-actions">
        <a href="">新建分类</a>
      </div>
    </div>
</template>
<script>

</script>

<style lang="less">
@import '../../public/stylesheets/variables';
.sidebar{
  float:left;
  width: @sideMenuWidth;
  padding: 20px 30px;
  box-sizing: border-box;
}
.side-menu{
  padding: 0;
  margin: 0;
  &__item{
    box-sizing: border-box;
    border-radius: 2px;
    padding: 10px 0 10px 22px;
    color: #000;
    text-decoration: none;
    display: flex;
    &:hover{
      background: rgba(0,0,0,.03);
    }
    &--active{
      background: #e0e0e0;
    }
    &-content{
      margin-left: 10px;
    }
  }

 }

</style>
