import sys
import rlcompleter
import pdb
import json
import re


def pdbTest(globalVars):
    print("pdb")
    globalDict = {}
    for key in globalVars.keys():
        if("__" not in key and globalVars[key]):
            globalDict[key] = {}
            globalDict[key]['value'] = str(globalVars[key])
            globalDict[key]['children'] = {}
            for dirKey in dir(globalVars[key]):
                if("__" not in dirKey):
                    globalDict[key]['children'][dirKey] = str(
                        eval(f'globalVars[key].{dirKey}'))
    print(json.dumps(globalDict))
    # print(globals())


cod = 'dic'
try:
    class a:
        pass
except:
    pass
my_completer = rlcompleter.Completer()
phrase_list = ['co', 'sys.m', 'cal', 'a']
for phrase in phrase_list:
    print(phrase + ' (TAB): ', end='')
    try:
        for i in range(50):
            terms = my_completer.complete(phrase, i)
            if terms is None:
                break
            print(terms, end='\t')
    except:
        pass
    print()
    
# language server example => https://github.com/gatesn/pyodide/tree/75fc380311ee28d72a3bf670654f4770115268fa
