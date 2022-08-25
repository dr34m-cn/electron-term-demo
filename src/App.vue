<template>
	<div id="app">
		<term :id="1" :showFlag="true" class="term"></term>
	</div>
</template>
<script>
	import term from '@/components/term'
	export default {
		name: 'App',
		components: {
			term
		},
		data() {
			return {};
		},
		created() {},
		methods: {}
	}
</script>
<style>
body {
	margin: 0;
	padding: 0;
	background: #000000;
}
.term {
	width: 100vw;
	height: 100vh;
}
::-webkit-scrollbar {
	/*滚动条整体样式*/
	width: 10px;
	/*高宽分别对应横竖滚动条的尺寸*/
	height: 10px;
}

::-webkit-scrollbar-thumb {
	background-color: #FFF;
}

::-webkit-scrollbar-track {
	/*滚动条里面轨道*/
	background: #000;
}
</style>
