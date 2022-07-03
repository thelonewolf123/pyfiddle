
import contextlib as __stickytape_contextlib
from dataclasses import dataclass
from inspect import stack
import json
import sys


@dataclass
class CodeFile:
    content: str
    name: str
    path: str


@__stickytape_contextlib.contextmanager
def stickytape_temporary_dir():
    import tempfile
    import shutil
    dir_path = tempfile.mkdtemp()
    try:
        yield dir_path
    finally:
        shutil.rmtree(dir_path)


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
        with stickytape_temporary_dir() as __stickytape_working_dir:
            def __stickytape_write_module(path, contents):
                import os
                import os.path

                def make_package(path):
                    parts = path.split('/')
                    partial_path = __stickytape_working_dir
                    for part in parts:
                        partial_path = os.path.join(partial_path, part)
                        if not os.path.exists(partial_path):
                            os.mkdir(partial_path)
                            open(os.path.join(partial_path,
                                 '__init__.py'), 'w').write('')

                make_package(os.path.dirname(path))

                full_path = os.path.join(__stickytape_working_dir, path)
                with open(full_path, 'w') as module_file:
                    module_file.write(contents)

            import sys as __stickytape_sys
            __stickytape_sys.path.insert(0, __stickytape_working_dir)

            for projectFile in self.projectFiles:
                __stickytape_write_module(
                    projectFile.path, projectFile.content)
            try:
                input = input_fixed
                code = compile(self.mainFile.content,
                               self.mainFile.name, 'exec')
                exec(code)
            except Exception as e:
                print(e)
                print(stack())


def runCode(codeJson):
    code = json.loads(codeJson)
    mainFile = CodeFile(code["mainFile"]["content"],
                        code["mainFile"]["name"], code["mainFile"]["path"])
    projectFiles = []
    for projectFile in code["projectFiles"]:
        projectFiles.append(
            CodeFile(projectFile["content"], projectFile["name"], projectFile["path"]))
    codeEngine = CodeEngine(mainFile, projectFiles)
    codeEngine.run()
