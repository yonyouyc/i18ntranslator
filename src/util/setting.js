var ignoreDirectory = []
var extensionName = ['.js', '.vue']
var extensionTemplateName = ['.html']
var settings = {
  extensionName: extensionName,
  extensionTemplateName: extensionTemplateName,
  setExtensionName: function (array) {
    extensionName = array
  },
  setExtensionTemplateName: function (array) {
    extensionTemplateName = array
  },
  getIgnoreDirectory: function () {
    return ignoreDirectory
  },
  setIgnoreDirectory: function (array) {
    ignoreDirectory = array
  }
}
module.exports = settings