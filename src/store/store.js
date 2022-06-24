import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)



const state = {
    fileSystem: [{
        name: "main.py",
        content: "print('hello from script')",
        file: "py",
    }, ],
    activeFile: "main.py",
    activeFileContent: "",
    openedFiles: ["main.py", ],
}

const getters = {
    getFileSystem: state => state.fileSystem,
    getActiveFile: state => state.activeFile,
    getActiveFileContent: state => {
        let file = state.fileSystem.find(f => f.name === state.activeFile)
        if (file) return file.content
        return ""
    }
}

const mutations = {
    setFileStorage: (state, payload) => {
        state.fileSystem = payload
    },
    addFileNewFile: (state, payload) => {
        state.fileSystem.push(payload)
    },
    setActiveFile: (state, payload) => {
        state.activeFile = payload
    },
    setActiveFileContent(state, payload) {
        let index = state.fileSystem.findIndex(f => f.name === state.activeFile)
        state.fileSystem[index].content = payload
    }
}

const actions = {
    initFileSystem: ({
        commit
    }, fileSystem) => {
        commit('setFileStorage', fileSystem)
    },
    addFile: ({
        commit
    }, file) => {
        commit('addFileNewFile', file)
    },
    changeActiveFileContent({
        commit
    }, content) {
        commit('setActiveFileContent', content)
        window.localStorage.setItem('fileSystem', JSON.stringify(state.fileSystem))
    },
    changeActiveFile({
        commit
    }, fileName) {
        commit('setActiveFile', fileName)
    }
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})