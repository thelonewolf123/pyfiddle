class PyodideInterpreter {

    constructor() {
        this.pyodideWorker = new Worker("/js/pyodide-worker.js")
        this.debugLine = null
        this.inputValue = null
    }

    on(eventName, callback) {
        console.log(eventName, callback)
    }
}

export default PyodideInterpreter