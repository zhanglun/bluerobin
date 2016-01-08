<style lang="sass">
.app-bar{
  -webkit-user-select: none;
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  &-item{
    display: inline-block;
    font-size: 2em;
    padding:8px;
    margin: 0 10px;
    >a{
      color: #fff;
      text-decoration: none;
      &:link{
        color: #fff;
      }
    }
  }
}

</style>

<template>
  <div class="app-bar">
    <div class="app-bar-item">
      <a v-link="'home'">Home</a>
    </div>
      <div class="app-bar-item">
        <a v-link="'task'">Task</a>
      </div>
  </div>
</template>

<script>.
export default{
  data(){

  }
}
</script>