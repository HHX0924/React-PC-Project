//路由鉴权 实现未登录时访问拦截并跳转到登录页面
//1.判断token是否存在
//2.存在则正常渲染
//3.不存在则重定向到登录路由
//高阶组件（HOC）是一个接收组件作为参数并返回一个新组件的函数。

import {getToken} from "@/utils/idnex";
import {Navigate} from "react-router-dom";
function AuthComponent({ children }) {
    const isToken = getToken()
    if (isToken) {
        return <>{children}</>
    } else {
        return <Navigate to='/login' replace />
    }
}

export {AuthComponent}
// <AuthComponent> <Layout/> </AuthComponent>
// 登录：<><Layout/></>
// 非登录：<Navigate to="/login" replace />
