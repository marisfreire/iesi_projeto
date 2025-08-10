import React from "react"
import Calendar from "react-big-calendar"
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
/* Exemplo de consulta
 {
    "idPatient": 87256,
    "name": "PACIENTE TESTE DOC API",
    "schedule": [
        {
            "id": "",
            "idScheduleReturn": null,
            "dateSchudule": "04/08/2025",
            "local": 680,
            "idCalendar": 880,
            "procedures": [
                2623
            ],
            "hour": "08:00:00"
        }
    ]
}*/

export function Calendario(){
    const localizar = momentLocalizer(moment);

    const consultas =[ {
    "idPatient": 87256,
    "name": "PACIENTE TESTE DOC API",
    "schedule": [
        {
            "id": "",
            "idScheduleReturn": null,
            "dateSchedule": "04/08/2025",
            "local": 680,
            "idCalendar": 880,
            "procedures": [
                2623
            ],
            "hour": "08:00:00"
        }
    ]
}]
   // const [consultas, atualizarConsultas] = useState([]);

   // useEffect(() => {
        // pegar dados da API

   //  })

    const eventos = consultas.map( consulta => (
    {
        title: consulta.name,
        start: new Date(consulta.schedule.dateSchedule, consulta.schedule.dateHour),
        end: new Date()
    }   
    ))

    return (
        <div style = {{height: '80vh'}}>

        <Calendar>
        localizer={localizar},
        events={eventos},
        defaultView= "month",
        views={['month', 'week']},
        startAccessor='start',
        endAccessor='end'
        </Calendar>

        </div>
    )
}