import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider
} from "react-router-dom";
import './App.scss';
import App from './App.tsx';
import Login from './components/login.tsx';
import UserTable from './components/users/user.table.tsx';
import TrackTable from './components/tracks/track.table.tsx';
import CommentTable from './components/comments/comment.table.tsx';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: <Link to={"/"}>Home</Link>,
    key: 'home',
    icon: <MailOutlined />,
  },
  {
    label: <Link to={"/users"}>Manage Users</Link>,
    key: 'users',
    icon: <AppstoreOutlined />,
  },
  {
    label: <Link to={"/tracks"}>Manage Tracks</Link>,
    key: 'tracks',
    icon: <AppstoreOutlined />,
  },
  {
    label: <Link to={"/comments"}>Manage Comments</Link>,
    key: 'comments',
    icon: <AppstoreOutlined />,
  },

];

const Header: React.FC = () => {
  const [current, setCurrent] = useState('home');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};



const LayoutAdmin = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <App /> },
      {
        path: "users",
        element: <UserTable />,
      },
      {
        path: "tracks",
        element: <TrackTable />,
      },
      {
        path: "comments",
        element: <CommentTable />,
      },
    ]
  },

  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

    <RouterProvider router={router} />

  </React.StrictMode>,
)
