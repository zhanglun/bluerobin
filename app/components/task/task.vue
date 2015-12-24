<style lang="sass?outputstyle=expanded">
.red {
  color: #f00;
}
.task-item{
	/*background: #343;*/
}
$editbox-height: 34px;

.dib {
  display: inline-block;
}

.app-main {
  box-sizing: border-box;
}

.modify {
  width: 100%;
  box-sizing: border-box;
  height: $editbox-height;
  line-height: $editbox-height;
  padding: 0 4px;
}

.task-item {
  height: $editbox-height + 10;
  line-height: $editbox-height;
	margin-top: 4px;
	padding: 4px 10px;
  box-sizing: border-box;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.8);
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
	      display: block;
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
  float: left;
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
  margin-left: 20px;
  margin-right:100px;
  > input {
    @extend .modify;
    border: 1px solid #d4d4d4;
    display: none;
    outline: none;
    font-size: 16px;
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
  display: none;
  float: right;
  width: 100px;
  text-align: right;
  overflow: hidden;
}

#task-category {
  .list-group-item {
    background: rgba(255, 255, 255, 0.8);
  }
}
</style>

<template>
  <div class="task-item" v-bind:class="{finished: task.completed, editing: task == taskEditing}">
  	<div class="task-checker">
  		<input type="checkbox" v-on:change = "toggleTask(task)" :checked="task.completed">
  	</div>
    <div class="task-actions">
	    <span v-on:click="deleteTask(task)">删除</span>
    <!-- <span>2</span> -->
  	</div>
 		<div class="task-content" v-on:dblclick="edit(task)">
   		<div data-val="{{task.title}}">{{task.title}}</div>
   		<input type="text" value="{{task.title}}" v-task-autofocus="task == taskEditing" v-model="task.title" class="edit" v-on:keyup.enter="updateTask(task)" v-on:blur="updateTask(task)"/>
		</div>
  </div>
</template>

<script>


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
  	},
  	edit: function(task){
  		if(task.completed){
  			return false;
  		}
  		this.taskEditing = task;
  	},
  	updateTask: function(task){
  		console.log('update task');
  		this.taskEditing = null;
  	},
  	deleteTask: function(){

  	}
  }

}
</script>

