import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)


const state = {
    fileSystem: [{
        name: "main.py",
        content: "print('hello from script')",
        file: "py",
    }],
    activeFile: "main.py",
    activeFileContent: "print('hello from script')",
    dependencies: [],
    currentUser: null,
    debuggerLineNumber: null,
    debuggerFileName: null
}

const getters = {
    getFileSystem: state => state.fileSystem,
    getActiveFile: state => state.activeFile,
    getActiveFileContent: state => {
        let file = state.fileSystem.find(f => f.name === state.activeFile)
        if (file) return file.content
        return ""
    },
    getDependencies: state => state.dependencies,
    getDebuggerLineNumber: state => state.debuggerLineNumber,
    currentUser: state => state.currentUser
}

const mutations = {
    setFileStorage: (state, payload) => {
        state.fileSystem = payload
    },
    setDependencies: (state, payload) => {
        state.dependencies = payload
    },
    addFileNewFile: (state, payload) => {
        state.fileSystem.push(payload)
        state.fileSystem = state.fileSystem.sort((a, b) => a.name.localeCompare(b.name))
    },
    removeFileNewFile: (state, payload) => {
        console.log("delete ", payload)
        state.fileSystem = state.fileSystem.filter(s => s.name !== payload.name)
    },
    setActiveFile: (state, payload) => {
        state.activeFile = payload
    },
    setActiveFileContent(state, payload) {
        let index = state.fileSystem.findIndex(f => f.name === state.activeFile)
        state.fileSystem[index].content = payload
    },
    setDebuggerLineNumber(state, payload) {
        state.debuggerLineNumber = payload
    },
    addDependency(state, payload) {
        let version = payload.version
        let packageName = payload.packageName
        let index = state.dependencies.findIndex(dep => dep.packageName === packageName)
        if (index !== -1) {
            if (state.dependencies[index].version === version) return
            state.dependencies.splice(index, 1);
        }

        state.dependencies.push({
            version: version,
            packageName: packageName
        })
    },
    removeDependency(state, payload) {
        let packageName = payload
        let index = state.dependencies.findIndex(dep => dep.packageName === packageName)
        if (index !== -1) {
            state.dependencies.splice(index, 1);
        }
    },
    updateCurrentUser(state, payload) {
        state.currentUser = payload
    }
}

const actions = {
    initFileSystem: ({
        commit
    }, fileSystem) => {
        commit('setFileStorage', fileSystem)
    },
    initPyDependency: ({
        commit
    }, dependencies) => {
        commit('setDependencies', dependencies)
    },
    addFile: ({
        commit
    }, file) => {
        commit('addFileNewFile', file)
    },
    removeFile: ({
        commit
    }, file) => {
        commit('removeFileNewFile', file)
    },
    changeActiveFileContent({
        commit
    }, content) {
        commit('setActiveFileContent', content)
    },
    changeActiveFile({
        commit
    }, fileName) {
        commit('setActiveFile', fileName)
    },
    changeDebugActiveLineNumber({
        commit
    }, lineNo) {
        commit('setDebuggerLineNumber', lineNo)
    },
    addPyDependency({
        commit
    }, payload) {
        commit('addDependency', payload)
    },
    removePyDependency({
        commit
    }, payload) {
        commit('removeDependency', payload)
    },
    updateCurrentUser({
        commit
    }, payload) {
        commit('updateCurrentUser', payload)
    }
}

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state,
    getters,
    mutations,
    actions
})