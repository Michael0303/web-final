import { Modal, Form, Input } from "antd";

const BasicModal = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Create a new directory"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((e) => {
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Error: Please enter the name of the directory!",
            }, {
              validator: (_, value) =>
                (value && typeof value === 'string' && !value.includes('/')  && !value.includes('.'))
                  ? Promise.resolve()
                  : Promise.reject(new Error('Error: Unvalid input, please enter the directory name without "/" and "." ')),
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BasicModal;
