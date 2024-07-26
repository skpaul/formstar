# FormStar (v1.0.0)

A JQuery plugin for quickly build, validate and submit an html form.

## Installation

------

Prerequisite: JQuery, moment.js and sweetModal.js

```javascript
$('#form-one').formstar({ajax:false});  //submitted without JQuery AJAX.

$('#form-two').formstar();  //submitted using JQuery AJAX.
```



## Configuration Options

------

ajax : true/false. Default is true.

validationRules: function,

beforeSend: function

additionalBeforeSend: function

success: function,

error: function,

complete: function,

reset: true/false. Default is true.



## Submit Button

------

```html
//A simple button
<button type="submit">Submit</button>

//Or, more styling approach
<button type="submit">
	<span class="buttonText">Submit</span>
    <span class="buttonIcon">icon-name</span>
</button>

//NOTE: no element can have the reserved word "submit" as ID or NAME in the form.
```



## Form Validation

------

The validating input element must have `class="validate"`

```html
<div class="field">
    <label>Name</label>
	<input type="text" class="validate">
</div>

//if the input does not have any label, then input must have "data-title" attribute.
<input type="text" class="validate" data-title="Student Name">

//if .field element has .hidden, it will not be validated
<div class="field hidden">
    <label>Name</label>
	<input type="text" class="validate">
</div>
```

### Required/Optional

if data-required attribute is absent, the element becomes optional.

```html
<input type="text" class="validate" data-required="required">
//or
<input type="text" class="validate">
```

### Data type validation

```html
<input type="text" class="validate" data-datatype="integer">
```

Available data types-

- letters : only a-z and A-Z allowed.
- email : any valid email
- mobile : valid mobile number (only bangladeshi ) 
- integer : only integer value
- float
- double
- decimal
- date : dd-mm-yyyy

### Minimum length validation

```html
<input type="text" class="validate" data-minlen="6">
```

### Maximum length validation

```html
<input type="text" class="validate" data-maxlen="10">
```

### Exact length validation

```html
<input type="text" class="validate" data-exactlen="6">
```

### Minimum value validation

```html
<input type="text" class="validate" data-minval="6">
```

### Maximum value validation

```html
<input type="text" class="validate" data-maxval="10">
```

### Exact value validation

```html
<input type="text" class="validate" data-exactval="6">
```

### Photo/Signature validation

```html
<input type="file" class="validate photo" data-maxkb="100" data-height="300" data-width="300">
<input type="file" class="validate signature" data-maxkb="100" data-height="300" data-width="80">
```

