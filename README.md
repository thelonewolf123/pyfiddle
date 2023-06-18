# PyFiddle - JsFiddle for Python

[PyFiddle](https://pyfiddle.vercel.app/compiler) is a python equivalent for JsFiddle. It has a dependency management system just like codesandbox so people can work on complex projects and it also has a built-in debugger, so it can be highly useful for competitive coding and other coding tasks that require code flow analysis.

## Tech stack:

-   Vue.Js and Javascript for frontend.
-   Pyodide to run python code in the browser.
-   Monaco editor as a code editor.

### Why did I pick Vue.Js for frontend?

I’m proficient with Vue.Js so I decided to pick Vue.Js. I’m passionate about meta-programming, and I want to build the best tools available out there for beginner programmers so this python playground is my take on that.

### Why use pyodide instead of docker to run python code on the backend?

I want this playground should be capable of running complex real-time simulations and interactive graphs, also since I’m a solo developer and have no backup for funds, I want this project should be scalable without spending too much. Running everything on the client solves so many issues with implementing an active debugger like setting up a WebSocket channel to send the local variables to frontend. I’m also working on Intellisense with pyodide to improve the programmer experience.

### Why monaco editor for code editor?

I know there are other great options for code editors, but I picked monaco because It’s the same editor used in VS code, so in the future, if I’m going to expand the IDE functions, I needed the stack should be flexible and have enough support for whatever crazy idea I may come up with, so I picked monaco as a code editor, If it has enough functionality to support vs code, I’m positive It can support my ideas as well.

## Development journey

### Initial stage:

I was started with a basic vue app and added vuetify for material design. created a layout for the IDE, and I was experimenting with colors to give a good look for IDE, but unfortunately, I’m not very good with colors so I decided to use 5 shades of black as theme for my IDE.

### Stage 2 - file system:

I needed a way to store the files and organize them and a file tree UI for user operations. My first thoughts were to use memfs or browserfs, but rendering and storing will be hard with virtual FS so I decided to use a JSON-based file system and used vue store as a source of truth.

### Stage 3 - code engine:

As I mentioned before I used pyodide for code execution, It wasn’t a straight pick. I looked for all the options, other choices, brython, and skulpt. But other options don’t have a way to install packages or debugging capabilities. So I was end up using pyodide. I have experimented with both running pyodide on UI thread and web worker, when I run pyodide in UI thread it thas access to all the DOM API so users and build interactive apps but I can’t implement any debugging capabilities because to implement debugging sync I/O is mandatory. So I used web worker to run the code. Each web worker acts as an isolated environment so it’ll be useful to implement virtual environment.

### Stage 4 - debugger:

I used PDB module to implement the debugger. Since I was taken care of most of the complex tasks in previous stages, implementing a debugger is relatively easy. I wrote a parser to parse the pdb output and a simple debugger script in python to parse the local variables and some UI implementation for pdb commands.

### Test code:

-   Use the below code to test the debugger.

```py
# main.py

class Adder:
    def __init__(self):
        self.a = 4
        self.a = 5

    def execute(self,b):
        return self.a + b

adder = Adder()
b = adder.execute(7)
breakpoint()
a = input("Enter a number : ")
breakpoint()
print("A number: ", a)
print(f'Result -> {b}')

```

### PS:

-   The project is nowhere near completion so there might be some bugs or incomplete features, and I’m building it in my spare time.
-   If anyone wanna use the debugger in pyfiddle, use breakpoint() function to set the breakpoint and run it with the debugger.
