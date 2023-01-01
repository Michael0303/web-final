import { Modal, Button, Space } from "antd";
import { FileTextOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons"
import FileDownload from 'js-file-download'
import axios from './api';

const BasicModal = ({ open, onCancel, target, curPath, setChange, mode }) => {

    const downloadFile = async (e) => {
        axios({
            url: '/api/file/',
            method: 'GET',
            params: { path: curPath + "/" + e },
            responseType: 'blob'
        }).then((res) => {
            console.log(res.data)
            FileDownload(res.data, e)
        }).catch((error) => { console.error(error) })
    }

    const downloadDirectory = async (e) => {
        axios({
            url: '/api/directory/download',
            method: 'GET',
            params: { path: curPath + "/" + e },
            responseType: 'blob'
        }).then((res) => {
            console.log(res.data)
            FileDownload(res.data, "download.zip")
        }).catch((error) => { console.error(error) })
    }

    return (
        <Modal
            open={open}
            title={<><FileTextOutlined />{target}</>}
            onCancel={onCancel}
            onOk={async () => {
                setChange(true);
                onCancel()
            }}
            footer={
                <Space >
                    <Button onClick={() => { mode === "file" ? downloadFile(target) : downloadDirectory(target) }}><DownloadOutlined />DownLoad</Button>
                    <Button danger><DeleteOutlined />Delete</Button>
                    <Button type="primary" onClick={() => { onCancel() }}>Close</Button>
                </Space>
            }
        >

        </Modal>
    );
};

export default BasicModal;
