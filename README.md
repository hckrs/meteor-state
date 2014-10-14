# State

Organizing session variables in a better way.

## Why using State?

Although session variables are very handy, at some point you have to many of them, and you don't remember their names.
Also organizing them in such a way that you don't create duplicate names isn't always easy to do.

State is helping organize this. Instead of creating individual session variables you will group them together in a state object.
Modifying the state is then very easy. Additional we provide extra features which aren't available for session variables.

## How it works

You create a state object by providing field names for each piece of information you like to store.
The underlying mechanism wraps every key-value pair of this object in a individual session variable.
You don't have to handle the uniqueness naming yourself.

## Using State

We will provide some examples of how to use this.

### Creating a state object

Create a state object by creating a new instance of the `State` object.
Give this state a unique name and provide fields for the state you like to store together with their default values.

```javascript
var state = new State('hackersPage', {  // unique name of this state object
  sort: null,         // sorting order, used to sort table of hackers
  selectedDoc: null,  // the selected hacker in the table of hackers
  visible: false,     // flag indicated if hackers table is visible
});
``` 

Now we have created a state object holding information about how the table of hackers will be sorted and which entry we have selected.

### Getters / setters

Because modifying state is always be done by calling `get` and `set` functions, it will be always clear where state maniuplations are located in your code.

```javascript
// setting state field
state.set('sort', -1);

// getting state field
var sort = state.get('sort');

// use case example
var doc = Hackers.findOne({}, {sort: {id: state.get('sort')}});
state.set('selectedDoc', doc);
```

You can also set multiple values at once:

```javascript
// setting multiple state fields
state.setState({sort: -1, visible: true});

// getting all state fields
var s = state.getState();  
console.log(s); // => {sort: -1, visible: true, selectedDoc: {id: 23, name: "Jarno", ...}}

// if you like to retrieve a subset of fields
var s = state.getState(['sort', 'visible']);  
console.log(s); // => {sort: -1, visible: true}
```

Additional there is `setDefault(..)` and `setDefaultState(..)` corresponding to the `Session.setDefault(..)` counter part.

### Equality test

Test for equality in the same way as we did with `Session.equals`

```javascript
var newSort = state.equals('sort', -1) ? 1 : -1;
state.set('sort', newSort);
```


### Toggle

Some additional features are available.

```javascript
// invert boolean; if visible is true it becomes false, if it is false it becomes true
state.toggle('visible');  

// activate a value or deactivate if already setted
state.toggleValue('activeView', 'table')  // activate 'table' view mode
state.toggleValue('activeView', 'list')   // activate 'list' view mode
state.toggleValue('activeView', 'list')   // deactivate 'list' mode because it was already active
```

Example where `toggleValue` can be useful is a navigation widget which allows to switch between tabs. 
If user clicks a tab it becomes activated. If user clicks the same tab again it will be closed.

### Observing state

With observe we can track state modification. You can provide a callback function that will be called when your state field changes.

```javascript
state.observe('visible', function(newValue, previousValue) {
  console.log('Visibility changed from', previousValue, 'to', newValue);
});
```

Your callback will be also called directly after calling `state.observe`. If you don't like that behaviour you can pass `true` as third argument to `state.observe` which means it will skip the initial call to your callback.

## Why not use ReactiveVar?

Meteor also provides a package called [ReactiveVar][RV] that allows you to create local state. In that case you also don't have to deal with session variable names that are all defined in the global namespace. It is important to notice that ReactiveVar is slightly different from session variables as discussed in [Meteor's documentation][RV]. Because of the reasons given there, you can decide wheter this State package could be useful for you.



[RV]: http://docs.meteor.com/#reactivevar


