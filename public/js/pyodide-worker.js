let indexURL = "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/";
importScripts(indexURL + "pyodide.js");

self.inputValueBuffer = null;
self.inputFlagBuffer = null;

const stdinCallback = () => {
    postMessage({
        cmd: "stdin"
    });

    self.inputFlagBuffer[0] = 1;

    while (self.inputFlagBuffer[0] === 1) {
        Atomics.wait(self.inputFlagBuffer, 0, 0, 200);
        self.pyodide.checkInterrupt();
    }
    // convert shared memory to a string
    let input = String.fromCharCode.apply(null, new Uint8Array(self.inputValueBuffer));
    // send input to python
    return input;

}

function stdoutCallback(data) {
    postMessage({
        cmd: "stdout",
        data
    });
}

function stderrCallback(data) {
    postMessage({
        cmd: "stderr",
        data
    });
}

const initPyiodide = () => {
    loadPyodide({
        indexURL: indexURL,
        stdin: stdinCallback,
        stdout: stdoutCallback,
        stderr: stderrCallback
    }).then(pyodide => {
        self.pyodide = pyodide;
        postMessage({
            cmd: "ready"
        });
    })

}

onmessage = (msg) => {
    if (msg.data.cmd === "init") {
        initPyiodide();

    } else if (msg.data.cmd === "setInterruptBuffer") {
        self.pyodide.setInterruptBuffer(msg.data.interruptBuffer);

    } else if (msg.data.cmd === "runCode") {
        self.pyodide.runPythonAsync(msg.data.code).then(() => {
            postMessage({
                cmd: "done"
            });
        }).catch(err => {
            console.log(err);
            postMessage({
                cmd: "done"
            });
        });

    } else if (msg.data.cmd === "setInputBuffer") {
        self.inputFlagBuffer = msg.data.inputFlagBuffer
        self.inputValueBuffer = msg.data.inputValueBuffer
    }
};