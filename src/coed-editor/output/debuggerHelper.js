class DebuggerHelper {
    constructor() {
        this.lineNumber = null
        this.debugFileName = null
        this.variableMap = null
        this.debuggerState = -1
        this.commandArray = [
            'import debugger; debugger.getVariableMap(locals())',
            'pause'
        ]
        this.isDebuggerActive = false
    }

    resetDebugger() {
        this.lineNumber = null
        this.debugFileName = null
        this.variableMap = null
        this.debuggerState = -1
        this.isDebuggerActive = false
    }

    parsePdbOutPut(pdbOutput) {
        if (pdbOutput && pdbOutput.startsWith('>')) {
            this.lineNumberParser(pdbOutput)
            this.fileNameParser(pdbOutput)
        } else if (pdbOutput && pdbOutput.startsWith("(Pdb) {")) {
            this.variableMapParser(pdbOutput.split("(Pdb)")[1])
        } else if (pdbOutput === "debug-finished") {
            this.isDebuggerActive = false
        }
        console.log(pdbOutput)
    }

    setDebuggerActive(state) {
        this.isDebuggerActive = state
    }

    getDebuggerStatus() {
        return this.isDebuggerActive
    }
    getPdbCommand() {
        if (this.debuggerState !== 1) this.debuggerState++
        return this.commandArray[this.debuggerState]
    }

    lineNumberParser(pdbOutput) {
        let lineNumberPattern = /(?<=\()[0-9]*(?=\))/
        this.lineNumber = parseInt(lineNumberPattern.exec(pdbOutput)[0])
        console.log(this.lineNumber)
    }

    fileNameParser(pdbOutput) {
        let fileNameArr = pdbOutput.split('/')
        // this.fileName = fileNameArr[fileNameArr.length - 1].split(".py")[0] + ".py"
        console.log(this.fileName)
    }

    variableMapParser(variableMapString) {
        try {
            this.variableMap = JSON.parse(variableMapString)
            // this.isDebuggerActive = false
        } catch (err) {
            console.log(err)
        }
    }

    getLineNumber() {
        return this.lineNumber
    }

    getFileName() {
        return this.fileName
    }

    getVariableMap() {
        return this.variableMap
    }
}

export default DebuggerHelper;