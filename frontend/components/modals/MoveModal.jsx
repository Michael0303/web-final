import { Modal, Tag } from "antd";
import axios from '../api';

const MoveModal = ({ open, onCancel, target, dst, curPath, setChange }) => {

    return (
        <Modal
            open={open}
            title="Moving"
            okText="Confirm"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={async () => {
                // console.log(path)
                // console.log("move to ")
                // console.log(dst)
                const { data: { status } } = await axios.post("/api/directory/move", {
                    path: curPath,
                    target,
                    dst
                })
                setChange(true);
                onCancel()
            }}
        >
            <p> Move <Tag>{target}</Tag> from <Tag>{curPath}</Tag> to <Tag>{dst}</Tag></p>
        </Modal>
    );
};

export default MoveModal;
