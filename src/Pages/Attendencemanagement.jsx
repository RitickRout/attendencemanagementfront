import { useEffect, useState } from "react";
import axios from 'axios'
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'react-moment';
import moment from 'moment';
import { CSVLink, CSVDownload } from "react-csv";


function Attendencemanagement() {
  const [report, setReport] = useState('')
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [srch, setSrch] = useState('')
  const [value,setvalue] = useState(0)
  let obj = {
    "from": moment(startDate).format('YYYY-MM-DD'),
    "to": moment(endDate).format('YYYY-MM-DD')
  }
   const datesArr = datesinBetween(obj.from,obj.to)

  useEffect(() => {
      const date = datesArr[value]
      axios.post("http://localhost:8000/api/record/attendenceinbetween",{"date":date}).then((success)=>{
        console.log(success.data , "iam the success data ")
        if (srch) {
         let filteredData = success.data.filter((item) => { return item.Name.toLowerCase().startsWith(srch) })
                setReport(filteredData) 
                }else{
                 setReport(success.data)
              
                }
    },
    (err)=>{
      console.log(err,"inside the error object")
    }
    )

    return () => {
      setReport('')
  }
       

  }, [srch,startDate,endDate,value])

  function datesinBetween(date1,date2){
    let result 
   var getDaysArray = function(start, end) {
    for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
  };
  var daylist = getDaysArray(new Date(date1),new Date(date2));
  result =daylist.map((v)=>( v.toISOString().slice(0,10)))
  
  return result
  }
  

  return (<>
    <section className="main">
    <div className="main-top mb-4">
    <h1>All Employees Attendence</h1>
    </div>
   
      <div className="d-flex ">

        <div className="d-flex w-50">   <b>From:</b> <span ><DatePicker className="datepickeer"  minDate={new Date(2022,11,2)}  maxDate={new Date()}    selected={startDate}  onChange={(Date) => setStartDate(Date)} /> </span>
          <b>To:</b> <span><DatePicker  className="datepickeer"  minDate={new Date(2022,11,2)}  maxDate={new Date()} selected={endDate} onChange={(Date) => setEndDate(Date)} /> </span>
        </div>
        <input placeholder='Search' className='text-center pointer border border-2' onChange={(e) => (setSrch(e.target.value))} />
      </div>
      {

        (report) ? <div className="export"><CSVLink data={report} className='export'>Export Table Data</CSVLink></div> : <></>

      }
  
  <table className="table">
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Name</th>
              <th>Date</th>
              <th>status</th>
              <th>Timein</th>
              <th>Timeout</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
          {
             (report)?<>
            {
                 report.map((item,index)=>{
                const date =  moment(item.date).format('DD-MM-YYYY')
                 return <tr key={item + index}>
                   <td>{index + 1}</td>
                   <td>{item.Name}</td>
                   <td>{date}</td>
                   <td>{item.status}</td>
                   <td>{item.timein}</td>
                   <td>{item.timeout}</td>
                   <td>{item.Duration}</td>
                   </tr>
                 }
                 )
            }
             
             </>:<></>
          }
          
          
           </tbody>
        </table>
          <ul type="none" className="paginate">
            {(datesArr.length>1)?datesArr.map((item,index)=>{
               return <li onClick={()=>{setvalue(index)}}>{index+1}</li>
            }):
            <></>}
          </ul>



    </section>
  </>);
}

export default Attendencemanagement;