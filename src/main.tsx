import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Link
} from "react-router-dom";
import About from './components/about.tsx';
import './App.scss';
import Login from './components/login.tsx';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: <Link to={"/"}>Home</Link>,
    key: 'home',
    icon: <MailOutlined />,
  },
  {
    label: <Link to={"/about"}>Manage Users</Link>,
    key: 'app',
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
        path: "about",
        element: <About />,
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
