import os
import json
engine_files = ['codeEngine.py', 'debugger.py',
                'codeRunner.py', 'syncFiles.py']

if not os.path.exists('test'):
    os.mkdir('test')

f = open('test/write.ts', 'w')
f.write('hello, world')
f.close()

file_data_map = {}


def fetchAllFiles(path, depth):

    if depth > 2:
        return

    for fileOrFolder in os.listdir(path):
        if os.path.isdir(fileOrFolder):
            # print('folder -> ', f'{path}/{fileOrFolder}')
            fetchAllFiles(f'{path}/{fileOrFolder}', depth + 1)
        else:
            # print('file -> ', f'{path}/{fileOrFolder}')
            if fileOrFolder in engine_files:
                continue
            with open(f'{path}/{fileOrFolder}', 'r') as f:
                out = ''.join(f.readlines())
                file_data_map[f'{path}/{fileOrFolder}'] = out


def getFileSystemContents():
    fetchAllFiles('.', 0)
    return json.dumps(file_data_map)
