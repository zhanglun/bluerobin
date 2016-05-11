<template>
  <div class="task" transition="animation_showtask" v-bind:class="{finished: task.completed, editing: task == taskEditing}" >
    <div class="task-checkbox">
      <label class="mdl-checkbox mdl-js-checkbox" v-bind:class="{'is-checked': task.completed}" for="{{task.id}}">
        <input type="checkbox" id="{{task.id}}" class="mdl-checkbox__input" v-on:change = "toggleTask(task)" :checked="task.completed">
        <!-- <span class="mdl-checkbox__label">Married</span> -->
      </label>
    </div>
    <div class="task-content">
      <div class="task-content-box" @dblclick="edit(task)">{{task.title}}</div>
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label task-content-input">
        <input class="mdl-textfield__input" type="text" v-task-autofocus="task == taskEditing" v-model="task.title" class="edit" v-on:blur="doEdit(task)" v-on:keyup.enter="doEdit(task, $event)" />
      </div>
    </div>
    <span class="task-controller">
      <i class="material-icons" @click="deleteTask(task)">clear</i>
    </span>

  </div>

</template>

<script>


module.exports = {
	props: ['task', 'index'],
  data: function(){
  	return {
  		editing: false,
  		taskEditing: null,
        taskDetail: {}
  	}
  },
  ready: function(){
    setTimeout(function() {
      componentHandler.upgradeDom('MaterialCheckbox');
    }, 0);
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
      console.log('toggle !!~~~');
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
  },
  events: {

  }

}
</script>

<style lang="less">

@import '../../public/stylesheets/variables';

@editbox-height: 34px;


.modify {
  width: 100%;
  box-sizing: border-box;
  line-height: @editbox-height;
  height: @editbox-height;
  padding: 0 4px;
}

.task {
  box-sizing: border-box;
  font-size: 1.6rem;
  color: #343434;
  background: @white;
  box-shadow: 0 2px 4px rgba(0,0,0,.24);
  border-bottom: 1px solid #DCDCDC;
  padding: 0 0.7em;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  &.finished {
    .task-content {
      cursor: default;
      text-decoration: line-through;
    }
  }
  &.editing {
    .task-content {
      &-box {
        display: none;
      }
      &-input {
        display: block;
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
    .task-controller {
      display: block;
    }
  }

}

.task-content {
    flex: 1 1 auto;
    overflow: hidden;
    padding: 0.8rem 0;
    margin-right: 6rem;
    & &-input {
      font-size: 100%;
      @extend .modify;
      display: none;
      margin: 0 ;
    }
    & &-box {
      line-height: 31px;
      padding: 0 5px;
      margin-top: -3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-user-select: none;
    }
}


.task-controller {
  display: none;
  position: absolute;
  right: 8px;
  top: 30%;
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
