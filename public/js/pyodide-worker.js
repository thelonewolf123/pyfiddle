let indexURL = "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/";
importScripts(indexURL + "pyodide.js");

self.inputValueBuffer = null;
self.inputFlagBuffer = null;

function removeNullBytes(str) {
    return str.split("").filter(char => char.codePointAt(0)).join("")
}

// function sleep(t) {
//     let _AB = new Int32Array(new SharedArrayBuffer(4));
//     Atomics.wait(_AB, 0, 0, Math.max(1, t | 0));
//     return;
// }

const stdinCallback = () => {
    postMessage({
        cmd: "stdin"
    });

    self.inputFlagBuffer[0] = 1;

    while (self.inputFlagBuffer[0] === 1) {
        Atomics.wait(self.inputFlagBuffer, 0, 1, 200);
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
        import sys
        import builtins

        def input_fixed(prompt=''):
            print(prompt)
            return sys.stdin.readline().strip()

        builtins.input = input_fixed

        async def init():
            fileArr = ["codeEngine.py", "debugger.py", "codeRunner.py", "syncFiles.py"]
            for fileName in fileArr:
                response = await pyfetch("/py/" + fileName)
                with open(fileName, "wb") as f:
                    f.write(await response.bytes())
        await init()
        `;
    await runCode(fetchCodeEngine);
}

const done = () => {
    postMessage({
        cmd: "done"
    });
}

const runCodeFromFileSysObj = async (files) => {
    let codeRunner = self.pyodide.pyimport("codeRunner");
    codeRunner.runCode(JSON.stringify(files));
}

const installPackage = async (packageName) => {
    try {
        let pyCode = `
import micropip
print("installing -> ", "${packageName}")
await micropip.install("${packageName}")
print("Package installed -> ", "${packageName}")
        `
        await self.pyodide.runPythonAsync(pyCode);
        postMessage({
            cmd: "packageInstallDone",
            packageName: packageName
        });
    } catch (err) {
        console.error(err);
        stderrCallback(`Installation failed -> ${packageName}`)
        postMessage({
            cmd: "errorPackageInstall",
            packageName: packageName
        });
    }
}

const runCode = async (code, callBack, errorCB) => {
    await self.pyodide.runPythonAsync(code).then(() => {
        if (callBack) callBack();
    }).catch((err) => {
        postMessage({
            cmd: "stderr",
            data: err
        });
        if (errorCB) errorCB();
    });
}

const syncFiles = async () => {
    const fileSyncService = self.pyodide.pyimport("syncFiles");
    const result = fileSyncService.getFileSystemContents();
    postMessage({
        cmd: "syncFiles",
        data: result
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
        runCodeFromFileSysObj(msg.data.files);
        runCode(msg.data.code, done, done);
    } else if (msg.data.cmd === "installPackage") {
        installPackage(msg.data.packageName).then(done);
    } else if (msg.data.cmd === "setInputBuffer") {
        self.inputFlagBuffer = msg.data.inputFlagBuffer
        self.inputValueBuffer = msg.data.inputValueBuffer
    } else if (msg.data.cmd === "syncFiles") {
        syncFiles()
    }
};