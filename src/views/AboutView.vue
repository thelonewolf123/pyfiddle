<template>
  <div class="about">
    <h1 id="pyfiddle---stackblitz-for-python">
      PyFiddle - Stackblitz for Python
    </h1>
    <p>
      PyFiddle (<a href="https://pyfiddle.vercel.app/compiler"
        >https://pyfiddle.vercel.app/compiler</a
      >) is a python equivalent for JsFiddle. It has a dependency management
      system just like codesandbox so people can work on complex projects and it
      also has a built-in debugger, so it can be highly useful for competitive
      coding and other coding tasks that require code flow analysis.
    </p>
    <h2 id="tech-stack">Tech stack:</h2>
    <ul>
      <li>Vue.Js and Javascript for frontend.</li>
      <li>Pyodide to run python code in the browser.</li>
      <li>Monaco editor as a code editor.</li>
    </ul>
    <h3 id="why-did-i-pick-vuejs-for-frontend">
      Why did I pick Vue.Js for frontend?
    </h3>
    <p>
      I’m proficient with Vue.Js so I decided to pick Vue.Js. I’m passionate
      about meta-programming, and I want to build the best tools available out
      there for beginner programmers so this python playground is my take on
      that.
    </p>
    <h3
      id="why-use-pyodide-instead-of-docker-to-run-python-code-on-the-backend"
    >
      Why use pyodide instead of docker to run python code on the backend?
    </h3>
    <p>
      I want this playground should be capable of running complex real-time
      simulations and interactive graphs, also since I’m a solo developer and
      have no backup for funds, I want this project should be scalable without
      spending too much. Running everything on the client solves so many issues
      with implementing an active debugger like setting up a WebSocket channel
      to send the local variables to frontend. I’m also working on Intellisense
      with pyodide to improve the programmer experience.
    </p>
    <h3 id="why-monaco-editor-for-code-editor">
      Why monaco editor for code editor?
    </h3>
    <p>
      I know there are other great options for code editors, but I picked monaco
      because It’s the same editor used in VS code, so in the future, if I’m
      going to expand the IDE functions, I needed the stack should be flexible
      and have enough support for whatever crazy idea I may come up with, so I
      picked monaco as a code editor, If it has enough functionality to support
      vs code, I’m positive It can support my ideas as well.
    </p>
    <h2 id="development-journey">Development journey</h2>
    <h3 id="initial-stage">Initial stage:</h3>
    <p>
      I was started with a basic vue app and added vuetify for material design.
      created a layout for the IDE, and I was experimenting with colors to give
      a good look for IDE, but unfortunately, I’m not very good with colors so I
      decided to use 5 shades of black as theme for my IDE.
    </p>
    <h3 id="stage-2---file-system">Stage 2 - file system:</h3>
    <p>
      I needed a way to store the files and organize them and a file tree UI for
      user operations. My first thoughts were to use memfs or browserfs, but
      rendering and storing will be hard with virtual FS so I decided to use a
      JSON-based file system and used vue store as a source of truth.
    </p>
    <h3 id="stage-3---code-engine">Stage 3 - code engine:</h3>
    <p>
      As I mentioned before I used pyodide for code execution, It wasn’t a
      straight pick. I looked for all the options, other choices, brython, and
      skulpt. But other options don’t have a way to install packages or
      debugging capabilities. So I was end up using pyodide. I have experimented
      with both running pyodide on UI thread and web worker, when I run pyodide
      in UI thread it thas access to all the DOM API so users and build
      interactive apps but I can’t implement any debugging capabilities because
      to implement debugging sync I/O is mandatory. So I used web worker to run
      the code. Each web worker acts as an isolated environment so it’ll be
      useful to implement virtual environment.
    </p>
    <h3 id="stage-4---debugger">Stage 4 - debugger:</h3>
    <p>
      I used PDB module to implement the debugger. Since I was taken care of
      most of the complex tasks in previous stages, implementing a debugger is
      relatively easy. I wrote a parser to parse the pdb output and a simple
      debugger script in python to parse the local variables and some UI
      implementation for pdb commands.
    </p>
    <h3 id="test-code">Test code:</h3>
    <ul>
      <li>Use the below code to test the debugger.</li>
    </ul>
    <pre><code class="language-py"># main.py

class Adder:
    def __init__(self):
        self.a = 4
        self.a = 5
        
    def execute(self,b):
        return self.a + b
        
adder = Adder()
b = adder.execute(7)
breakpoint()
a = input(&quot;Enter a number : &quot;)
breakpoint()
print(&quot;A number: &quot;, a)
print(f&#39;Result -&gt; {b}&#39;)
</code></pre>
    <h3 id="ps">PS:</h3>
    <ul>
      <li>
        The project is nowhere near completion so there might be some bugs or
        incomplete features, and I’m building it in my spare time.
      </li>
      <li>
        If anyone wanna use the debugger in pyfiddle, use breakpoint() function
        to set the breakpoint and run it with the debugger.
      </li>
    </ul>
  </div>
</template>
