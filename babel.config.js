module.exports = {
  presets: [
    ['@vue/app', {
      // corejs: 2,
      useBuiltIns: 'entry'
    }]
  ],
  "plugins": [
    ["import", {
      "libraryName": "iview",
      "libraryDirectory": "src/components"
    }, "iview"]
  ]
}

