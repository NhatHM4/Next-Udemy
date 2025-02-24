
import { Button, notification, Popconfirm, Table, TableColumnsType } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";


interface IUploader {
    _id: string;     // ID của người upload
    email: string;   // Email của người upload
    name: string;    // Tên người upload
    role: string;    // Vai trò (ADMIN, USER,...)
    type: string;    // Loại tài khoản (SYSTEM, EXTERNAL,...)
}

export interface ITrack {
    _id: string;        // Mã ID của track
    title: string;      // Tiêu đề của track
    description: string;// Mô tả của track (tên nghệ sĩ)
    category: string;   // Danh mục của track (ví dụ: "CHILL")
    imgUrl: string;     // URL hình ảnh của track
    trackUrl: string;   // URL file nhạc của track
    countLike: number;  // Số lượt thích
    countPlay: number;  // Số lượt phát
    uploader: IUploader; // Thông tin người upload
}

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjc2NmIyZDk0MWE1ZTVlZTkyOWEzZDFjIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MzUzNjQ3MTIsImV4cCI6MTgyMTc2NDcxMn0.aPAdUG-cB4fTqbwXiBbRk8hLjfxP3lF46Roqgn-ozY8'

const TrackTable = () => {
    const [listTracks, setListTracks] = useState<ITrack[]>([]);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    });

    const columns: TableColumnsType<ITrack> = [
        {
            title: "STT",
            // dataIndex: "_id",
            render: (text, record, index) => (meta.current - 1) * meta.pageSize + index + 1,

        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Track url',
            dataIndex: 'trackUrl',
            key: 'trackUrl',
        },
        {
            title: 'Uploader',
            key: 'trackUrl',
            render: (text: string, record: ITrack) => (
                <span>{record.uploader.name}</span>
            ),
        },
        {
            title: 'Action',
            render: (text, record: ITrack) => (
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

    const confirm = async (record: ITrack) => {
        const response = await fetch(`http://localhost:8000/api/v1/tracks/${record._id}`, {
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
        const response = await fetch(`http://localhost:8000/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`, {
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
            setListTracks(res.data.result);
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
            <Table dataSource={listTracks} columns={columns}
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

export default TrackTable;
