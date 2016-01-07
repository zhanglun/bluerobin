<style lang="sass">
	.home{
		height:100%;
		.clock{
			color: rgba(255, 255,255, 0.8);
			position: absolute;
			width: 100%;
			text-align: center;
			top:50%;
			left: 50%;
			transform: translate(-50%,-50%);
			&>h1{
				display: inline-block;
				font-size: 12em;
				font-weight: lighter;
				letter-spacing: -2px;
				line-height: 0;
			}
		}
	}


</style>

<template>
	<div class="home">
			<div class="clock" v-if="currentTime !== 'Invalid'">
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
			console.log('Welcome to BlueRobin %s', this.currentTime);
			var _this = this;
      setInterval(function () {
         _this.$data.now = Date.now()
      }, 1000)
		},
	};

	export default vm;
</script>