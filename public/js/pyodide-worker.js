let indexURL = "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/";
importScripts(indexURL + "pyodide.js");

self.inputValueBuffer = null;
self.inputFlagBuffer = null;

function removeNullBytes(str) {
    return str.split("").filter(char => char.codePointAt(0)).join("")
}


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
    let input = removeNullBytes(String.fromCharCode.apply(null, new Uint8Array(self.inputValueBuffer)));
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

const initPyiodide = async () => {
    let pyodide = await loadPyodide({
        indexURL: indexURL,
        stdin: stdinCallback,
        stdout: stdoutCallback,
        stderr: stderrCallback
    })
    self.pyodide = pyodide;
    await self.pyodide.loadPackage(["micropip"]);
    let fetchCodeEngine = `
        from pyodide.http import pyfetch
        fileArr = ["codeEngine.py", "debugger.py", "codeRunner.py"]
        for fileName in fileArr:
            response = await pyfetch("/py/" + fileName)
            with open(fileName, "wb") as f:
                f.write(await response.bytes())
        `;
    await runCode(fetchCodeEngine);
}

const doneFunc = () => {
    postMessage({
        cmd: "done"
    });
}

const runCodeFromFileSysObj = async (files) => {
    codeEngine = self.pyodide.pyimport("codeRunner");
    codeEngine.runCode(JSON.stringify(files));
    doneFunc();
}

const installPackage = async (packageName) => {
    await self.pyodide.loadPackage([packageName]);
}

const runCode = async (code, callBack, errorCB) => {
    await self.pyodide.runPythonAsync(code).then(() => {
        if (callBack) callBack();
    }).catch((err) => {
        console.error(err)
        if (errorCB) errorCB();
    });
}

onmessage = (msg) => {
    if (msg.data.cmd === "init") {
        initPyiodide().then(() => {
            postMessage({
                cmd: "ready"
            });
        });
    } else if (msg.data.cmd === "setInterruptBuffer") {
        self.pyodide.setInterruptBuffer(msg.data.interruptBuffer);

    } else if (msg.data.cmd === "runCode") {
        if (msg.data.files)
            runCodeFromFileSysObj(msg.data.files);
        else
            runCode(msg.data.code, doneFunc, doneFunc);
    } else if (msg.data.cmd === "installPackage") {
        installPackage(msg.data.packageName).then(doneFunc);
    } else if (msg.data.cmd === "setInputBuffer") {
        self.inputFlagBuffer = msg.data.inputFlagBuffer
        self.inputValueBuffer = msg.data.inputValueBuffer
    }
};