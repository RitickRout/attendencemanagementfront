import "./navbar.css"
import {Link,useNavigate} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Navbar() {
  var user = JSON.parse(localStorage.getItem('details'));

  const notify = (txt) => toast(txt);

  const logout = () => {
    notify("Logout Sucessfully")
    setTimeout(() => {
      window.localStorage.removeItem("details");
      window.localStorage.removeItem("auth_token");
    }, 500)
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  
  }
           
  console.log(user , "checking user inside navbar")



    return (<>
      <ToastContainer
position="top-center"
autoClose={1000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
     <nav>
        <ul type='none'>
          <li>
            <a href="#" className="logo">
              <img src="https://i.pinimg.com/736x/28/85/22/28852296dd879a5d38ad9e5e537f2109.jpg" />
              <span className="nav-item">{user.Name}</span>
            </a>
          </li>
          <li>
            <Link to='/dashboard'>
              <i className="fas fa-menorah" />
              <span className="nav-item">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to='/dashboard/attendancereport'>
         
              <i className="fas fa-chart-bar" />
               {(user.role ==="Employer")?<span className="nav-item">Manage</span>:<span className="nav-item">Attendance Report</span>} 
          
            </Link>
            
          </li>
          {(user.role ==="Employer") ? <li>
              <Link to='/dashboard/attendancemanagement'>
              <i className="bi bi-person-lines-fill fas"></i>
              <span className="nav-item">Attendence</span>
              </Link>
          </li>:<li></li> }
          <li>
            <a className="logout" onClick={logout} >
              <i className="fas fa-sign-out-alt" />
              <span className="nav-item" >Log out</span>
            </a>
          </li>
        </ul>
      </nav>
    </>  );
}

export default Navbar;