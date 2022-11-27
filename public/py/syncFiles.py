import os
import json
engine_files = ['codeEngine.py', 'debugger.py',
                'codeRunner.py', 'syncFiles.py']


def traverseFs(path, depth):
    result = []
    if depth > 2:
        return result

    for fileOrFolder in os.listdir(path):
        if os.path.isdir(fileOrFolder):
            result.append({'name': fileOrFolder, 'children': traverseFs(
                f'{path}/{fileOrFolder}', depth + 1)})
        elif fileOrFolder not in engine_files:
            with open(f'{path}/{fileOrFolder}', 'r') as f:
                out = ''.join(f.readlines())
                result.append({'name': fileOrFolder, 'content': out,
                              'file': fileOrFolder.split('.').pop()})

    return result


def getFileSystemContents():
    data = traverseFs('.', 0)
    return json.dumps(data)
