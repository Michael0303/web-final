import { Modal, Form, Input } from "antd";
import axios from './api';

const MoveModal = ({ open,onCancel,target,dst,curPath }) => {

  return (
    <Modal
      open={open}
      title="Moving"
      okText="Confirm"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={async() => {
        
      }}
    >
    <p> Move {target} from {curPath} to {dst}</p>
    </Modal>
  );
};

export default MoveModal;
