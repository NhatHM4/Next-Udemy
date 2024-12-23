import { Input, Modal, notification } from "antd";
import { useState } from "react";


interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (value: boolean) => void;
    token: string;
    fetchUsers: (token: string) => void;
}
const CreateUserModal = ({ isCreateModalOpen, setIsCreateModalOpen, token, fetchUsers }: IProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');

    const handleOk = async () => {
        const data = { name, email, password, age, gender, address, role };
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
            handleCloseModel();
        } else {
            notification.error({
                message: 'Error',
                description: resJson.message
            })
        }
    };

    const handleCloseModel = () => {
        setIsCreateModalOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        setAge('');
        setGender('');
        setAddress('');
        setRole('');
    }
    return (
        <Modal title="Add New User"
            open={isCreateModalOpen}
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
                    <Input value={password} onChange={(e) => { setPassword(e.target.value) }} />
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

export default CreateUserModal;
