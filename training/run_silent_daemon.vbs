' Silent background runner for CodeCraft Continuous Trainer (No CMD window)
Set WshShell = CreateObject("WScript.Shell")
strPath = WScript.ScriptFullName
Set FSO = CreateObject("Scripting.FileSystemObject")
Set Folder = FSO.GetFile(strPath).ParentFolder
Set RootFolder = Folder.ParentFolder

' Run python in background without showing any console window
WshShell.Run "python """ & Folder.Path & "\continuous_trainer.py"" --batch-lines 1000000 --delay 60", 0, False
