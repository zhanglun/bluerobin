<style lang="sass">
.app-bar{
  position: absolute;
  bottom:0;
  left: 0;
  &-item{
    width:20px;
    height:20px;
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

<script>
export default{
  data(){

  }
}
</script>