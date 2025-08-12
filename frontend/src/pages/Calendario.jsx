import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function Calendario() {
  const localizer = momentLocalizer(moment);
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/calendario")
      .then((res) => res.json())
      .then((dados) => setConsultas(dados))
      .catch((err) => console.error("Erro ao buscar agendamentos:", err));
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
