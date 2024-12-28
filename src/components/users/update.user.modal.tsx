import { Form, FormProps, Input, InputNumber, Modal, notification, Select } from "antd";
import { useEffect } from "react";
import { FieldType } from "./create.user.modal";
import { IUser } from "./user.table";


interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (value: boolean) => void;
    token: string;
    fetchUsers: (token: string) => void;
    dataUpdate: IUser;
    setDataUpdate?: (value: null | IUser) => void;
}
const UpdateUserModal = ({ isUpdateModalOpen, setIsUpdateModalOpen, token, fetchUsers, dataUpdate }: IProps) => {
    const [form] = Form.useForm();
    const { Option } = Select;

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log(values)
        const { name, email, password, age, gender, address, role } = values;
        const data = { name, email, password, age, gender, address, role, _id: dataUpdate._id }
        const response = await fetch('http://localhost:8000/api/v1/users', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        const resJson = await response.json();
        if (resJson.data) {
            await fetchUsers(token);
            notification.success({
                message: 'Success',
                description: resJson.message
            })
            form.resetFields();
            setIsUpdateModalOpen(false);
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

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                email: dataUpdate.email,
                password: dataUpdate.password,
                age: dataUpdate.age,
                address: dataUpdate.address,
                gender: dataUpdate.gender,
                role: dataUpdate.role
            })
        }
    }, [dataUpdate]);

    return (
        <Modal title="Update a User"
            open={isUpdateModalOpen}
            onOk={() => { form.submit(); }}
            onCancel={() => { setIsUpdateModalOpen(false); form.resetFields(); }}
            maskClosable={false}>
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

                >
                    <Input.Password disabled />
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

export default UpdateUserModal;
