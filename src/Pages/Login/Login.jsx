import './login.css'
import { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import * as yup from 'yup'
import {useFormik} from 'formik'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();

const [error, setError] = useState("")

const initialValues = {
  email: '',
  password: ''
};
const notify = (txt) => toast(txt);

const validate = yup.object().shape({
  email: yup.string()
      .required("Enter Email")
      .matches(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Enter valid Email"),
  password: yup.string()
      .required("Password is required")

})


const {values, errors, touched, handleChange, handleBlur, handleSubmit} = useFormik({
  initialValues: initialValues,
  validationSchema: validate,
  onSubmit: (values) => {
    
      const data =
          {
              email: values.email,
              password: values.password
          }
          handleSubmits()
  }

});
















const handleSubmits = ()=>{

console.log(values)
if(values.email && values.password){
  axios.post("http://localhost:8000/api/auth/login",values).then(
    (success)=>{
      notify(" Login Success")
      window.localStorage.setItem("details", JSON.stringify(success.data.other))
      window.localStorage.setItem("auth_token", success.data.token)
      
      window.dispatchEvent(new Event("storage"))
      setInterval(()=>{
        navigate('/dashboard')
        window.location.reload()
      },2000)
    },
    (err)=>{
      setError(err.response.data)
      console.log("Error Message ", err)
    }
  )
}
}






  return (<>
  <ToastContainer
position="top-center"
autoClose={1500}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
    <div className="box-form">
      <div className="left ">
        <div className="overlay">
          <h1>Attendance Management System</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et
            est sed felis aliquet sollicitudin Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit assumenda, mollitia ipsum debitis possimus soluta natus, voluptatibus dolorum tempore cum quos ut numquam, excepturi accusantium. Eaque incidunt enim odio inventore! Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit eligendi voluptatibus perferendis voluptate laborum corrupti quos magni, accusamus doloremque a perspiciatis labore distinctio quod ea, animi, eaque neque pariatur aliquam. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit, eligendi totam debitis nulla, quaerat repellendus doloremque unde vitae deserunt harum nihil aliquid pariatur vel placeat esse ab voluptas quo commodi?
          </p>
        </div>
      </div>
      <div className="right ">
        <h5>Login</h5>

        <form className="inputs">
          <input type="text" placeholder="Email" name='email' 
           onChange={handleChange}
           onBlur={handleBlur}
           value={values.email}
            />
               {errors.email && touched.email ? <span className='text-danger'>{errors.email}</span> : <br/>} 
          <br />
          <input type="password" placeholder="Password" name='password' 
          onChange={handleChange}
            value={values.password}
             onBlur={handleBlur} 
             />
            {errors.password && touched.password ? <span className='text-danger'>{errors.password}</span> : <br/>}
            {(error)?<span className='text-danger'>{error}</span>:<></>}
          <br />
        </form>
        <br />
        <div className="remember-me--forget-password">
        
          <p className='text-secondary forgotbtn' onClick={()=>{navigate('/forgotpassword')}}> forget password?</p>
        </div>
        <br />
        <button
        onClick={handleSubmit}
        >Login</button>
       
      </div>
    </div>
  </>);
}

export default Login;