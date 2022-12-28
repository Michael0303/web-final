import { Modal, Form, Input } from "antd";
import { FormProvider } from "rc-field-form";
import { useRef, useState } from 'react'
import axios from './api';

const BasicModal = ({ open, onCancel, curPath, setChange }) => {

    const handleFile = (e) => {
        setFile(e.target.files[0])
    }

    const [f, setFile] = useState("");

    const formRef = useRef();

    return (
        <Modal
            open={open}
            title="Upload a file"
            okText="Upload"
            cancelText="Cancel"
            onCancel={() => { formRef.current.value = ''; setFile(""); onCancel(); }}
            onOk={async () => {
                if (!f) {
                    alert("未選擇任何檔案")
                    return;
                }
                let file = new FormData();
                file.append('file', f);
                const { data: { status } } = await axios({
                    url: '/api/file/upload',
                    method: "POST",
                    data: file,
                    params: { path: curPath }
                })
                setChange(true);
                formRef.current.value = '';
                setFile("");
                onCancel();
            }}
        >
            <form>
                <div>
                    <input ref={formRef} type="file" name="file" onChange={(e) => { handleFile(e) }} />
                </div>
            </form>
        </Modal>
    );
};

export default BasicModal;
