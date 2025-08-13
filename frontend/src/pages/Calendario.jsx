import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function Calendario() {
  const localizer = momentLocalizer(moment);
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/calendario?data=2025-08-01&idCalendar=236")
      .then((res) => res.json())
      .then((dados)=> {
        console.log("Dados recebidos do backend:", dados);
        setConsultas(dados);
      })
      .catch((err) => console.error("Erro ao buscar agendamentos:", err));
  }, []);

  const eventos = Array.isArray(consultas)
  ? consultas.flatMap((consulta) =>
      consulta.schedule.map((agendamento) => {
        const [dia, mes, ano] = agendamento.dateSchedule.split("/").map(Number);
        const [hora, minuto, segundo] = agendamento.hour.split(":").map(Number);

        const startDate = new Date(ano, mes - 1, dia, hora, minuto, segundo);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1h

        return {
          title: `${consulta.name} - ${hora.toString().padStart(2, "0")}:${minuto
            .toString()
            .padStart(2, "0")}`,
          start: startDate,
          end: endDate
        };
      })
    )
  : [];

  const diasComAgendamento = new Set(
    eventos.map((evento) => moment(evento.start).format("YYYY-MM-DD"))
  );

  const dayPropGetter = (date) => {
    const diaFormatado = moment(date).format("YYYY-MM-DD");
    if (diasComAgendamento.has(diaFormatado)) {
      return {
        style: {
          backgroundColor: "#f8d7da"
        }
      };
    }
    return {};
  };

  const eventPropGetter = (event, start, end, isSelected) => {
    return {
      style: {
        backgroundColor: "#f8d7da",
        color: "#000",
        fontSize: "0.75rem",
        padding: "2px 4px",
        borderRadius: "4px",
        border: "none",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }
    };
  };

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
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
}
