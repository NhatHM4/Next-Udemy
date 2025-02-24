
import { Button, notification, Popconfirm, Table, TableColumnsType } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { IUser } from "../users/user.table";
import { ITrack } from "../tracks/track.table";


interface IComment {
    _id: string;
    content: string;
    moment: number;
    user: IUser;
    track: ITrack;
    isDeleted: boolean;
}



const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjc2NmIyZDk0MWE1ZTVlZTkyOWEzZDFjIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MzUzNjQ3MTIsImV4cCI6MTgyMTc2NDcxMn0.aPAdUG-cB4fTqbwXiBbRk8hLjfxP3lF46Roqgn-ozY8'

const CommentTable = () => {
    const [listComments, setListComments] = useState<IComment[]>([]);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    });

    const columns: TableColumnsType<IComment> = [
        {
            title: "STT",
            render: (text, record, index) => (meta.current - 1) * meta.pageSize + index + 1,

        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Track',
            key: 'track',
            dataIndex: ['track', 'title'],
        },
        {
            title: 'User',
            dataIndex: ['user', 'name'],
            key: 'user',
        },
        {
            title: 'Track url',
            dataIndex: 'trackUrl',
            key: 'trackUrl',
        },

        {
            title: 'Action',
            render: (text, record: IComment) => (
                <div>

                    <Popconfirm
                        title="Delete the track"
                        description="Are you sure to delete this track?"
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

    const handlePageChange = (page: number, pageSize: number) => {
        const currentMeta = { ...meta, current: page, pageSize };
        setMeta(currentMeta);
    };

    const confirm = async (record: IComment) => {
        const response = await fetch(`http://localhost:8000/api/v1/comments/${record._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const resJson = await response.json();
        if (resJson.data) {
            await fetchTracks();
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

    const fetchTracks = async () => {
        const response = await fetch(`http://localhost:8000/api/v1/comments?current=${meta.current}&pageSize=${meta.pageSize}`, {
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
            setListComments(res.data.result);
        } else {
            notification.error({
                message: 'Error',
                description: 'Invalid response data'
            });
        }

    }
    useEffect(() => {
        fetchTracks();
    }, [meta.current, meta.pageSize]);


    return (
        <div>
            <Table dataSource={listComments} columns={columns}
                rowKey={"_id"}
                pagination={{
                    defaultCurrent: 1,
                    current: meta.current,
                    total: meta.total,
                    pageSize: meta.pageSize,
                    onChange: handlePageChange,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    showSizeChanger: true,
                }} />;
        </div>
    );
}

export default CommentTable;
