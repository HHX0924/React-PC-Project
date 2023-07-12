//把所有的模块做统一处理
//导出一个统一的方法 useStore
import LoginStore from './login.Store'
import React from "react";
import UserStore from "@/store/user.Store";
import ChannelStore from "@/store/channel.Store";
//1.声明一个rootStore
class RootStore {
    constructor() {
        this.loginStore = new LoginStore()
        this.userStore = new UserStore()
        this.channelStore = new ChannelStore()
    }
}
//实例化跟
//导出
const rootStore = new RootStore()
const context = React.createContext(rootStore)
const useStore = () => React.useContext(context)

export { useStore }