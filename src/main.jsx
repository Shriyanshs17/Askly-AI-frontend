import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './routes/dashboard/Dashboard.jsx';
import ChatPage from './routes/chatPage/ChatPage.jsx';
import Homepage from './routes/homepage/Homepage.jsx';
import RootLayout from './layouts/rootLayout/rootLayout.jsx';
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout.jsx';
import SignInPage from './routes/signInPage/SignInPage.jsx';
import SignUpPage from './routes/signUpPage/SignUpPage.jsx';



const router = createBrowserRouter([
   {
    element:<RootLayout/>,
    children:[
      {
        path: "/",
        element: <Homepage/>
      },
      {
        path: "/sign-in/*",
        element: <SignInPage/>
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage/>
      },
      {
        element:<DashboardLayout/>,
        children:[
          {
            path: "/dashboard",
            children:[
              {
                path:"/dashboard/chats/:id",element:<ChatPage/>
              },
              {
                path:"/dashboard" , element: <Dashboard/>,
              }
            ]
          },
        ]
      }
    ]
   }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
