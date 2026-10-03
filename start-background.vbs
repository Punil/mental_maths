Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Set working directory to this script's folder
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = scriptDir

' Launch server completely hidden in the background (0 = hide window, False = don't wait)
WshShell.Run "cmd /c node server/index.js", 0, False

WScript.Echo "Mental Maths Server is now running silently in the background!" & vbCrLf & _
             "Access it from your tablet at:" & vbCrLf & _
             "http://192.168.32.8:3000"
