# FormStar (v1.0.5)

A JQuery plugin for quickly build, validate and submit an html form.

## Installation

------

**Using from a CDN**

```html
<script src="https://cdn.jsdelivr.net/gh/skpaul/formstar@1.0.5/formstar.min.js"></script>
```

**Manual installation**

It is strongly recommend that you use a CDN. This will make it easier for you to deploy your project in different environments, and easily update FormStar when new versions are released. Nonetheless if you prefer to integrate FormStar into your project manually, you can download the release of your choice from GitHub and copy the files into your project.

Include the compiled files in your page:

```html
<script src="path/to/formstar.min.js"></script>
```

Prerequisite: JQuery, moment.js and sweetModal.js

## Basic usage

```javascript
$('#form-one').formstar(); 
$('#form-two').formstar();
```

## Configuration

To configure custom options when you initialize FormStar, simply pass an object in your call to `.formstar()`

```javascript
$('#form-one').formstar({ajax:false});  //submitted without JQuery AJAX.
```

## Options

This is a list of all the `FormStar` configuration options-

| Option             | Type                | Default | Description                                                  |
| ------------------ | ------------------- | ------- | ------------------------------------------------------------ |
| `ajax`             | boolean             | `true`  | Whether the form will be submitted using JQuery AJAX or not. |
| `extraData`        | object              | `null`  | Any additional data outside of the form. See examples below for details. |
| `beforeValidation(form)` | callback function() | `null`  | If provided, it will be executed before the built-in validation starts. See example below for details. |
| `onValidation(form)`     | callback function() | `null`  | Override the default built-in validation mechanism. See example below for details. |
| `afterValidation(form)`  | callback function() | `null`  | If provided, it will be executed after the built-in validation finishes. See example below for details. |
| `beforeSend(form)`       | callback function() | `null`  | Override the default method. See example below for details. |
| `onResponse(response, form)`       | callback function() | `null`  | Override the default method when a response arrives from server. The response has status code -200 (OK), means that the request was successful |
| `successUndefined`       | callback function() | `null`  | Override the default method when a response arrives from server. |
| `onSuccess(response, form)`       | callback function() | `null`  | Overrides the default method. The requesting task/s has been completed successfully by the back-end and `response.issuccess=true` is present in the response object. Useful if you want to handle all the success consequences (show msg, change button state, reset form etc.). |
| `beforeSuccessMessage(response, form)` | callback function() | `null`  | Do some tasks before showing the message. If empty, FormStar will not do anything. If you already override the `onSuccess()` callback, this method WILL NOT BE INVOKED.|
| `onSuccessMessage(message)`       | callback function() | `null`  | Overrides the default method of displaying the message. If you already override the `onSuccess()` callback, this method WILL NOT BE INVOKED. |
| `afterSuccessMessage(response, form)` | callback function() | `null`  | Do some tasks after showing the message. If empty, FormStar will not do anything. If you already override the `onSuccess()` callback, this method WILL NOT BE INVOKED.|
| `successButton(button)`       | callback function() | `null`  |  Overrides the default method of changing button states (i.e. change button text/icon, disable attribute etc.). If you already override the `onSuccess()` callback, this method WILL NOT BE INVOKED. |
| `onFail(response, form)`       | callback function() | `null`  |   Overrides the default method. The requesting task/s has been failed to complete by the back-end and `response.issuccess=false` is present in the response object. Useful if you want to handle all the consequences (show msg, change button state, reset form etc.). |
| `failMessage(message)`       | callback function() | `null`  | Overrides the default method of displaying the message. |
| `failButton(button)`       | callback function() | `null`  | Overrides the default method of changing button states (i.e. change button text/icon, disable attribute etc.).  |
| `beforeRedirect()`       | callback function() | `null`  | Useful if you want to change DOM elements before redirect. If you already override the `onSuccess()` callback, this method WILL NOT BE INVOKED. |
| `onRedirect(url)`       | callback function() | `null`  | Override the default method. Useful if you want to modify the response.redirecturl i.e. add/edit query string parameter/s. If you already override the `onSuccess()` callback, this method WILL NOT BE INVOKED. |
| `onError(xhr, status, error, button)`       | callback function() | `null`  | Override the default method if the response has status code other than 200 (OK) |
| `errorButton(button)`       | callback function() | `null`  | Overrides the default method of changing button states (i.e. change button text/icon, disable attribute etc.).  |
| `errorMessage(xhr, status, error)`       | callback function() | `null`  | Overrides the default method of displaying the error message. |
| `onComplete(form)`       | callback function() | `null`  | Override the default method. |
| `reset`       | boolean | `true`  | Whether the form will be reset or not. |
| `beforeReset(form)`       | callback function() | `null`  | Do some tasks before the actual reset starts. If you already override the `onSuccess()` callback, this method WILL NOT BE INVOKED. |
| `onReset(form)`       | callback function() | `null`  | Override the default method. Reset the form in your own way. If you already override the `onSuccess()` callback, this method WILL NOT BE INVOKED. |
| `afterReset(form)`       | callback function() | `null`  | Do some tasks after the actual reset completes. If you already override the `onSuccess()` callback, this method WILL NOT BE INVOKED. |

## Option details & example

**ajax**

```javascript
//Default value is true. This option is not needed if submitting via AJAX. Without AJAX submission, a page-reload occurs.
$('form').formstar({ajax:false});
```

**extraData**

```javascript
//These will be append to the main form before submit. extraData is only available for ajax submit.
$('form').formstar({
                      ajax:true,
                      extraData:{name:"abc", age:25}
                 });
```

**beforeValidation**

If provided, it will be executed before the built-in validation starts. This option useful if you want to do some pre-checks before the built-in validation starts.

```javascript
function beforeValidation(form) {
     let something = false;
     if (!something) {
         $.sweetModal({
             content: 'Display some message to the user',
             icon: $.sweetModal.ICON_WARNING
         });
         return false;  //must return false if validation fails.
     }
     return true; //must return true if validation passes.
}

//usage
$('form').formstar({
    				success:onSuccess,
    				extraData:{name:"abc", id:104525},
    				beforeValidation: beforeValidation
				});
```

**onValidation**

If provided, it will **completely replace** the built-in validation mechanism.

```javascript
//example function
function onValidation(form) {
     let something = false;
     if (!something) {
         $.sweetModal({
             content: 'Display some message to the user',
             icon: $.sweetModal.ICON_WARNING
         });
         return false;  //must return false if validation fails.
     }
     return true; //must return true if validation passes.
}

//usage
$('form').formstar({
					extraData:{name:"abc", id:104525},
					beforeValidation: beforeValidation,
					onValidation: onValidation
				});
```

**afterValidation**

If provided, it will be executed after the built-in validation completed. This option useful if you want to do some post-checks after the built-in validation completes.

```javascript
//example function
function afterValidation(form) {
     let something = false;
     if (!something) {
         $.sweetModal({
             content: 'Display some message to the user',
             icon: $.sweetModal.ICON_WARNING
         });
         return false;  //must return false if validation fails.
     }
     return true; //must return true if validation passes.
}

//usage
$('form').formstar({
					extraData:{name:"abc", id:104525},
					beforeValidation: beforeValidation,
					validationRules: validationRules,
					afterValidation: afterValidation,			
					success:onSuccess
				});
```

**beforeSend**

If provided, it will **completely replace** the built-in beforeSend mechanism.

```javascript
//example function
function beforeSend(form) {
    if(buttonTextElement.length !== 0) {
          buttonText = buttonTextElement.html();
          buttonTextElement.html('Wait…');
          buttonIconHtml = buttonIconElement.html();
          buttonIconElement.addClass('spinner').html("autorenew").css("color", "#A3B9D8");
     }
     else{
         buttonText = button.html();
         button.html('Wait…');
     }           
     button.attr('disabled', 'disabled');
}

//usage
$('form').formstar({
					extraData:{name:"abc", id:104525},
					beforeValidation: beforeValidation,
					validationRules: validationRules,
					afterValidation: afterValidation,
    				beforeSend:beforeSend,
					success:onSuccess
				});
```

### **onResponse**

It will **completely replace** the built-in `success()` function.

```javascript
//example function
function onResponse(response, form){
    //By default, 'response' is a JavaScript object. But you can send any other format also from your back-end.
    if(response.issuccess){
        $icon.removeClass('spinner').html("done").css("color", "#A3B9D8"); //do some DOM manipulation.
        window.location = response.redirecturl; //or, redirect elsewhere.
    }
    else{
        $.sweetModal({
           content: response.message,  //or, show server-sent message to the user.
              icon: $.sweetModal.ICON_WARNING
          });
          $submitButton.removeAttr('disabled');
          $icon.removeClass('spinner').html("arrow_forward").css("color", "#A3B9D8");
    }
}

//usage
$('form').formstar({
    				success:onSuccess,
    				extraData:{name:"abc", id:104525},
    				onResponse:onResponse
				});
```



## Form Submit Button

You must use `<button type="submit">...</button>` element to submit the form.

```html
<form>
    <!--A simple button-->
    <button type="submit">Submit</button>

    <!--or, more styling approach-->
    <button type="submit">
        <span class="buttonText">Submit</span>
        <span class="buttonIcon">icon-name</span>
    </button>
</form> 

//NOTE: no element can have the reserved word "submit" as ID or NAME in the form.
```



## Form Validation Basics

The validating input element must have `.validate` class.

```html
<div class="field">
    <label>Name</label>
	<input type="text" class="validate">
</div>
```

If the input does not have any label, then input must have `data-title` attribute -

```html
<input type="text" class="validate" data-title="Student Name">
```

If `.field` element has `.hidden`, it will not be validated -

```html
<div class="field hidden">
    <label>Name</label>
	<input type="text" class="validate">
</div>
```



### Required/Optional

if `data-required` attribute is absent, the element becomes optional -

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



## Functions Template

```javascript
var $icon = $('.buttonIcon');
var $submitButton = $('.form-submit-button');

function beforeSend(){
	$icon.addClass('spinner').html("autorenew").css("color", "#A3B9D8");
	$submitButton.attr('disabled', 'disabled');
}

function success(response){
	if(response.issuccess){
	     $icon.removeClass('spinner').html("done").css("color", "#A3B9D8");
	     window.location = response.redirecturl;
    }
    else{
		$.sweetModal({
			content: response.message,
			icon: $.sweetModal.ICON_WARNING
		});
		$submitButton.removeAttr('disabled');
		$icon.removeClass('spinner').html("arrow_forward").css("color", "#A3B9D8");
	}
}

function error(a,b,c){
	$.sweetModal({
		content: 'Failed to communicate with server',
		icon: $.sweetModal.ICON_WARNING
	});
	console.log(b + ", " + c);
	$submitButton.removeAttr('disabled');
	$icon.removeClass('spinner').html("arrow_forward").css("color", "#A3B9D8");
}

function validationRule() {
	let checked = false;
	if (!checked) {
		$.sweetModal({
			content: 'Please provide your consent in the declaration section.',
			icon: $.sweetModal.ICON_WARNING
		});
		return false;
	}
	return true;
}
```

