import {
    Execution,
    initializePyodide
} from "./pyodide-main.js";
let value = null;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function stdinCallback() {
    setTimeout(() => {
        value = 'continue';
    }, 10000);
    while (value === null) {
        await timeout(1000);
    }
    return 'continue';
}

async function stdoutCallback(data) {
    console.log(data);
}

async function stderrCallback(data) {
    console.log(data);
}

async function initialize() {
    await initializePyodide();
}

async function runPythonCode(code) {
    const execution = await new Execution(code);
    await execution.onStdin(stdinCallback);
    await execution.onStdout(stdoutCallback);
    await execution.onStderr(stderrCallback);
    execution.start();
    try {
        await execution.validate_syntax();
    } catch (e) {
        term.error(e.message);
        return;
    }
}

export {
    initialize,
    runPythonCode
};