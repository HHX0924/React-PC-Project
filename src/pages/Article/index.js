import {Link, useNavigate} from 'react-router-dom'
import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    DatePicker,
    Select,
    Table,
    Tag,
    Space, Popconfirm
} from 'antd'
import './index.scss'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import {useEffect, useState} from "react";
import {http} from "@/utils/idnex";
import {useStore} from "@/store/idnex";
import {observer} from "mobx-react-lite";
const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
    const { channelStore } = useStore()

    //文章列表管理 统一管理数据 获取的数据
    const [articleData, setArticleData] = useState({
        list:[],//文章列表
        count: 0 //文章数量
    })

    //文章参数管理
    const [params, setParams] = useState({
        page: 1,
        per_page: 10
    })

    useEffect(() => {
        const loadList = async () => {
            const res = await http.get('/mp/articles',{params})
            console.log(res)
            const { results, total_count} = res.data
            setArticleData({
                list: results,
                count: total_count
            })
        }
        loadList()
    },[params])
    //筛选功能
    const onFinish = (values) => {
        console.log(values)
        const { channel_id, date, status } = values
        //数据处理
        const _params = {}
        if (status !== -1) {
            _params.status = status
        }
        if (channel_id) {
            _params.channel_id = channel_id
        }
        if (date) {
            _params.begin_pubdate = date[0].format('YYYY-MM-DD')
            _params.end_pubdate = date[1].format('YYYY-MM-DD')
        }
        //修改params 接口重新发送 对象的合并是一个整体覆盖
        setParams({
            ...params,
            ..._params
        })
    }
    const pageChange = (page) => {
        setParams({
            ...params,
            page
        })
        console.log(page)
    }
    const delArticle = async (data) => {
        console.log(data)
        await http.delete(`/mp/articles/${data.id}`)
        //刷新列表
        setParams({
            ...params,
            page: 1
        })
    }
    //跳转编辑页面
    const navigate = useNavigate() //不能放函数里
    const goPublish = (data) => {
        navigate(`/publish?id=${data.id}`)
    }
    const columns = [
        {
            title: '封面',
            dataIndex: 'cover',
            width:120,
            render: cover => {
                return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
            }
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: data => <Tag color="green">审核通过</Tag>
        },
        {
            title: '发布时间',
            dataIndex: 'pubdate'
        },
        {
            title: '阅读数',
            dataIndex: 'read_count'
        },
        {
            title: '评论数',
            dataIndex: 'comment_count'
        },
        {
            title: '点赞数',
            dataIndex: 'like_count'
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => goPublish(data)}
                        />
                        <Popconfirm
                            title="确认删除该条文章吗?"
                            onConfirm={() => delArticle(data)}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button
                                type="primary"
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                )
            }
        }
    ]

    return (
        <div>
            {/*筛选区域*/}
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/home">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>内容管理</Breadcrumb.Item>
                    </Breadcrumb>
                }
                style={{ marginBottom: 20 }}
            >
                <Form
                    onFinish={onFinish}
                    initialValues={{ status: null }}>
                    <Form.Item label="状态" name="status">
                        <Radio.Group>
                            <Radio value={null}>全部</Radio>
                            <Radio value={0}>草稿</Radio>
                            <Radio value={1}>待审核</Radio>
                            <Radio value={2}>审核通过</Radio>
                            <Radio value={3}>审核失败</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="频道" name="channel_id">
                        <Select
                            placeholder="请选择文章频道"
                            style={{ width: 120 }}
                        >
                            {channelStore.channelList.map(item =>
                                <Option
                                key={item.id}
                                value={item.id}>{item.name}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item label="日期" name="date">
                        <RangePicker />
                    </Form.Item>


                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
                            筛选
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            {/*文章列表区域*/}
            <Card title={`根据筛选条件共查询到 ${articleData.count} 条结果：`}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={articleData.list}
                    pagination={
                        {
                            pageSize:params.per_page,
                            total:articleData.count,
                            onChange:pageChange
                        }
                    }
                />
            </Card>
        </div>
    )
}

export default observer(Article)