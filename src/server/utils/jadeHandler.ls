path = require('path')

template (templatePath, templateName) ->
  templatePath = require.resolve
    <| path.join do
      templatePath
      templateName + \.jade
  templateFn = require(\jade).compileFile(templatePath);


exports.template = _template;
