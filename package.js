Package.describe({
  summary: "Group related session variables in a single state object",
  version: "0.1.0",
  git: "https://github.com/hckrs/meteor-state.git"
});

Package.onUse(function(api) {
  api.use('underscore@1.0.0', 'client');
  api.use('session@1.0.0', 'client');
  api.use('tracker@1.0.2', 'client');

  api.addFiles('state.js', 'client');
  
  api.export("State", 'client');
});
