<template>
    <div>
        <PythonIDEVue></PythonIDEVue>
    </div>
</template>

<script>
import PythonIDEVue from "@/coed-editor/PythonIDE.vue";

export default {
    components: {
        PythonIDEVue,
    },
    data() {
        return {
            editorHeight: "height: 100vh",
        };
    },
};
</script>