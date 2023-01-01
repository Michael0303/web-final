import { Modal, Form, Input } from "antd";

const MoveModal = ({ open, onCreate, onCancel,target,dst,curPath }) => {

  return (
    <Modal
      open={open}
      title="Moving"
      okText="Confirm"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        
      }}
    >
    <p> Move {target} from {curPath} to {dst}</p>
    </Modal>
  );
};

export default MoveModal;
