import { Form, FormProps, Input, InputNumber, Modal, notification, Select } from "antd";



interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (value: boolean) => void;
    token: string;
    fetchUsers: (token: string) => void;
}

export type FieldType = {
    name?: string;
    email?: string;
    password?: string;
    age?: string;
    gender?: string;
    address?: string;
    role?: string;
};

const CreateUserModal = ({ isCreateModalOpen, setIsCreateModalOpen, token, fetchUsers }: IProps) => {
    const [form] = Form.useForm();
    const { Option } = Select;

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { name, email, password, age, gender, address, role } = values;
        const data = { name, email, password, age, gender, address, role }
        const response = await fetch('http://localhost:8000/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        const resJson = await response.json();
        if (resJson.data) {
            console.log(resJson);
            await fetchUsers(token);
            notification.success({
                message: 'Success',
                description: resJson.message
            })
            form.resetFields();
            setIsCreateModalOpen(false);
        } else {
            notification.error({
                message: 'Error',
                description: resJson.message
            })
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Modal title="Add New User"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => { form.resetFields(); setIsCreateModalOpen(false); }}
            maskClosable={false}

        >
            <Form
                form={form}
                layout="vertical"
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Age"
                    name="age"
                    rules={[{ required: true, message: 'Please input your age!' }]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                    <Select
                        placeholder="Select a option and change input text above"
                        allowClear
                    >
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                        <Option value="other">other</Option>
                    </Select>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input your address!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                    <Select
                        placeholder="Select a option and change input text above"
                        allowClear
                    >
                        <Option value="USER">USER</Option>
                        <Option value="ADMIN">ADMIN</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CreateUserModal;
