import { Modal, Button, Space } from "antd";
import { FileTextOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons"
import FileDownload from 'js-file-download'
import axios from './api';
import { useState } from 'react'

const BasicModal = ({ open, onCancel, target, curPath, setChange, mode }) => {

    const [warning, setWarning] = useState(false)

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

    const deleteFile = async (e) => {
        const { data: { status } } = await axios.delete('/api/file/delete', { data: { path: curPath + "/" + e } });
        console.log(status)
        setChange(true)
        onCancel()
    }

    const deleteDirectory = async (e) => {
        const { data: { status } } = await axios.delete('/api/directory/delete', { data: { path: curPath + "/" + e } });
        console.log(status)
        setChange(true)
        onCancel()
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
                    <Button danger onClick={() => {setWarning(true) }}><DeleteOutlined />Delete</Button>
                    <Button type="primary" onClick={() => { onCancel() }}>Close</Button>
                </Space>
            }
        >
            <Modal
                open={warning}
                title="Warning"
                okText="Confirm"
                cancelText="Cancel"
                onCancel={()=>{setWarning(false)}}
                onOk={async() => {setWarning(false);if(mode === "file") {await deleteFile(target);} else await deleteDirectory(target);}}
                // onOk={async() => {setWarning(false)}}
            
            >
                <p> Once the deletion process is complete, it cannot be undone </p>
            </Modal>

        </Modal>
    );
};

export default BasicModal;
