import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useFormik } from 'formik'
import * as yup from 'yup'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function Formcompo() {
    const [show, setShow] = useState(false);
    const [error,setError] = useState('')
    const notify = (txt) => toast(txt);
    const initialValues = {
        Name: '',
        email: '',
        password: '',
        confirmpassword: '',
        Address: '',
        department: '',
        designation: ''
    };

    const validate = yup.object().shape({
        Name: yup.string()
             .required("Enter Name")
             .matches(/^[a-z ,.'-]+$/i,
             "Enter Valid Name")
        ,
        email: yup.string()
            .required("Enter Email")
            .matches(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Enter valid Email"),
        password: yup.string()
            .required("Password is required")
            .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/,"Should contain special character alphabet And number")
            .min(8, 'Password must be 8 characters long.'),
        confirmpassword:yup.string()
        .required("confirm Password")
         .oneOf([yup.ref('password'),null],'Password must match'),
         Address:yup.string()
         .required("Enter Address")
         .min(5,"Minimum 5 characters"),
         department:yup.string()
         .required("Department is Required"),
         designation:yup.string()
         .required("designation is required")
    })

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: validate,
        onSubmit: (values) => {
            var {confirmpassword , ...other} = values
            console.log(other, "values")
            setError('')
            try{

                axios.post('http://localhost:8000/api/auth/addemployee',other).then(
                    (success)=>{
                        handleClose();
                        notify("Employeee Added Succesfully ")
                    },(err)=>{
                        console.log(err,"errors ")
                        setError(err.response.data)
                    }
                )

            }catch(err){
                console.log("checking the error",err)
             }



        }

    });



    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    // const handleChanges=(e)=>{
    //     setValues({...values,[e.target.name]:e.target.value})
    // }
    // const handleSubmits=()=>{
    //       try{
    //        if(Object.keys(values).every((k) => (!!values[k].length >0))){
    //            var {confirmpassword , ...other} = values
    //         axios.post('http://localhost:8000/api/auth/addemployee',other).then(
    //             (success)=>{
    //                 console.log("added employeee succesfully ")
    //                 handleClose();
    //                setValues(Object.keys(values).every((k) => (values[k] =''))) 
    //             }
    //         )
    //        }
    //       }catch(err){
    //          console.log(err)
    //       }
    // }





    return (
        <>
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
            <span className="border p-2 rounded border-secondary  addemployee" onClick={handleShow}  > Add Employee</span>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Enter Full Name*" name='Name' value={values.Name} onChange={handleChange}
                            onBlur={handleBlur}
                            />
                         {errors.Name && touched.Name ? <span className='text-danger'>{errors.Name}</span> : ""}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="email" placeholder="Enter email*" name='email' value={values.email}  
                             onChange={handleChange} 
                             onBlur={handleBlur}    />
                             {errors.email && touched.email ? <span className='text-danger'>{errors.email}</span> : ""}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="Password*" name="password"  value={values.password} onChange={handleChange} 
                                  onBlur={handleBlur}
                              />
                       {errors.password && touched.password ? <span className='text-danger'>{errors.password}</span> : ""}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="Confirm Password*" name="confirmpassword"  value={values.confirmpassword}  onChange={handleChange} 
                                  onBlur={handleBlur}
                            />
                             {errors.confirmpassword && touched.confirmpassword ? <span className='text-danger'>{errors.confirmpassword}</span> : ""}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Address*" name="Address"  value={values.Address} onChange={handleChange}   />
                            {errors.Address && touched.Address ? <span className='text-danger'>{errors.Address}</span> : ""}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Department*" name='department'  value={values.department}  onChange={handleChange}  />
                            {errors.department && touched.department ? <span className='text-danger'>{errors.department}</span> : ""}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Designation*" name='designation'  value={values.designation}  onChange={handleChange}  />
                            {errors.designation && touched.designation ? <span className='text-danger'>{errors.designation}</span> : ""}
                        </Form.Group>
                        {(error)?<span className='text-danger'>{error}</span>:""}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Add Employee
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default Formcompo