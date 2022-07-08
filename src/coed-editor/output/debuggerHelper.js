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
        } else if (pdbOutput && pdbOutput.startsWith("<<")) {
            this.variableMapParser(pdbOutput.substring(2))
        } else if (pdbOutput === "debug-finished") {
            this.isDebuggerActive = false
        } else {
            console.log(pdbOutput)
        }
    }

    setDebuggerActive(state) {
        this.isDebuggerActive = state
    }

    getDebuggerStatus() {
        return this.isDebuggerActive
    }
    getPdbCommand() {
        this.debuggerState++
        return this.commandArray[this.debuggerState % 2]
    }

    lineNumberParser(pdbOutput) {
        let lineNumberPattern = /(?<=\()[0-9]*(?=\))/
        this.lineNumber = parseInt(lineNumberPattern.exec(pdbOutput)[0])
        console.log(this.lineNumber)
    }

    fileNameParser(pdbOutput) {
        if (pdbOutput && pdbOutput.startsWith("> <exec>")) {
            this.fileName = "<executedMainFile>"
            return
        }
        let fileNameArr = pdbOutput.split('/')
        this.fileName = fileNameArr[fileNameArr.length - 1].split(".py")[0] + ".py"
        console.log(this.fileName, pdbOutput)
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