<template>
  <div class="taskdetail-mask">
    <div class="taskdetail-wrapper">
      <div class="taskdetail-container">
      <h1>Task Detail</h1>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['show'],
    data() {
      return {

      };
    },
  };
</script>
<style lang="less">
//  modal
.taskdetail-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.taskdetail-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.taskdetail-container {
  width: 740px;
  height: 540px;
  margin: 0 auto;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: spin(#000, 60%);
}

.modal-body {
  margin: 20px 0;
}

.modal-footer {
  .footer-inner {
    display: flex;
    // flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
  }
}

.modal-default-button {
  float: right;
}

.modal-enter,
.modal-leave {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>