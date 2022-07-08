<template>
  <div class="loacl-variables">
    <v-treeview
      dark
      :items="transformedVariableList"
      expand-icon="mdi-chevron-down"
      activatable
      :active.sync="activeVarList"
    >
      <template v-slot:label="{ item }">
        <div class="variable-section">
          <div class="variable-name">{{ item.name }} :</div>
          <div class="variable-value">
            {{ item.value }}
          </div>
        </div>
      </template>
    </v-treeview>
  </div>
</template>


<script>
export default {
  props: ["localVariables", "includeSpecialVars"],
  watch: {
    localVariables: {
      handler(newVal) {
        if (!newVal) this.transformedVariableList = [];
        this.transformedVariableList = this.getVariableMap(newVal);
      },
      deep: true,
    },
  },

  data() {
    return {
      globalId: 0,
      activeVarList: [],
      transformedVariableList: [],
      variableTypes: [
        "function",
        "class",
        "module",
        "list",
        "dict",
        "str",
        "tuple",
        "int",
      ],
    };
  },
  methods: {
    getVariableMap(variable) {
      let result = [];
      if (!variable) return result;

      let vars = Object.keys(variable);

      if (!this.includeSpecialVars) {
        vars = vars.filter((v) => !v.startsWith("__"));
      }

      vars.forEach((v) => {
        let temp = {};
        temp["name"] = v;
        temp["value"] = variable[v].value;
        temp["id"] = ++this.globalId;
        if (variable[v].children)
          temp["children"] = this.getVariableMap(variable[v].children);
        result.push(temp);
      });
      return result;
    },
  },
};
</script>


<style lang="scss">
.variable-section {
  display: flex;
  cursor: pointer;
}

.variable-name {
  color: #ffd700;
  // width: 150px;
  padding-right: 25px;
}

.loacl-variables {
  overflow: scroll;

  .v-treeview-node__root {
    display: flex;
    align-items: center;
    /* height: 20px; */
    min-height: 30px;
    font-size: 14px;
    position: relative;
  }
}
</style>