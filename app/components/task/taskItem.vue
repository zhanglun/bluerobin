<style lang="sass">

@import '../../public/stylesheets/variables';


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
  height: $editbox-height + 10;
  line-height: $editbox-height;
  box-sizing: border-box;
  font-size: 14px;
  color: #343434;
  background: $white;
  border-bottom: .1em solid #f5f5f5;
  box-shadow: 0 2px 4px rgba(0,0,0,.24);
  line-height: 2em;
  padding: .7em;

  /*transition: all 3.3s ease;*/
  & + &{
    // margin-top: 1px;
  }
  .task-check, .task-actions{
  }
  .task-content{
      overflow: hidden;
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
  &.expaned{
    transform: rotateX(100deg);
  }
  &.visiable{
    visibility: hidden;
  }
  &:hover {
    .task-actions {
      display: block;
    }
  }
}

.task-checker {
  float:left;
  width: 26px;
  text-align: center;
    [type="checkbox"]+label{
        padding:0;
        width: 20px;
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
  // width: 100px;
  // text-align: right;
  // overflow: hidden;
  // display: none;
}

#task-category {
  .list-group-item {
    background: rgba(255, 255, 255, 0.8);
  }
}



/*
  Task item animation
 */
.animation_showtask-transition {
  transition: all 0.5s ease;
}
.animation_showtask-enter, .animation_showtask-leave {
  opacity: 0;
  transform: rotateX(180deg);
}
.animation_showtask-enter{
  transform: rotateX(180deg);
}
.animation_showtask-leave{
  transition: all 0.3s ease;
  transform: translateX(-100%);
}

</style>

<template>

  <div class="collapsible-header task-item " transition="animation_showtask" v-bind:class="{finished: task.completed, editing: task == taskEditing, visiable: task == taskExpanding}" >
      <div class="task-checker">
        <input type="checkbox" id="{{task._id}}"  v-on:change = "toggleTask(task)" :checked="task.completed">
        <label for="{{task._id}}"></label>
      </div>
      <div class="task-content" v-on:dblclick="edit(task)">
        <div data-val="{{task.title}}">{{task.title}}</div>
        <input type="text" v-task-autofocus="task == taskEditing" v-model="task.title" class="edit" v-on:blur="doEdit(task)" v-on:keyup.enter="doEdit(task, $event)" />
      </div>
  </div>

    <div class="collapsible-body">
        <h3>This is body for detail</h3>
         <!-- Dropdown Trigger -->
        <span class='dropdown-button btn' data-activates='dropdown-{{task._id}}'>Drop Me!</span>

        <ul id='dropdown-{{task._id}}' class='dropdown-content'>
          <li><span v-on:click="expandBroad(task)" class="icon-grin"></span></li>
            <li class="divider"></li>
          <li><span v-on:click="deleteTask(task)" class="icon-bin"></span></li>
        </ul>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente voluptatum adipisci esse, illo, sit labore animi maxime blanditiis eveniet obcaecati eius neque! Sed quas dolores amet, velit, nostrum asperiores ipsum!</p>
    </div>

</template>

<script>

import Proxy from '../../services/proxy.babel.js';

module.exports = {
	props: ['task', 'index'],
  data: function(){
  	return {
  		editing: false,
  		taskEditing: null,
        taskExpanding: null
  	}
  },
  ready: function(){
    $('.dropdown-button').dropdown();
  },

  directives: {
    'task-autofocus'(value) {
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
  	toggleTask(task) {
  		this.task.completed = !this.task.completed;
      this.$dispatch('edit task', task);
  	},
  	edit(task) {
  		if(task.completed){
  			return false;
  		}
  		this.taskEditing = task;
  	},
  	deleteTask(task) {
      this.$dispatch('delete task', task);
  	},

    doEdit(task) {
      // 如果没有正在编辑的task说明目前并没有编辑操作
      // 这里也解决了 一个问题：在 input上绑定了 blur 和 keyup两个事件
      // 按下 enter 执行完成之后，会触发 blur，所以应该执行之后将 taskEditing 置为 null
      if(!this.taskEditing){
        return false;
      }
      this.taskEditing = null;
      this.$dispatch('edit task', task);
    },

    expandBroad(task){
      // this.taskExpanding = task;
      this.$dispatch('open task', task);
    }
  },
  events: {

  }

}
</script>
