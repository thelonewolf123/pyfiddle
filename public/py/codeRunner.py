from dataclasses import dataclass
import json


@dataclass
class CodeFile:
    content: str
    name: str
    path: str


class CodeEngine:
    mainFile: CodeFile
    projectFiles = []

    def __init__(self, projectFiles) -> None:
        self.projectFiles = projectFiles

    def run(self):
        for projectFile in self.projectFiles:
            with open(projectFile.path, 'w') as f:
                f.write(projectFile.content)


def runCode(codeJson):
    code = json.loads(codeJson)
    projectFiles = []
    for projectFile in code["projectFiles"]:
        projectFiles.append(CodeFile(projectFile["content"], projectFile["name"], projectFile["path"]))
    codeEngine = CodeEngine(projectFiles)
    codeEngine.run()
