import {
  Button, Form, Input, DatePicker, Typography,
} from 'antd/lib';

const { Title } = Typography;

export const CreateLock = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    window.console.log(values);
  };

  return (
    <>
      <Title level={3}>Create Lock</Title>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="create-lock-form"
        onFinish={onFinish}
      >
        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Amount is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="unlockTime"
          label="Unlock Time"
          rules={[{ required: true, message: 'Unlock Time is required' }]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format="MM/DD/YYYY HH:mm"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
