import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select, message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useStore} from "@/store/idnex";
import {observer} from "mobx-react-lite";
import {useEffect, useRef, useState} from "react";
import {http} from "@/utils/idnex";
import {type} from "@testing-library/user-event/dist/type";

const { Option } = Select

const Publish = () => {
    const { channelStore } = useStore()
    //存放上传图片的列表
    const [fileList, setFileList] = useState([])
    const onUploadChange = ({fileList}) => {
        console.log(fileList)
        //采取受控的写法
        // upload组件会在上传前、上传中和上传完成三个阶段触发onchange函数，
        // 最后一次触发时返回值中有response
        //最终fileList中存放的数据有response.data.url
        //同时把图片列表存入仓库一份
        const formatList = fileList.map(file => {
            //上传完毕 取url
            if (file.response) {
                return {
                    url:file.response.data.url
                }
            }
            //上传中不做处理
            return file
        })
        setFileList(formatList)
        cacheImgList.current = formatList
    }
    //使用userRef声明一个暂存仓库
    const cacheImgList = useRef()
    //图片数量
    const [imgCount,setImgCount] = useState(1)
    const radioChange = (e) => {
        const ravValue = e.target.value
        setImgCount(ravValue)
        //这里的判断采用原始值 不采用useState修改过后的imgcount
        //修改之后的数据无法同步获取修改之后的新值
        //从仓库里面取出对应的数量
        //交给用来渲染图片列表的fileList 调用setFileList
        if (ravValue === 1) {
            const img = cacheImgList.current ? cacheImgList.current[0] : []
            setFileList([img])
        } else if(ravValue === 3) {
            setFileList(cacheImgList.current)
        }
    }
    const navigate = useNavigate()
    const onFinish = async (values) => {
        console.log(values)
        const { channel_id, content, title, type } = values
        const params = {
            channel_id,
            content,
            title,
            type,
            cover: {
                type:type,
                images:fileList.map(item => item.url)
            }
        }
        if (id) {
            await http.put(`/mp/articles/${id}?draft=false`, params)
        } else {
            await http.post('/mp/articles?draft=false', params)
        }
        navigate('/article')
        message.success(`${id ? '更新成功' : '发布成功'}`)
    }
    //编辑功能 文爱适配 路由参数id为判断条件
    const [params] = useSearchParams()
    const id = params.get('id')
    //数据回填 id调用接口 1表单回填 2暂存列表 3Upload组件的fileList
    const form = useRef(null)
    useEffect(() => {
        const loadDetail = async () => {
            const res = await http.get(`/mp/articles/${id}`)
            const data = res.data
            console.log(res)
            //表单数据回填 form实例方法
            form.current.setFieldsValue({...data,type:data.cover.type})
            const formatImgList = data.cover.images.map(url=>{
                    return {
                        url,
                    }
                })
            //调用setFileList 回填upload
            setFileList(formatImgList)
            //暂存列表 （和fileList回显列表保持数据结构统一）
            cacheImgList.current = formatImgList
        }
        if (id) {
            loadDetail()
        }

    },[id])

    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/home">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{id?'编辑':'发布'}文章</Breadcrumb.Item>
                    </Breadcrumb>
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 1 }}
                    onFinish={onFinish}
                    ref={form}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input placeholder="请输入文章标题" style={{ width: 400 }} />
                    </Form.Item>
                    <Form.Item
                        label="频道"
                        name="channel_id"
                        rules={[{ required: true, message: '请选择文章频道' }]}
                    >
                        <Select placeholder="请选择文章频道" style={{ width: 400 }}>
                            {channelStore.channelList.map(item =>
                                <Option
                                    key={item.id}
                                    value={item.id}>{item.name}
                                </Option>
                            )}
                        </Select>
                    </Form.Item>

                    <Form.Item label="封面">
                        <Form.Item name="type">
                            <Radio.Group
                                onChange={radioChange}
                            >
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                                <Radio value={0}>无图</Radio>
                            </Radio.Group>
                        </Form.Item>
                        { imgCount >0 && (
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList
                                action="http://geek.itheima.net/v1_0/upload"
                                fileList={fileList}
                                onChange={onUploadChange}
                                multiple={imgCount > 1}
                                maxCount={imgCount}
                            >
                                <div style={{ marginTop: 8 }}>
                                    <PlusOutlined />
                                </div>
                            </Upload>
                        )}

                    </Form.Item>
                    {/*这里的富文本编辑器在FromItem里面
                        输入的内容可在onfinish中获取
                    */}
                    <Form.Item
                        label="内容"
                        name="content"
                        rules={[{ required: true, message: '请输入文章内容' }]}
                    >
                        <ReactQuill theme="snow" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4 }}>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit">
                                {id?'提交修改':'发布文章'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default observer(Publish)