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


class Adder:
    def __init__(self, a, b):
        self.a = a
        self.b = b
        self.arr = [1, 2, 3, 4, 5, 6]
        self.result = 0

    def execute(self):
        self.result = self.a + self.b


adder = Adder(10, 16)
pdb.set_trace()
adder.execute()
print(adder.result)
