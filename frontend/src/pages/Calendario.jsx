import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function Calendario() {
  const localizer = momentLocalizer(moment);

  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    //não estou conseguindo receber as informacoes da api 
    //fica dando erro 401 "não autorizado"
    //vou deixar mockado e depois olhamos isso melhor  
    const dadosAPI = [
      {
        idPatient: 87256,
        name: "PACIENTE TESTE DOC API",
        schedule: [
          {
            id: "",
            idScheduleReturn: null,
            dateSchedule: "04/08/2025",
            local: 680,
            idCalendar: 880,
            procedures: [2623],
            hour: "08:00:00"
          }
        ]
      }
    ];
    setConsultas(dadosAPI);
  }, []);

  const eventos = consultas.flatMap((consulta) =>
    consulta.schedule.map((agendamento) => {
      const [dia, mes, ano] = agendamento.dateSchedule.split("/").map(Number);
      const [hora, minuto, segundo] = agendamento.hour.split(":").map(Number);

      const startDate = new Date(ano, mes - 1, dia, hora, minuto, segundo);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1h

      return {
        title: consulta.name,
        start: startDate,
        end: endDate
      };
    })
  );

  return (
    <div style={{ height: "80vh" }}>
      <Calendar
        localizer={localizer}
        events={eventos}
        defaultView="month"
        views={["month", "week", "day"]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
      />
    </div>
  );
}
