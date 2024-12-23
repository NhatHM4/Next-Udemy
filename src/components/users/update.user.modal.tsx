import { Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { IUser } from "./user.table";


interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (value: boolean) => void;
    token: string;
    fetchUsers: (token: string) => void;
    dataUpdate: IUser;
    setDataUpdate: (value: null | IUser) => void;
}
const UpdateUserModal = ({ isUpdateModalOpen, setIsUpdateModalOpen, token, fetchUsers, dataUpdate, setDataUpdate }: IProps) => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [role, setRole] = useState<string>('');

    const handleOk = async () => {
        const data = { name, email, password, age, gender, address, role, _id: dataUpdate?._id };
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
            handleCloseModel();
        } else {
            notification.error({
                message: 'Error',
                description: resJson.message
            })
        }

    };

    const handleCloseModel = () => {
        setIsUpdateModalOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        setAge('');
        setGender('');
        setAddress('');
        setRole('');
        setDataUpdate(null);
    }

    useEffect(() => {
        if (dataUpdate) {
            setName(dataUpdate.name);
            setEmail(dataUpdate.email);
            setPassword(dataUpdate.password);
            setAge(dataUpdate.age);
            setGender(dataUpdate.gender);
            setAddress(dataUpdate.address);
            setRole(dataUpdate.role);
        }
    }, [dataUpdate]);
    return (
        <Modal title="Update a User"
            open={isUpdateModalOpen}
            onOk={handleOk}
            onCancel={() => handleCloseModel()}
            maskClosable={false}>
            <div>
                <div>
                    <label>Name</label>
                    <Input value={name} onChange={(e) => { setName(e.target.value) }} />
                </div>
                <div>
                    <label>Email</label>
                    <Input value={email} onChange={(e) => { setEmail(e.target.value) }} />
                </div>
                <div>
                    <label>Password</label>
                    <Input value={"*********"} onChange={(e) => { setPassword(e.target.value) }} disabled />
                </div>
                <div>
                    <label>Age</label>
                    <Input value={age} onChange={(e) => { setAge(e.target.value) }} />
                </div>
                <div>
                    <label>Gender</label>
                    <Input value={gender} onChange={(e) => { setGender(e.target.value) }} />
                </div>
                <div>
                    <label>Address</label>
                    <Input value={address} onChange={(e) => { setAddress(e.target.value) }} />
                </div>
                <div>
                    <label>Role</label>
                    <Input value={role} onChange={(e) => { setRole(e.target.value) }} />
                </div>
            </div>
        </Modal>
    );
}

export default UpdateUserModal;
