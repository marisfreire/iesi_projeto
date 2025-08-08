@echo off
setlocal EnableDelayedExpansion

REM ==============================================
REM Script: setup_and_run_windows.bat
REM Objetivo: Instalar dependências (frontend/backend)
REM           e iniciar ambos em janelas separadas no Windows
REM ==============================================

REM Diretório raiz do projeto
set "ROOT=%~dp0"
pushd "%ROOT%"

echo.
echo ===============================================
echo  IESI PROJETO - SETUP E EXECUCAO
echo ===============================================
echo.
echo Escolha uma opcao:
echo.
echo [1] Setup RAPIDO (mantem instalacoes existentes)
echo [2] Apenas RODAR (nao instala nada, so executa)
echo [0] Sair
echo.

:menu
set /p "opcao=Digite sua escolha (0-2): "

if "%opcao%"=="0" goto :end
if "%opcao%"=="1" goto :setup_rapido
if "%opcao%"=="2" goto :apenas_rodar

echo.
echo [ERRO] Opcao invalida. Digite 0, 1 ou 2.
echo.
goto :menu

:setup_rapido
echo.
echo ===== SETUP RAPIDO SELECIONADO =====
echo Mantendo instalacoes existentes e complementando se necessario...
set "MODO=rapido"
goto :verificar_ferramentas

:apenas_rodar
echo.
echo ===== APENAS RODAR SELECIONADO =====
echo Pulando instalacoes e executando diretamente...
set "MODO=rodar"
goto :verificar_ambiente

:verificar_ferramentas
echo.
echo ===== Verificando ferramentas obrigatorias =====
set "PYTHON_CMD=python"
where %PYTHON_CMD% >nul 2>nul || (
  where py >nul 2>nul && (
    set "PYTHON_CMD=py -3"
  ) || (
    echo [ERRO] Python nao encontrado no PATH. Instale Python 3.x e tente novamente.
    pause
    goto :end
  )
)

where node >nul 2>nul || (
  echo [ERRO] Node.js nao encontrado no PATH. Instale Node.js e tente novamente.
  pause
  goto :end
)

where npm >nul 2>nul || (
  echo [ERRO] npm nao encontrado no PATH. Verifique a instalacao do Node.js.
  pause
  goto :end
)

echo [OK] Python encontrado: %PYTHON_CMD%
echo [OK] Node.js encontrado
echo [OK] npm encontrado

goto :configurar_backend

:configurar_backend
echo.
echo ===== Configurando ambiente do backend (Flask) =====
if not exist "backend\" (
  echo [ERRO] Pasta backend nao encontrada.
  pause
  goto :end
)

REM Cria venv se não existir
if not exist "backend\.venv\Scripts\python.exe" (
  echo Criando ambiente virtual em backend\.venv ...
  %PYTHON_CMD% -m venv "backend\.venv" || goto :error
)

echo Atualizando pip e instalando/atualizando dependencias do backend...
"backend\.venv\Scripts\python.exe" -m pip install --upgrade pip || goto :error

if exist "backend\requirements.txt" (
  "backend\.venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt" || goto :error
) else (
  echo [AVISO] requirements.txt nao encontrado. Verificando dependencias basicas...
  "backend\.venv\Scripts\python.exe" -m pip install flask flask-cors requests python-dotenv || goto :error
)

echo [OK] Backend configurado com sucesso!

goto :configurar_frontend

:configurar_frontend
echo.
echo ===== Configurando ambiente do frontend (React) =====
if not exist "frontend\" (
  echo [ERRO] Pasta frontend nao encontrada.
  pause
  goto :end
)

REM GARANTE QUE ESTAMOS NA PASTA FRONTEND DURANTE TODA A INSTALAÇÃO
echo Navegando para pasta frontend: %ROOT%frontend
cd /d "%ROOT%frontend"

if exist "node_modules\" (
  echo node_modules ja existe na pasta frontend. Executando npm install para sincronizar...
) else (
  echo Instalando dependencias na pasta frontend...
)

if exist "package.json" (
  npm install || (echo [ERRO] Falha ao instalar dependencias do frontend && cd /d "%ROOT%" && goto :error)
) else (
  echo [ERRO] package.json nao encontrado na pasta frontend.
  cd /d "%ROOT%"
  pause
  goto :end
)

REM Garante dependências importantes na pasta frontend
npm install react-router-dom@latest --save 2>nul
npm install react-scripts@latest --save 2>nul

REM VOLTA PARA A PASTA RAIZ APÓS CONFIGURAR FRONTEND
cd /d "%ROOT%"

echo [OK] Frontend configurado com sucesso na pasta frontend!

goto :verificar_ambiente

:verificar_ambiente
echo.
echo ===== Verificando se tudo esta pronto =====

if not exist "backend\.venv\Scripts\python.exe" (
  echo [ERRO] Ambiente virtual do backend nao foi criado.
  echo Execute novamente escolhendo a opcao 1.
  pause
  goto :end
)

if not exist "frontend\node_modules\" (
  echo [ERRO] Dependencias do frontend nao foram instaladas na pasta frontend.
  echo Execute novamente escolhendo a opcao 1.
  pause
  goto :end
)

echo [OK] Ambiente pronto para execucao!
echo [OK] node_modules instalado em: frontend\node_modules\
echo [OK] venv instalado em: backend\.venv\

goto :iniciar_aplicacao

:iniciar_aplicacao
echo.
echo ===== Iniciando aplicacao =====
echo.
echo IMPORTANTE: As janelas do backend e frontend abrirao em alguns segundos.
echo Se alguma janela nao abrir ou travar, execute manualmente:
echo.
echo Backend: cd backend ^&^& .venv\Scripts\python.exe app.py
echo Frontend: cd frontend ^&^& npm start
echo.

echo Iniciando backend...
REM Inicia backend em nova janela - sintaxe corrigida
echo [BACKEND] Iniciando servidor Flask...
start "IESI Backend (Flask)" cmd /k "cd backend && .venv\Scripts\python.exe app.py"

echo Iniciando frontend...
REM Inicia frontend em nova janela - sintaxe corrigida
echo [FRONTEND] Iniciando servidor React...
start "IESI Frontend (React)" cmd /k "cd frontend && npm start"

echo.
echo ===============================================
echo  APLICACAO INICIADA!
echo ===============================================
echo.
echo Backend: http://localhost:5000 (ou porta configurada no app.py)
echo Frontend: http://localhost:3000
echo.
echo As janelas foram abertas. Aguarde alguns segundos para os servidores iniciarem.
echo.
echo Estrutura verificada:
echo - backend\.venv\ (ambiente Python)
echo - frontend\node_modules\ (dependencias React)
echo.
echo Se algum servico nao iniciar:
echo 1. Feche as janelas que travaram
echo 2. Execute este script novamente escolhendo opcao 2 (Apenas Rodar)
echo.

goto :end

:error
echo.
echo ===============================================
echo [ERRO] Ocorreu um erro durante a execucao!
echo ===============================================
echo.
echo Tente executar novamente escolhendo:
echo - Opcao 1 (Setup Rapido) para tentativa mais conservadora
echo - Opcao 2 (Apenas Rodar) se as dependencias ja estao instaladas
echo.
pause

:end
popd
endlocal
pause