import './App.css';
import Dashboard from './Pages/Dashboard/Dashboard';
import Login from './Pages/Login/Login';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,Outlet
} from "react-router-dom";
import Forgotpassword from './Pages/forgotpassword/Forgotpassword';
import Attendencereport from './Pages/AttendenceReport';
import Navbar from './Components/Navbar';
import Attendencemanagement from './Pages/Attendencemanagement';



var auth = JSON.parse(localStorage.getItem('details'));

console.log(auth , "inside the app js ")

const Layout = ()=>{
  return (
    <>
    <div className="d-flex">
    <Navbar />
    <Outlet />
    </div>
    </>
    
  );
};




const router = createBrowserRouter([
  {
    path: "/",
    element:<>{(auth)?<Navigate to='/dashboard' />:<Login />}</>,
  },
  {
    path:"/forgotpassword",
    element:<>{(auth)?<Navigate to='/dashboard' />:<Forgotpassword />}</>
  },

  {
    path:"/dashboard",
    element:<>{(auth)?  <>
      <div className="d-flex">
      <Navbar />
      <Dashboard />
      </div>
      </>:<Navigate to='/' />}</>,
  },
      {
        path:'/dashboard/profile',
        element: <>{(auth)?  <div className="d-flex">
        <Navbar />
        <>profile</>
        </div>:<Navigate to='/' />}</>
      },
      {
        path:'/dashboard/attendancereport',
        element:<>{(auth)?  <div className="d-flex">
        <Navbar />
        <Attendencereport />
        </div> :<Navigate to='/' />}</>
      },
       {
        path:'/dashboard/attendancemanagement',
        element:  <>{(auth)?<div className="d-flex">
        <Navbar />
        <Attendencemanagement />   </div>:<Navigate to='/'  />}</>
      
       }
  
]);


function App() {
  return (
 <>
 <RouterProvider router={router}  />
 </>
  );
}

export default App;
