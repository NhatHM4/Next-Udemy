import { Table } from "antd";
import { useEffect, useState } from "react";
import type { TableColumnsType } from 'antd';

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
            <Table dataSource={listUsers} columns={columns} />;
            {/* <table></table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {listUsers && listUsers.map((user: IUser) => (
                    <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                    </tr>
                ))}
            </tbody> */}
        </div>
    );
}

export default About;
