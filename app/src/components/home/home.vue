<style lang="less">
	.home{
		height:100%;
		.clock{
		  -webkit-user-select: none;
			color: rgba(255, 255,255, 0.8);
			position: absolute;
			width: 100%;
			text-align: center;
			top:50%;
			left: 50%;
			transform: translate(-50%,-50%);
			&>h1{
				display: inline-block;
				font-size: 15em;
				font-weight: lighter;
				letter-spacing: -2px;
				line-height: 0;
			}
		}
	}


</style>

<template>
	<div class="home">
			<div class="clock">
				<h1 class="time" v-text="currentTime">
					13:40
				</h1>
		</div>
	</div>
</template>

<script>
	var vm = {
		data(){
			return {
				now: new Date().toTimeString().split(' ')[0]
			}
		},
		computed: {
			currentTime: {
				cached: true,
				get: function(){
					return new Date(this.now).toTimeString().split(' ')[0].replace(/\:\d{2}$/, '')
				}
			}
		},
		ready(){
			var _this = this;
	    _this.$data.now = Date.now();
			console.log('Welcome to BlueRobin %s', this.currentTime);
      setInterval(function () {
        _this.$data.now = Date.now()
      }, 1000)
		},
	};

	export default vm;
</script>