import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from '../App';
import HeritageLayout from '../layouts/HeritageLayout';
import HeritageHome from '../pages/HeritageHome';
import HeritageList from '../pages/HeritageList';
import HeritageDetail from '../pages/HeritageDetail';
import HeritageProtection from '../pages/HeritageProtection';
import HeritageInform from '../pages/HeritageInform';
import HeritageMap from '../pages/HeritageMap';
import Login from '../components/Login/Login';
import HeritagePersonal from '../pages/HeritagePersonal';
// 添加HeritagePost导入
import HeritagePost from '../pages/HeritagePost';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    
    children: [
       {
        index: true,
        element: <Navigate to="/heritage" replace />
      },
      
      {
        path: 'heritage',
        element: <HeritageLayout />,
        children: [
          {
            index: true,
            element: <HeritageHome />
          },
          {
            path: 'list',
            element: <HeritageList />
          },
          {
            path: 'detail/:id',
            element: <HeritageDetail />
          },
          {
            path: 'protection',
            element: <HeritageProtection />
          },
          {
            path: 'inform/:id',
            element: <HeritageInform />
          },
          {
            path: 'map',
            element: <HeritageMap />
          },
          {
            path: 'personal',
            element: <HeritagePersonal />
          },
          {
            path: 'post',
            element: <HeritagePost />
          }
        ]
      }
    ]
  },
      {
        path: 'login',
        element: <Login />
      }
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
// 在heritage路由的children中添加

