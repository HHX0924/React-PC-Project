import { Layout, Menu, Popconfirm } from 'antd'
import {
    HomeOutlined,
    DiffOutlined,
    EditOutlined,
    LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import {Outlet, Link, useLocation, useNavigate} from "react-router-dom";
import { useStore } from "@/store/idnex";
import {useEffect} from "react";
import {observer} from "mobx-react-lite";

const { Header, Sider } = Layout



const GeekLayout = () => {
    // 获取当前的path
    const location = useLocation()
    const { userStore, loginStore } = useStore()
    useEffect(() => {
        userStore.getUserInfo()
    },[userStore])

    //确定退出
    const navigate = useNavigate()
    const onConfirm = () => {
        //退出登录 删除token 跳回到登录
        loginStore.loginOut()
        navigate('/login')
    }
    return (
        <Layout>
            <Header className="header">
                <div className="logo" />
                <div className="user-info">
                    <span className="user-name">{userStore.userInfo.name}</span>
                    <span className="user-logout">
            <Popconfirm
                onConfirm={onConfirm}
                title="是否确认退出？"
                okText="退出"
                cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    {/*defaultSelectedKeys={['1']}菜单高亮原理
                        获取当前激活的path
                    */}
                    <Menu
                        mode="inline"
                        theme="dark"
                        defaultSelectedKeys={[location.pathname]}
                        selectedKeys={location.pathname}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <Menu.Item icon={<HomeOutlined />} key="/">
                            <Link to='/'>数据概览</Link>
                        </Menu.Item>
                        <Menu.Item icon={<DiffOutlined />} key="/article">
                            <Link to='/article'>内容管理</Link>
                        </Menu.Item>
                        <Menu.Item icon={<EditOutlined />} key="/publish">
                            <Link to='/publish'>发布文章</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="layout-content" style={{ padding: 20 }}>
                {/*   二级路由出口  */}
                    <Outlet />
                </Layout>
            </Layout>
        </Layout>
    )
}

export default observer(GeekLayout)