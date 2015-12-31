<style lang="sass">
 .login-form {
  width:400px;
  padding:14px;
  box-sizing: box-sizing;
  margin: 0 auto;
  background: rgba(255,255,255,0.8);
 }
</style>
<template>
  <div class="container" >
    <div class="login-form">
      <div class="login-flash">What's your email address?</div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {

      }
    },
    ready(){
      console.log('login');
    }
  }
</script>