import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Button, notification, Table } from "antd";
import { useEffect, useState } from "react";
import CreateUserModal from './create.user.modal';
import UpdateUserModal from './update.user.modal';

export interface IUser {
    _id: number;
    email: string;
    name: string;
    address: string;
    age: string;
    gender: string;
    isVerify: string;
    password: string;
    role: string;
}



const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjc2NmIyZDk0MWE1ZTVlZTkyOWEzZDFjIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MzQ5NTc0MTgsImV4cCI6MTgyMTM1NzQxOH0.MXW66kL4SxhuV2fl6p48f7-hgy-L93upzWVfppgYEno'
const About = () => {
    const [listUsers, setListUsers] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<null | IUser>(null);

    const columns: TableColumnsType<IUser> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <a href={`/user/${record._id}`}>{text}</a>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Action',
            render: (text, record: IUser) => (
                <div>
                    <Button onClick={() => {
                        setIsUpdateModalOpen(true);
                        setDataUpdate(record);
                    }}
                    ><EditOutlined />
                    </Button>
                    <Button><DeleteOutlined /></Button>
                </div>
            )
        }
    ];

    const fetchUsers = async (token: string) => {
        const response = await fetch('http://localhost:8000/api/v1/users/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const res = await response.json();
        if (!res.data) {
            notification.error({
                message: 'Error',
                description: res.message
            });
        }
        setListUsers(res.data.result);
    }
    useEffect(() => {
        fetchUsers(token);
    }, []);




    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Table Users</h2>
                <div>
                    <Button icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>Add User</Button>
                </div>
            </div>
            <Table
                dataSource={listUsers}
                columns={columns}
                rowKey={"_id"}
            />;
            <CreateUserModal isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} token={token} fetchUsers={fetchUsers} />
            <UpdateUserModal isUpdateModalOpen={isUpdateModalOpen} setIsUpdateModalOpen={setIsUpdateModalOpen} token={token} fetchUsers={fetchUsers} dataUpdate={dataUpdate as IUser} setDataUpdate={setDataUpdate} />
        </div>
    );
}

export default About;
