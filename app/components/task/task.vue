<style lang="sass?outputstyle=expanded">

.flex-box{
  display: -webkit-flex;
  display: flex;
  >div{
    -webkit-flex: 1 auto 1;
    flex: 1 auto 1;
  }
}

$editbox-height: 34px;
.red {
  color: #f00;
}
.dib {
  display: inline-block;
}

.app-main {
  box-sizing: border-box;
}

.modify {
  width: 100%;
  box-sizing: border-box;
  line-height: $editbox-height;
  height: $editbox-height;
  padding: 0 4px;
}

.task-item {
  @extend .flex-box;
  height: $editbox-height + 10;
  line-height: $editbox-height;
	margin-top: -1px;
	padding: 4px 10px;
  box-sizing: border-box;
  border: 1px solid #e8e8e8;
  font-size: 14px;
  color: #343434;
  background: rgba(255, 255, 255, 0.8);

  /*transition: all 3.3s ease;*/

  .task-check, .task-actions{
    -webkit-flex: 0 1 auto;
    flex: 0 1 auto;
  }
  .task-content{
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
  }
  &.finished {
    .task-content {
    	cursor: default;
      text-decoration: line-through;
    }
  }
  &.editing {
  	.task-content{
	    > div {
	      display: none;
	    }
	    > input {
	      display: inline-block;
        vertical-align: middle;
	    }
  	}
  }
  &:hover {
    .task-actions {
      display: block;
    }
  }
}

.task-checker {
  > input[type=checkbox] {
    //display: none;
    & + label {
      display: none;
      //display: block;
      width: 14px;
      height: 14px;
      min-height: 14px;
      padding: 0;
      font-size: 14px;
      text-align: center;
      line-height: 14px;
      border: 1px solid #d4d4d4;
    }
    & + label::before {
      content: '🐶';
      display: block;
      width: 100%;
      height: 100%;
    }
    &:checked + label::before {
      content: '🐔';
    }
  }
}

.task-content {
  > input {
    @extend .modify;
    border: 1px solid #d4d4d4;
    display: none;
    outline: none;
    font-size: 14px;
  }
  > div {
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-user-select: none;
  }
}

#task-completed {
  display: none;
}

.task-footer {
  a {
    display: inline-block;;
  }
  .todo-count {
    display: inline-block;
  }
}

.task-actions {
  width: 100px;
  text-align: right;
  overflow: hidden;
  display: none;
}

#task-category {
  .list-group-item {
    background: rgba(255, 255, 255, 0.8);
  }
}


.animation_showtask-transition {
  transition: all 0.5s ease;
}
.animation_showtask-enter, .animation_showtask-leave {
  opacity: 0;
}
.animation_showtask-enter{
  transform: rotateX(180deg);
}
.animation_showtask-leave{
  transform: rotateX(0deg);
}

</style>

<template>
  <div class="task-item" transition="animation_showtask" v-bind:class="{finished: task.completed, editing: task == taskEditing}">
  	<div class="task-checker">
  		<input type="checkbox" v-on:change = "toggleTask(task)" :checked="task.completed">
  	</div>
    <div class="task-content" v-on:dblclick="edit(task)">
      <div data-val="{{task.title}}">{{task.title}}</div>
      <input type="text" v-task-autofocus="task == taskEditing" v-model="task.title" class="edit" v-on:blur="doEdit(task)" v-on:keyup.enter="doEdit(task, $event)" />
    </div>
    <div class="task-actions">
	    <span v-on:click="deleteTask(task)" class="icon-bin"></span>
  	</div>
  </div>
</template>

<script>

import Proxy from '../../services/proxy.babel.js';

module.exports = {
	props: ['task', 'index'],
  data: function(){
  	return {
  		editing: false,
  		taskEditing: null
  	}
  },
  ready: function(){

  },

  directives: {
    'task-autofocus': function (value) {
      if (!value) {
        return;
      }
      var el = this.el;
      setTimeout(function () {
        el.focus();
      }, 0);
    }
  },
  methods: {
  	toggleTask: function(task){
  		this.task.completed = !this.task.completed;
      this.$dispatch('edit task', task);
  	},
  	edit: function(task){
  		if(task.completed){
  			return false;
  		}
  		this.taskEditing = task;
  	},
  	deleteTask: function(task){
      this.$dispatch('delete task', task);
  	},

    doEdit: function(task){
      // 如果没有正在编辑的task说明目前并没有编辑操作
      // 这里也解决了 一个问题：在 input上绑定了 blur 和 keyup两个事件
      // 按下 enter 执行完成之后，会触发 blur，所以应该执行之后将 taskEditing 置为 null
      if(!this.taskEditing){
        return false;
      }
      this.taskEditing = null;
      this.$dispatch('edit task', task);
    }
  }

}
</script>

