import './dashboard.css'
import Button from 'react-bootstrap/Button';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import moment from 'moment';
import Stopwatch from '../../Components/stopwatch';


function Dashboard() {
  const navigate = useNavigate()
  var user = JSON.parse(localStorage.getItem('details'));
  const [total, setTotal] = useState('');
  const [status, setStatus] = useState('');
  const [refresh, setrefresh] = useState(false);
  const [record, setRecord] = useState('');
  const [starttime, setSatrtTime] = useState('')
  const [timer, setTimer] = useState(false)

  



  useEffect(() => {

    if (user.role === "Employee") {
      axios.post("http://localhost:8000/api/record/status", { id: user.employee_ID }).then(
        (success) => {
          console.log("successs message ", success)
          setStatus(success.data)
        },
        (err) => {
          console.log("error message ", err)
        }
      )

      axios.post("http://localhost:8000/api/record/todayrecord", { id: user.employee_ID }).then(
        (success) => {
          console.log("successs message ", success)
          setRecord(success.data)
          setSatrtTime(success.data[0].timein)
          setTotal(success.data[0].totaltime)
        },
        (err) => {
          console.log("error message ", err)
        }
      )
    } else {
      axios.post("http://localhost:8000/api/record/recordcount").then(
        (success) => {
          console.log("successs message ", success)
          setRecord(success.data)
        },
        (err) => {
          console.log("error message ", err)
        }
      )
    }


  }, [refresh])


  //   const setDuration = () => {
  //     if (starttime){
  //       var startTime = moment(starttime, 'HH:mm:ss ');
  //       var duration = moment.duration(endTime.diff(startTime));
  //       var hours = parseInt(duration.asHours())
  //       var min = (parseInt(duration.asMinutes()) % 60)
  //       var sec   = (parseInt(duration.asSeconds()) % 60)
  //       // setTime({["hours"]: parseInt(duration.asHours())})
  //       // setTime({...time,["min"]: (parseInt(duration.asMinutes()) % 60)})
  //       // setTime({...time,["sec"]:  (parseInt(duration.asSeconds()) % 60)})
  //       console.log(hours , min , sec,duration);
  //     }
  //   }
  // debugger
  //   setDuration()


  const date = moment(new Date()).format('MM/DD/YYYY')



  const handleTimein = () => {

    axios.post("http://localhost:8000/api/record/timein", { id: user.employee_ID }).then(
      (success) => {
        console.log("sucess message ", success);
        setrefresh(!refresh)
        setTimer(true)
      },
      (err) => {
        console.log("error message ", err)
      }
    )
    window.location.reload()
  }
  const handleTimeout = () => {

    axios.post("http://localhost:8000/api/record/timeout", { id: user.employee_ID, }).then(
      (success) => {
        console.log("sucess message ", success)
        setrefresh(!refresh)
        setTimer(false)
      },
      (err) => {
        console.log("error message ", err)
      }
    )
  }




  return (<>
    <>
      {(user.role === "Employee") ?
        <>
          <section className="main">
            <div className="main-top">
              <h1>DASHBOARD </h1>
            </div>

            <section className="attendance">
              <div className="attendance-list">
                <h4 className='my-4'>Mark Your Attendence   :
                  <>{(!total) ? <>  {(status === "Timein") ?
                    <Button variant="info" onClick={handleTimein}>Time in</Button> :
                    <Button variant="danger" onClick={handleTimeout}>Time out</Button>}
                  </> : <><span className='text-success h3 mx-3'>Succesfully Marked Attendence </span></>}</>
                  <span>
                    {(!total) ? <>  {
                      starttime ? <><Stopwatch time_in={starttime} tim_bool={timer} /></>
                        : <></>
                    }</> : <></>}
                  </span>
                </h4>
                <div className='my-4'>
                  <h3>Total hours Worked today : {total}</h3>
                </div>
                <h5 className='my-3'>Login Details :</h5>

                {(record) ?
                  <>
                    {
                      record.map((item, index) => {
                        return <ul className="active text-center" key={item + index} type='none'>
                          <li>


                            <h6>TIME IN</h6>
                            <hr />
                            {record[0].timein}


                          </li>
                          <li>
                            <h6>TIME OUT</h6>
                            <hr />
                            {item.timeout}
                          </li>

                          {/* <li>
                  <h4>Duration</h4>
                  <hr />
                    {item.difference}</li> */}
                        </ul>
                      }
                      )
                    }
                  </> : <></>}
              </div>
            </section>
          </section>
        </> :


        <> <section className="main">
          <div className="main-top">
            <h1>Today's Date :</h1>
          </div>
          <div className="users">

          </div>
          <section className="attendance d-flex  ">
            <div className="attendance-list">

              <h3> Date : {date}</h3>

              <span className="d-flex flex-row ">
                <span className='card mx-3 my-4'>
                  <div className='d-flex flex-column'>
                    <span className='fw-bold mx-3 my-1'>Number of  Employees Absent   </span>
                    <hr/>
                  <span className='text-center my-1'>   {(record) ? <>{record[1].count - record[0].count}</> : <></>} </span>
                     </div>
                </span>
                <span className="card mx-3 my-4 ">
                  <div  className='d-flex flex-column'><span className='fw-bold mx-3 my-1'>Number of Employees Present </span> 
                  <hr/>
                  <span className='text-center  my-1'>{(record) ? <>{record[0].count}</> : <></>}</span>
                  </div>
                </span>
              </span>
            </div>
          </section>
        </section></>}
    </>
  </>);

}

export default Dashboard;