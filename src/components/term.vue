<template>
	<div class="term" :id="'terminal' + id">
	</div>
</template>
<script>
	import 'xterm/css/xterm.css';
	const ipc = require("electron").ipcRenderer;
	import {
		Terminal
	} from 'xterm';
	import {
		FitAddon
	} from 'xterm-addon-fit';
	export default {
		props: {
			id: {
				type: Number
			},
			showFlag: {
				type: Boolean
			}
		},
		watch: {
			showFlag: {
				handler: function(newVal, oldVal) {
					this.fitSize();
				},
				immediate: true
			}
		},
		name: 'Term',
		data() {
			return {
				xterm: null,
				fitAddon: null,
				channels: null
			};
		},
		beforeDestroy() {
			this.destoryTerm();
		},
		mounted() {
			this.initConnect();
		},
		methods: {
			initConnect() {
				this.destoryTerm();
				let that = this;
				ipc.invoke('terminal-create').then(res => {
					let pid = res;
					let xterm = new Terminal();
					let fitAddon = new FitAddon();
					xterm.loadAddon(fitAddon);
					xterm.open(document.getElementById('terminal' + this.id));
					that.xterm = xterm;
					that.fitAddon = fitAddon;
					that.channels = ["terminal-incomingData-" + pid, "terminal-keystroke-" + pid, "terminal-resize-" + pid, "terminal-close-" + pid];
					xterm.onData((data) => {
						ipc.send(that.channels[1], data);
					})
					xterm.onResize((size) => {
						ipc.send(that.channels[2], size.cols, size.rows);
					})
					ipc.on(that.channels[0], (event, data) => {
						xterm.write(data);
					});
					window.onresize = function() {
						that.fitSize();
					}
					that.fitSize();
					xterm.focus();
				})
			},
			destoryTerm() {
				if (this.xterm) {
					this.xterm.dispose();
					this.xterm = null;
				}
				if (this.fitAddon) {
					this.fitAddon.dispose();
					this.fitAddon = null;
				}
				if (this.channels) {
					ipc.send(this.channels[3]);
					ipc.removeAllListeners(this.channels[0]);
					this.channels = null;
				}
			},
			fitSize() {
				if (this.showFlag && this.fitAddon) {
					this.fitAddon.fit();
				}
			}
		}
	}
</script>
<style>
</style>
