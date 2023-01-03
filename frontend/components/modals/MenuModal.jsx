import { Modal, Button, Space, Typography } from "antd";
import { FileTextOutlined, DownloadOutlined, DeleteOutlined, ShareAltOutlined } from "@ant-design/icons"
import FileDownload from 'js-file-download'
import axios from '../api';
import { useState } from 'react'
import Link from "next/link";

const BasicModal = ({ open, onCancel, target, curPath, setChange, mode }) => {

    const [warning, setWarning] = useState(false)
    const [sharing, setSharing] = useState(false)
    const [link, setLink] = useState(undefined)

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

    const share = async (e) => {
        try {
            const { data: { link } } = await axios.post('/api/directory/share', {
                path: curPath + "/" + e
            })
            // const link = "https://ant.design"
            setLink(link)
        } catch (err) {
            console.log(err)
        }
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
                    {(mode === "file") ? null : <Button onClick={() => { setSharing(true) }}><ShareAltOutlined />Share</Button>}
                    <Button danger onClick={() => { setWarning(true) }}><DeleteOutlined />Delete</Button>
                    <Button type="primary" onClick={() => { onCancel() }}>Close</Button>
                </Space>
            }
        >
            <Modal
                open={warning}
                title="Warning"
                okText="Confirm"
                cancelText="Cancel"
                onCancel={() => { setWarning(false) }}
                onOk={async () => { setWarning(false); if (mode === "file") { await deleteFile(target); } else await deleteDirectory(target); }}
            // onOk={async() => {setWarning(false)}}

            >
                <p> Once the deletion process is complete, it cannot be undone </p>
            </Modal>
            <Modal
                open={sharing}
                title="Sharing"
                cancelText="Cancel"
                onCancel={() => { setSharing(false) }}
                footer={
                    <Button type="primary" onClick={() => { setSharing(false) }}>Close</Button>
                }
            >
                <Space>
                    <Button type="primary" onClick={async () => { await share(target) }}>
                        <ShareAltOutlined />
                        Share
                    </Button>
                    {(link === undefined) ? null : <Typography>
                        <Link href={`/share/${link}`}>{`http://localhost:3000/share/${link}`}</Link>
                    </Typography>}
                </Space>
            </Modal>
        </Modal>
    );
};

export default BasicModal;
