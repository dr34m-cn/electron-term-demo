# electron-term-demo

## 使用`vue`+`electron`+`node-pty`+`xterm.js`实现终端

#### 推荐版本nodejs 14.X

需要满足[node-pty使用依赖](https://github.com/microsoft/node-pty#dependencies)，摘录在最后

### 启动方式：

#### 首次

```shell
npm install
npm run rebuild
npm run serve
```

#### 之后

```shell
npm run serve
```

### [node-pty使用依赖](https://github.com/microsoft/node-pty#dependencies)摘录如下

> ## Dependencies
> Node.JS 12+ or Electron 8+ is required to use `node-pty`.
> ### Linux (apt)
> ```sh
> sudo apt install -y make python build-essential
> ```
> ### macOS
> Xcode is needed to compile the sources, this can be installed from the App Store.
> ### Windows
> `npm install` requires some tools to be present in the system like Python and C++ compiler. Windows users can easily install them by running the following command in PowerShell as administrator. For more information see https://github.com/felixrieseberg/windows-build-tools:
> ```sh
> npm install --global --production windows-build-tools
> ```
> The following are also needed:
> - [Windows SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-10-sdk) - only the "Desktop C++ Apps" components are needed to be installed