import { DeleteOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Button, notification, Popconfirm, Table } from "antd";
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



const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjc2NmIyZDk0MWE1ZTVlZTkyOWEzZDFjIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MzUxMzIzOTYsImV4cCI6MTgyMTUzMjM5Nn0.9n93oLNcKr7Zp2BP4NxTe6wenOsooRR42BzzVJvXfts'
const About = () => {
    const [listUsers, setListUsers] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<null | IUser>(null);
    // const [current, setCurrent] = useState(1);
    // const [pageSize, setPageSize] = useState(10);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 2,
        pages: 0,
        total: 0
    });

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
                    <Popconfirm
                        title="Delete the user"
                        description="Are you sure to delete this user?"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => confirm(record)}>
                        <Button>
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                </div>
            )
        }
    ];

    const confirm = async (record: IUser) => {
        // console.log(record);
        const response = await fetch(`http://localhost:8000/api/v1/users/${record._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const resJson = await response.json();
        if (resJson.data) {
            await fetchUsers();
            notification.success({
                message: 'Success',
                description: resJson.message
            })
        } else {
            notification.error({
                message: 'Error',
                description: resJson.message
            })
        }

    };

    const fetchUsers = async () => {
        const response = await fetch(`http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`, {
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
        if (res.data && res.data.meta && res.data.result) {
            const currentMeta = {
                total: res.data.meta.total,
                pages: res.data.meta.pages,
                pageSize: res.data.meta.pageSize,
                current: res.data.meta.current
            };
            setMeta(currentMeta);
            setListUsers(res.data.result);
        } else {
            notification.error({
                message: 'Error',
                description: 'Invalid response data'
            });
        }

    }
    useEffect(() => {
        fetchUsers();
    }, [meta.current, meta.pageSize]);

    const handlePageChange = (page: number, pageSize: number) => {
        console.log(pageSize)
        const currentMeta = { ...meta, current: page, pageSize };
        setMeta(currentMeta);
    };




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
                pagination={{
                    defaultCurrent: 1,
                    current: meta.current,
                    total: meta.total,
                    pageSize: meta.pageSize,
                    onChange: handlePageChange,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    showSizeChanger: true,
                }}
            />;
            {/* <Pagination defaultCurrent={1} current={meta.current} pageSize={meta.pageSize} total={meta.total} onChange={handlePageChange} /> */}
            <CreateUserModal isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} token={token} fetchUsers={fetchUsers} />
            <UpdateUserModal isUpdateModalOpen={isUpdateModalOpen} setIsUpdateModalOpen={setIsUpdateModalOpen} token={token} fetchUsers={fetchUsers} dataUpdate={dataUpdate as IUser} setDataUpdate={setDataUpdate} />
        </div>
    );
}

export default About;
