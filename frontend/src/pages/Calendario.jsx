import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Calendario.css"; // Mudar coisas específicas do calendário
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../services/api";

export default function Calendario() {
  const navigate = useNavigate();
  moment.locale("pt-br");
  const localizer = momentLocalizer(moment);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    async function loadCalendar() {
      try {
        setLoading(true);
        // Data padrão: primeiro dia do mês atual
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const yyyy = firstDay.getFullYear();
        const mm = String(firstDay.getMonth() + 1).padStart(2, "0");
        const dd = String(firstDay.getDate()).padStart(2, "0");
        const dateParam = `${yyyy}-${mm}-${dd}`;

        const { data } = await api.get("/calendario", {
          params: { data: dateParam, idCalendar: 236 },
        });
        console.log("Dados recebidos do backend:", data);
        setConsultas(data);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCalendar();
  }, [location]);

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
          backgroundColor: "#f6f8fb"
        }
      };
    }
    return {};
  };

  const eventPropGetter = () => {
    return {
      className: "custom-event-card"
    };
  };

  return (
    <div style={{ height: "80vh", fontFamily: 'Arial'}}>
      <button
        style={{
          marginBottom: "16px",
          padding: "10px 20px",
          background: "#12b0a1",
          color: "#000000",
          borderRadius: "6px",
          cursor: "pointer"
        }}
        onClick={() => navigate("/agendamento")}
      >
        Novo Agendamento
      </button>

      <div style={{position: 'relative', height: '100%'}}>
        {loading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'transparent',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            color: '#12b0a1',
            fontWeight: 'bold'
          }}>
            Atualizando dados...
          </div>
        )}
        <Calendar
          localizer={localizer}
          events={eventos}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          defaultView="month"
          views={["month", "week", "day"]}
          toolbar={true}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventPropGetter}
          messages={{
            today: "Hoje",
            previous: "Voltar",
            next: "Avançar",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "Não há eventos neste período.",
            showMore: (total) => `+ Ver mais (${total})`,
          }}
        />
      </div>
    </div>
  );
}
