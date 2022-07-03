import json

def getVariableMap(globalVars):
    globalDict = {}
    blackListedVars = ['code', 'self',
                        'getVariableMap', 'pdb', 'projectFile', 'input']
    for key in globalVars.keys():
        if("__" not in key and key not in blackListedVars and globalVars[key]):
            globalDict[key] = {}
            globalDict[key]['value'] = str(globalVars[key])
            globalDict[key]['children'] = {}
            for dirKey in dir(globalVars[key]):
                if("__" not in dirKey):
                    globalDict[key]['children'][dirKey] = {}
                    globalDict[key]['children'][dirKey]['value'] = str(eval(f'globalVars[key].{dirKey}'))
    print(json.dumps(globalDict))

# language server example => https://github.com/gatesn/pyodide/tree/75fc380311ee28d72a3bf670654f4770115268fa
