module.exports = {
	productionSourceMap: true,
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true,
			externals:['node-pty']
		}
	}
}
