echo off

echo Deploy.cmd started.

REM Zorg ervoor dat alle parameters omgeven zijn met dubbele quotes.

set Deploy_Server="%~1"
echo Deploy_Server=%Deploy_Server%

set Deploy_Database="%~2"
echo Deploy_Database=%Deploy_Database%

set Deploy_SqlCmdPath="%~3"
echo Deploy_SqlCmdPath=%Deploy_SqlCmdPath%

set Deploy_Username="%~4"
echo Deploy_Username=%Deploy_Username%

set Deploy_Password="%~5"
echo Deploy_Password=%Deploy_Password%

echo Change working directory to the location of this script.
cd "%~dp0"

echo Create [Database].
REM sqlcmd.exe op de correcte manier aanroepen voor SQL of windows authentication.
IF [%Deploy_Username%]==[""]  (
	REM Windows Authenticatie:
	echo %Deploy_SqlCmdPath% -S %Deploy_Server% -d master -b -i "Database/Database.sql" -v Database=%Deploy_Database%
	%Deploy_SqlCmdPath% -S %Deploy_Server% -d master -b -i "Database/Database.sql" -v Database=%Deploy_Database%
) ELSE ( 
	REM SQL authenticatie:
	echo %Deploy_SqlCmdPath% -S %Deploy_Server% -d master -U %Deploy_Username% -P %Deploy_Password% -b -i "Database/Database.sql" -v Database=%Deploy_Database%
	%Deploy_SqlCmdPath% -S %Deploy_Server% -d master -U %Deploy_Username% -P %Deploy_Password% -b -i "Database/Database.sql" -v Database=%Deploy_Database%
)

echo Create [Schemas].
{0}

echo Create [Tables].
{1}

echo Recreate [Functions].
{2}

echo Recreate [Stored Procedures].
{3}

echo Recreate [Views].
{4}

echo Deploy.cmd finished

goto :eof

:runCmd

REM sqlcmd.exe op de correcte manier aanroepen voor SQL of windows authentication.
IF [%Deploy_Username%]==[""]  (
	REM Windows Authenticatie:
	echo %Deploy_SqlCmdPath% -S %Deploy_Server% -d %Deploy_Database% -b -i %1
	%Deploy_SqlCmdPath% -S %Deploy_Server% -d %Deploy_Database% -b -i %1
) ELSE ( 
	REM SQL authenticatie:
	echo %Deploy_SqlCmdPath% -S %Deploy_Server% -d %Deploy_Database% -U %Deploy_Username% -P %Deploy_Password% -b -i %1
	%Deploy_SqlCmdPath% -S %Deploy_Server% -d %Deploy_Database% -U %Deploy_Username% -P %Deploy_Password% -b -i %1
)

:eof