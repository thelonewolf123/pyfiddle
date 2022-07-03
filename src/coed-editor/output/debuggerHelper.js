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
        let lineNumberPattern = /(?<=\()[0-9]*(?=\))/
        this.lineNumber = parseInt(lineNumberPattern.exec(pdbOutput)[0])
        console.log(this.lineNumber)
    }

    fileNameParser(pdbOutput) {
        let fileNameArr = pdbOutput.split('/')
        this.fileName = fileNameArr[fileNameArr.length - 1].split(".py")[0] + ".py"
        console.log(this.fileName)
    }

    getLineNumber(){
        return this.lineNumber
    }

    getFileName(){
        return this.fileName
    }
}

export default DebuggerHelper;