//封装axios
//实例化 请求拦截器 响应拦截器
import axios from "axios";
import {getToken} from "@/utils/idnex";
import { history } from "@/utils/history";

const http = axios.create({
    baseURL: 'http://geek.itheima.net/v1_0',
    timeout: 5000
})

//添加请求拦截器
http.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
},(error) => {
    return Promise.reject(error)
})


//添加响应拦截器
http.interceptors.response.use((response) => {
    return response.data
},(error) => {
    if (error.response.status === 401) {
        //跳回登录 reactRouter 默认状态下不支持路由在组件之外使用
        history.push('./login')
    }
    return Promise.reject(error)
})

export {http}