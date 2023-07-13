import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useStore} from "@/store/idnex";
import {observer} from "mobx-react-lite";
import {useState} from "react";
import {values} from "mobx";
import {http} from "@/utils/idnex";

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
        setFileList(fileList)
    }
    //图片数量

    const [imgCount,setImgCount] = useState(1)
    const radioChange = (e) => {
        setImgCount(e.target.value)
    }

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
                images:fileList.map(item => item.response.data.url)
            }
        }
        await http.post('/mp/articles?draft=false', params)
    }
    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/home">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>发布文章</Breadcrumb.Item>
                    </Breadcrumb>
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 1 }}
                    onFinish={onFinish}
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
                                发布文章
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default observer(Publish)