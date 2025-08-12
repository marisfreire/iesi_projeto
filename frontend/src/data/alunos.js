// Mock de alunos e seus pacientes, compartilhado entre páginas.
export const mockAlunos = [
  {
    id: 'a001',
    nome: 'João Pereira',
    matricula: '20230021',
    curso: 'Odemologia',
    periodo: '5º',
    status: 'Em acompanhamento',
    pacientes: [
      {
        id: 1,
        nome: 'João Silva',
        idade: 10,
        diagnostico: 'TDAH',
        observacoes: 'Precisa de acompanhamento semanal.',
        ultimaConsulta: '10/03/2023',
        proximaConsulta: '07/04/2023',
        responsaveis: ['docente1'],
      },
      {
        id: 2,
        nome: 'Maria Oliveira',
        idade: 12,
        diagnostico: 'Dislexia',
        observacoes: 'Melhora significativa nas últimas semanas.',
        ultimaConsulta: '15/03/2023',
        proximaConsulta: '12/04/2023',
        responsaveis: ['docente1', 'docente2'],
      },
    ],
  },
  {
    id: 'a002',
    nome: 'Ana Santos',
    matricula: '20230022',
    curso: 'Odemologia',
    periodo: '4º',
    status: 'Concluído',
    pacientes: [],
  },
];
