const { notEmpty } = require("../utils.js");

module.exports = {
  description: "generate store",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "store name please",
      validate: notEmpty("name")
    },
    {
      type: "checkbox",
      name: "blocks",
      message: "Blocks:",
      choices: [
        {
          name: "api",
          value: "api",
          checked: false
        },
        {
          name: "state",
          value: "state",
          checked: true
        },
        {
          name: "getters",
          value: "getters",
          checked: true
        },
        {
          name: "mutations",
          value: "mutations",
          checked: true
        },
        {
          name: "actions",
          value: "actions",
          checked: true
        }
      ],
      validate(value) {
        if (!value.includes("state") || !value.includes("mutations")) {
          return "store require at least state and mutations";
        }
        return true;
      }
    }
  ],
  actions(data) {
    const name = "{{name}}";
    const { blocks } = data;
    const joinFlag = `,
  `;

    const actions = [
      {
        type: "add",
        path: `src/store/modules/${name}.js`,
        templateFile: "plop-templates/store/index.hbs",
        data: {
          options: blocks.filter(block => block != "api").join(joinFlag),
          name,
          api: blocks.includes("api"),
          state: blocks.includes("state"),
          getters: blocks.includes("getters"),
          actions: blocks.includes("actions"),
          mutations: blocks.includes("mutations")
        }
      }
    ];
    return actions;
  }
};
