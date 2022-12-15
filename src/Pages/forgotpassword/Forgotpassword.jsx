import './forgotpassword.css'
import * as yup from 'yup'
import { useFormik } from 'formik';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Forgotpassword() {
    const navigate = useNavigate();

    const notify = (txt) => toast(txt);

 let email =localStorage.getItem('email')
const [err,setErr] = useState('')

 const initialValues = {
    email: window.localStorage.getItem("email")||"",
    otp:'',
    password:'',
    confirmpassword:''
};

const validate = yup.object().shape({
    email:yup.string()
      .required("Email is Required")
      .matches(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Enter valid Email"),

      otp:yup.string()
      .required("Otp is Required")
      .min(6,"Invalid otp")
      ,
    password: yup.string()
        .required("Enter password")
        .min(8, 'minimum 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
    confirmpassword: yup.string()
    .required("Confirm password")
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});


const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: validate,
    onSubmit: (values) => {
        updateChanges()
    } 

});

    const handleGenerate = () => {
        setErr('')
        if(values.email){
            axios.post("http://localhost:8000/api/auth/sendOtp",values).then(
              (success)=>{
                notify("successfully otp sended" )
                window.localStorage.setItem("email",values.email)
                window.location.reload()
              },
              (err)=>{
                console.log("Error Message ", err)
                setErr(err.response.data)
              }
            )

    }
}

const updateChanges = ()=>{
    setErr('')
    if(values.otp && values.password&& values.confirmpassword){
        if(values.password === values.confirmpassword){
         const {confirmpassword,...other}= values
         other.email =email 
         console.log("other object", other)
            axios.post("http://localhost:8000/api/auth/verify",other).then(
              (success)=>{
                notify("Successfully Password Updated" )
                console.log("successfully password reseted" , success);
                window.localStorage.removeItem('email')
                setTimeout(()=>{
                    navigate('/')
                    window.location.reload()
                },1000)
              },
              (err)=>{
                console.log("Error Message ", err)
                setErr(err.response.data)
              }
            )
        }
    }
}
console.log(errors)

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
                {
                    (email)?<>
                       <div >
                    <h4>Verify Otp</h4>
                    <form className="inputs">
                        <input type="number" placeholder="Please Enter Otp" name='otp'
                            onChange={handleChange} onBlur={handleBlur}
                        />
                       {errors.otp && touched.otp ? <span className='text-danger'>{errors.otp}</span>:<br /> } 
                        <input type="password" placeholder="password" name='password'
                            onChange={handleChange} onBlur={handleBlur}
                        />
                         {errors.password && touched.password ? <span className='text-danger'>{errors.password}</span>:<br /> } 
                        <input type="password" placeholder="Confirm password" name='confirmpassword'
                            onChange={handleChange} onBlur={handleBlur}
                        />
                          {errors.confirmpassword && touched.confirmpassword ? <span className='text-danger'>{errors.confirmpassword}</span>:<>{(err)?<span className='text-danger'>{err}</span>:<></> } </> }
                         <br />
                          <button type='submit' className='m-4 bg bg-danger'
                        onClick={handleSubmit}
                    >Update Changes</button>
                    </form>
                  
                </div>
                    
                    </>:
                    <>
                     <div >
                    <h4>Forgot Password</h4>
                    <form className="inputs">
                        <input type="text" placeholder="Email" name='email'
                            onChange={handleChange} onBlur={handleBlur}
                        />
                       {errors.email && touched.email ? <span className='text-danger'>{errors.email}</span> : <>   {(err)?<span className='text-danger'>{err}</span>:<></>} </>} 
                    
                    </form>
                    <button className='m-4 bg bg-danger' type='submit'
                        onClick={handleGenerate}
                    >forgotpassword</button>
                </div>

                    
                    </>
                }
               
            </div>
        </div>
    </>);
}


export default Forgotpassword