# Sistema de Integração para a Clínica de Radiologia Odontológica
Este é um projeto desenvolvido na disciplina de Integração e Evolução de Sistemas da Informação no semestre 2025.1 pela equipe composta por Byanca Maria, Giovanna Mafra, Joab Henrique, Julia Zovka, Julyana dos Santos, Lavoisier Oliveira, Letícia Andrade, Luís Eduardo, Luma Rios, Mariana Beatriz, Mariana Sousa e Renan Santana.

## Objetivo

O objetivo do projeto é ser um sistema centralizado para facilitar e otimizar os principais processos da Clínica-Escola de Radiologia Odontológica da Universidade Federal de Pernambuco (UFPE).

## Diretórios

iesi_projeto/
├── backend/
│   ├── routes/
│   │   ├── agendamento.py
│   │   ├── calendario.py
│   │   ├── login.py
│   │   └── pacientes.py  
│   ├── services
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   └── src/
│       ├── components
│       ├── data/
│       ├── pages/   -- Inclui todas as as páginas da nossa aplicação
│       ├── services/
│       ├── App.jsx
│       ├── App.test.js
│       ├── index.css
│       └── index.js
├── README.md
├── setup_and_run_windows.bat
└── setup.sh


## Rodando localmente

Clone o projeto

```bash
  git clone https://link-to-project
```

Vá para o diretório do projeto
```bash
  cd iesi_projeto
```

Certifique-se que você tem versões estáveis de Python e Node instaladas antes de prosseguir.

Para linux:
```bash
    ./setup.sh
```

Para windows:

```bash
  ./setup_and_run_windows.bat
```

