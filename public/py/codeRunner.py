from dataclasses import dataclass
import json
import sys


@dataclass
class CodeFile:
    content: str
    name: str
    path: str

def input_fixed(promt=''):
    print(promt)
    return sys.stdin.readline().strip()


class CodeEngine:
    mainFile: CodeFile
    projectFiles = []

    def __init__(self, mainFile, projectFiles) -> None:
        self.mainFile = mainFile
        self.projectFiles = projectFiles

    def run(self):
        for projectFile in self.projectFiles:
            with open(projectFile.path, 'w') as f:
                f.write(projectFile.content)
        try:
            input = input_fixed
            code = compile(self.mainFile.content, self.mainFile.name, 'exec')
            exec(code)
        except Exception as e:
            print(e)


def runCode(codeJson):
    code = json.loads(codeJson)
    mainFile = CodeFile(code["mainFile"]["content"],code["mainFile"]["name"], code["mainFile"]["path"])
    projectFiles = []
    for projectFile in code["projectFiles"]:
        projectFiles.append(CodeFile(projectFile["content"], projectFile["name"], projectFile["path"]))
    codeEngine = CodeEngine(mainFile, projectFiles)
    codeEngine.run()