echo off
echo Test.cmd started

set Deploy_Server="DSQL02\V2012"
set Deploy_Database="CRIS"

echo Check if enviroment variables are defined.
IF NOT DEFINED Deploy_Server (echo ERROR: The environment variable [Deploy_Server] is not defined.&GOTO :eof)
IF NOT DEFINED Deploy_Database (echo ERROR: The environment variable [Deploy_Database] is not defined.&GOTO :eof)

echo Unquote environment variables.
FOR /F "delims=" %%I IN (%Deploy_Server%) DO SET Deploy_Server=%%I
FOR /F "delims=" %%I IN (%Deploy_Database%) DO SET Deploy_Database=%%I
IF DEFINED Deploy_Username (FOR /F "delims=" %%I IN (%Deploy_Username%) DO SET Deploy_Username=%%I)
IF DEFINED Deploy_Password (FOR /F "delims=" %%I IN (%Deploy_Password%) DO SET Deploy_Password=%%I)

rem A full filesystem path to the sqlcmd.exe can be supplied, to deal with multiple SQL Server versions on one machine.
IF DEFINED Deploy_SqlCmdPath (FOR /F "delims=" %%I IN (%Deploy_SqlCmdPath%) DO SET Deploy_SqlCmdPath=%%I) ELSE (SET Deploy_SqlCmdPath=sqlcmd.exe)

echo Change working directory to the location of this script.
cd "%~dp0"

echo Create [Database].
REM controle op username/password of windows authentication
IF EXIST %Deploy_Username% (
    "%Deploy_SqlCmdPath%" -S %Deploy_Server% -d master -U "%Deploy_Username%" -P "%Deploy_Password%" -b -i "Database/Database.sql" -v Database=%Deploy_Database%
) ELSE (
    "%Deploy_SqlCmdPath%" -S "%Deploy_Server%" -d master -b -i "Database/Database.sql" -v Database=%Database%
)

echo Create [Schemas].
{0}

echo Create [Tables].
{1}

echo Recreate [Functions].
{2}

echo Recreate [Stored Procedures].
{3}

echo Deploy.cmd finished

goto :eof

:runCmd
echo executing file %1
REM controle op username/password of windows authentication
IF EXIST %Deploy_Username% (
    "%Deploy_SqlCmdPath%" -S "%Deploy_Server%" -d "%Deploy_Database%" -U "%Deploy_Username%" -P "%Deploy_Password%" -b -i %1
) ELSE (
    "%Deploy_SqlCmdPath%" -S "%Deploy_Server%" -d "%Deploy_Database%" -b -i %1
)

:eof