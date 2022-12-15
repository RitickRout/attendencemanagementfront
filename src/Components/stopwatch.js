import {useEffect, useRef, useState} from "react";
import moment from 'moment';

const Stopwatch = ({time_in,tim_bool})=>{
    const [time,setTime]=useState(0)
    const [running, setRunning] = useState(tim_bool);
    const [hou, setHou] = useState(0);
    const [mi, setMi] = useState(0)
    const [se, setSe] = useState(0)
    let act_date = new Date()
    let nowDateTime = act_date.toISOString();
    let nowDate = nowDateTime.split('T')[0];
    let date = new Date(nowDate+'T'+time_in)
    let startTime = moment(date, 'HH:mm:ss');
    let endTime=moment(act_date,'HH:mm:ss')
    let new_duration =useRef("")
    let duration=moment.duration(endTime.diff(startTime))


    const duration_set=()=>{
        setHou(duration._data.hours)
        setMi(duration._data.minutes)
        setSe(duration._data.seconds)
    }


    useEffect(() => {
            new_duration.current= setInterval(duration_set, 1000);
     return () => clearInterval(new_duration.current);
    },[duration,tim_bool]);



    return (
        <div className="stopwatch">
            <div className="numbers">
                <span>{("0" + Math.floor((hou ) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((mi ) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((se ) % 60)).slice(-2)}</span>
            </div>

        </div>
    );
};

export default Stopwatch;
