import { Table, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import type { TableColumnsType } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Login from "./login";

interface IUser {
    _id: number;
    email: string;
    name: string;
    role: string;
}

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
    }
];


const About = () => {
    const [listUsers, setListUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchUsers = async (token: string) => {
            const response = await fetch('http://localhost:8000/api/v1/users/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const res = await response.json();
            setListUsers(res.data.result);
        }
        fetchUsers('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjc2NmIyZDk0MWE1ZTVlZTkyOWEzZDFjIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MzQ4NzM2NzUsImV4cCI6MTgyMTI3MzY3NX0.X6gU1Q3cZTVzBBL79UTbbd5EcNgDY73hA3JL5e1_NaA');

    }, []);




    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Table Users</h2>
                <div>
                    <Button icon={<PlusOutlined />} onClick={showModal}>Add User</Button>
                </div>
            </div>
            <Table
                dataSource={listUsers}
                columns={columns}
                rowKey={"_id"}
            />;

            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Login />
            </Modal>
        </div>
    );
}

export default About;
