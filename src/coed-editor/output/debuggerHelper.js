class DebuggerHelper {
    constructor() {
        this.lineNumber = null
        this.debugFileName = null
        this.variableMap = null
        this.debuggerState = 0
    }

    resetDebugger() {
        this.lineNumber = null
        this.debugFileName = null
        this.variableMap = null
        this.debuggerState = 0
    }

    parsePdbOutPut(pdbOutput) {
        if (pdbOutput && pdbOutput.startsWith('>')) {
            this.lineNumberParser(pdbOutput)
            this.fileNameParser(pdbOutput)
        }
    }

    isDebuggerActive() {
        return false;
    }

    lineNumberParser(pdbOutput) {
        let lineNumberStr = pdbOutput.split("/")
        console.log(lineNumberStr)
    }

    fileNameParser(pdbOutput) {
        let fileNameStr = pdbOutput.split("/")
        console.log(fileNameStr)
    }
}

export default DebuggerHelper;