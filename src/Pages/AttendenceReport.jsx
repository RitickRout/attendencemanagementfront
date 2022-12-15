import { useEffect, useState } from "react";
import axios from 'axios'
import Form from 'react-bootstrap/Form';
import { CSVLink, CSVDownload } from "react-csv";
import Formcompo from "../Components/Formcompo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'react-moment';
import moment from 'moment';


function Attendencereport() {

  var user = JSON.parse(localStorage.getItem('details'));
  const [record, setRecord] = useState('')
  const [initial, setInitial] = useState('')
  const [final, setfinal] = useState('')
  const [pageno, setPageno] = useState(0)
  const [pagination, setPagination] = useState()
  const [srch, setSrch] = useState('')
  const [sort, setSort] = useState('')
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());


  var filteredData, sortedData;


  function paginationArrayCreator(len) {
    let res = []
    for (let i = 0; i < len; i++) {
      res.push(i + 1)
    }
    return res
  }


  useEffect(() => {
    if (user.role === "Employee") {
      axios.post('http://localhost:8000/api/record/userattendence', { id: user.employee_ID }).then(
        (success) => {
          console.log("success", success)
          setRecord(success.data)
        console.log(indexFinder(success.data,startDate) , "checking the index of the first date ")  
           
         if(indexFinder(success.data,startDate).length){
            setInitial(indexFinder(success.data,startDate)[1])
         }
         if(indexFinder(success.data,endDate).length){
          setfinal(indexFinder(success.data,endDate)[1])
       }


        },
        (err) => {
          console.log("error", err)
        }
      )
    } else {
      axios.post('http://localhost:8000/api/record/allemployees', { "page": pageno }).then(
        (success) => {
          setRecord(success.data)
          if (srch) {
            filteredData = success.data.data.filter((item) => { return item.Name.toLowerCase().startsWith(srch) })
            console.log(filteredData)
            setRecord({ ...record, data: filteredData })
          }

          if (sort) {
            sortedData = success.data.data.sort((a, b) => a.Name.localeCompare(b.Name))
            console.log(sortedData, "sorted data ")
          }
          else if (sort === false) {
            sortedData = success.data.data.sort((a, b) => b.Name.localeCompare(a.Name))
          }

          setPagination(paginationArrayCreator(success.data.len))
        },
        (err) => {
          console.log("error", err)
        }
      )
    }
  }, [pageno, srch, sort,endDate,startDate])

  const handleShort = () => {
    setSort(!sort)
  }

function indexFinder(obj,date){
   let result =[]
   date =moment(date).format('DD/MM/YY')
   //console.log(  date, "checking the date input",obj)
   const date1 =date.split("/")
  obj.map((item,index)=>{
 let res = true;
 const temp =item.Date.split("-")
 for(let i =0; i < temp.length ;i++){
     if(temp[i] !=date1[i]){
         res = false
         break;
         }
 }
 if(res)
result.push(res, index) 
})
return result
}
  return (<>
    <section className="main">
      <div className="main-top">
        <h1>{(user.role === "Employer") ? "Manage Employees" : "Attendence Report"}  </h1>
      </div>
      <section className="attendance">
        <div className="attendance-list">
          {(user.role === "Employee") ?
            <>
            <div className="d-flex">
            <span><b>Form :</b><DatePicker className="datepickeer" selected={startDate} onChange={(date) => setStartDate(date)} />  </span> 
            <span><b>To : </b> <DatePicker className="datepickeer" selected={endDate} onChange={(date) => setendDate(date)} /></span>
            </div>
            
              <CSVLink data={record.slice(initial,final+1)}>Export Table Data</CSVLink>
              <table className="table ">
                <thead>
                  <tr>
                    <th>Sl.No</th>
                    <th>Date</th>
                    <th>Timein</th>
                    <th>Timeout</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>

                  {
                    (record) ?
                      <>
                        {
                          record.slice(initial,final+1).map((item, index) => {

                            return <tr  key={item + index}>
                              <td>{index + 1}</td>
                              <td>{item.Date}</td>
                              <td>{item.Timein}</td>
                              <td>{item.Timeout}</td>
                              <td>{item.Duration}</td>
                            </tr>
                          }
                          )
                        }
                      </>
                      : <tr></tr>
                  }</tbody>
              </table>
            </> :
            <>
              <div className="d-flex">
              <input placeholder="Search Employee" className='text-center pointer border border-2 mx-5' onChange={(e) => { setSrch(e.target.value.toLowerCase()) }} />
              <Formcompo />
              </div>
              <table className="table employeeslisttable" >
                <thead>
                  <tr>
                    <th>Sl.No</th>
                    <th>Name <i className="bi bi-arrow-down-up sort" onClick={handleShort}  ></i> </th>
                    <th>Email</th>
                    <th>Designation</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>

                  {(record) ?
                    <>
                      {
                        record.data.map((item, index) => {
                          // setTotal((prev)=>prev+item.difference)
                          return <tr  key={item + index}>
                            <td>{pageno ? 5 * pageno + 1 + index : 2 * pageno + 1 + index}</td>
                            {/* <td>{}</td> */}
                            <td>{item.Name}</td>
                            <td>{item.email}</td>
                            <td>{item.Designation}</td>
                            <td>{item.Department}</td>
                          </tr>
                        }
                        )
                      }
                    </>
                    : <tr></tr>
                  }</tbody>
              </table>
              <ul type='none' className="d-flex paginate">
                {(record) ?
                  pagination.map(item => (<li onClick={() => { setPageno(item - 1) }} key={item + 1}  >{item}</li>)) : <></>

                }
              </ul>
            </>
          }
        </div>
      </section>
    </section>
  </>);
}
export default Attendencereport;