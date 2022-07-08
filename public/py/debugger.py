import json


def fetchVariableMap(variableMap, level):
    if level <= 0:
        return
    elif type(variableMap) is str or type(variableMap) is int or type(variableMap) is float or variableMap is None or type(variableMap) is bool:
        return {"value": variableMap}
    elif type(variableMap) is list or type(variableMap) is tuple:
        resultMap = {}
        for k, v in enumerate(variableMap):
            resultMap[k] = {}
            resultMap[k]["value"] = v
        return resultMap

    resultMap = {}
    interator = []

    if type(variableMap) is dict:
        interator = variableMap.keys()
    else:
        interator = dir(variableMap)

    for key in interator:
        resultMap[key] = {}
        value = None
        if '__' not in key:
            if type(variableMap) is dict:
                resultMap[key]['value'] = str(variableMap[key])
                value = variableMap[key]
            else:
                try:
                    resultMap[key]['value'] = str(eval(f'variableMap.{key}'))
                    value = eval(f'variableMap.{key}')
                except:
                    pass
        if value is not None:
            resultMap[key]['children'] = fetchVariableMap(value, level-1)
    return resultMap


def getVariableMap(globalVars):
    res = fetchVariableMap(globalVars, 2)
    print(f"<<{json.dumps(res)}")
    print("debug-finished")
# import debugger; debugger.getVariableMap(locals())
