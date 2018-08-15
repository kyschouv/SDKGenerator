setlocal
set repoName=UnrealMarketplacePlugin
set destPath=..\sdks\%repoName%
pushd ..\%destPath%
del /S *.h
del /S *.cpp
del /S *.cs
popd

cd %~dp0
pushd ..
if [%1] == [] (
rem === BUILDING UnrealCppSdk ===
node generate.js %repoName%=%destPath% -apiSpecGitUrl -flags nonnullable
) else (
rem === BUILDING UnrealCppSdk with params %* ===
node generate.js %repoName%=%destPath% %*
)
popd

pause
endlocal
