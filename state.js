
// Create a new `State` object 
// by specify a unique namespace
// and an object with default values
State = function(namespace, defaults) {
  var self = this;

  /* private */

  // Holding the fields of session variables
  // which are tracked in this state.
  var allFields = [];

  // Prevent from global name clashes.
  namespace = 'StatePackage_' + namespace + '_';
  
  // Store default values.
  this.defaults = _.clone(defaults);


  /* public methods */

  // Get from session variable.
  this.get = function(field) {
    return Session.get(namespace + field); 
  }

  // Set session variable.
  this.set = function(field, val) {
    allFields.push(field);
    Session.set(namespace + field, val); 
  }

  // Set default value in session variable.
  this.setDefault = function(field, val) {
    if (_.isUndefined(this.get(field)))
      this.set(field, val);
  }

  // Invert boolean value in session variable.
  this.toggle = function(field) {
    this.set(field, !this.get(field)); 
  }

  // Toggle a specific value, which is a combination of toggle and set.
  // Example: A navigation widget to switch between tabs. If user clicks
  // a tab it becomes activated. If user clicks the same tab again,
  // it will be closed.
  this.toggleValue = function(field, val) { 
    if (this.equals(field, val)) 
      // unset if current value equals this value
      this.set(field, false);
    else 
      // set value if current value not equals this value
      this.set(field, val);
  }
  
  // Get state object containing all fields. Additional specify 
  // the fields parameter to only return the fields of interest.
  this.getState = function(fields) {
    fields = fields || allFields;
    return _.object(fields, _.map(fields, get));
  }

  // Set multiple fields at once by specifying an object
  // with field-value pairs.
  this.setState = function(obj) {
    _.each(obj, function(val, field) { this.set(field, val); }, this);
  }

  // Same as setState, but only sets a field if it is undefined.
  this.setDefaultState = function(obj) {
    _.each(obj, function(val, field) { this.setDefault(field, val); }, this);
  }

  // Test equality of the session variable value and the given value.
  this.equals = function(field, val) {
    return Session.equals(namespace + field, val); 
  }

  // Observing a specific session variable for changes.
  // If the value changes your `func` will be called.
  // Additionally, `func` will be called on initialization,
  // except when you set `skipFirstRun` to true.
  this.observe = function(field, func, skipFirstRun) {
    var prevVal, newVal;
    return Tracker.autorun(function() {
      newVal = self.get(field);
      if (!skipFirstRun || !c.firstRun) {
        Tracker.nonreactive(function() {
          func(newVal, prevVal);
        });
      }
      prevVal = newVal;
    });
  }

  // Set default values on initialization.
  this.setDefaultState(defaults);
}
