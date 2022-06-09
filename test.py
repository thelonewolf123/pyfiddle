import pdb

class Adder:
    def __init__(self, a,b):
        self.a = a
        self.b = b
        self.result = 0
        pdb.set_trace()
    def execute(self):
        self.result = self.a + self.b

adder = Adder(10, 16)
pdb.set_trace()
adder.execute()
print(adder.result)