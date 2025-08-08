@echo off
setlocal

REM ==============================================
REM Script: setup_and_run_windows.bat
REM Objetivo: Instalar dependências (frontend/backend)
REM           e iniciar ambos em janelas separadas no Windows
REM Requisitos: Python 3.x, Node.js e npm no PATH
REM ==============================================

REM Diretório raiz do projeto
set "ROOT=%~dp0"
pushd "%ROOT%"

echo.
echo ===== Verificando ferramentas obrigatorias =====
set "PYTHON_CMD=python"
where %PYTHON_CMD% >nul 2>nul || (
  where py >nul 2>nul && (
    set "PYTHON_CMD=py -3"
  ) || (
    echo [ERRO] Python nao encontrado no PATH. Instale Python 3.x e tente novamente.
    goto :end
  )
)
where node >nul 2>nul || (
  echo [ERRO] Node.js nao encontrado no PATH. Instale Node.js e tente novamente.
  goto :end
)
where npm >nul 2>nul || (
  echo [ERRO] npm nao encontrado no PATH. Verifique a instalacao do Node.js.
  goto :end
)

echo.
echo ===== Configurando ambiente do backend (Flask) =====
if not exist "backend\" (
  echo [ERRO] Pasta backend nao encontrada.
  goto :end
)

REM Cria venv se nao existir
if not exist "backend\.venv\Scripts\python.exe" (
  echo Criando ambiente virtual em backend\.venv ...
  %PYTHON_CMD% -m venv "backend\.venv" || goto :error
)

echo Atualizando pip e instalando dependencias do backend ...
"backend\.venv\Scripts\python.exe" -m pip install --upgrade pip || goto :error
"backend\.venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt" || goto :error

echo.
echo ===== Instalando dependencias do frontend (React) =====
if not exist "frontend\package.json" (
  echo [ERRO] frontend\package.json nao encontrado.
  goto :end
)

pushd "frontend"
if exist node_modules (
  echo node_modules ja existe. Executando npm install para sincronizar...
) else (
  echo Instalando dependencias do frontend ...
)
npm install || (popd & goto :error)

REM Garante react-router-dom caso ainda nao esteja presente (opcional)
findstr /i /c:"react-router-dom" package.json >nul 2>nul || (
  echo Adicionando react-router-dom ao projeto ...
  npm install react-router-dom@latest --save || (popd & goto :error)
)
popd

echo.
echo ===== Iniciando backend e frontend em janelas separadas =====
REM Backend: abre nova janela e executa app.py com o Python da venv
start "backend" cmd /k "cd /d \"%ROOT%backend\" && \".venv\\Scripts\\python.exe\" app.py"

REM Frontend: abre nova janela e executa npm start
start "frontend" cmd /k "cd /d \"%ROOT%frontend\" && npm start"

echo.
echo Tudo pronto!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
goto :end

:error
echo.
echo [ERRO] Ocorreu um problema durante a instalacao ou inicializacao. Veja as mensagens acima.

:end
popd
endlocal