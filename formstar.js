//formstar 	    : It is a handy tool to quickly submit the html form. 
//author		: Saumitra Kumar Paul. skpaul@gmail.com.
//Copyright		: You are free to use it anywhere anytime. But a thank-giving mail is appretiatable.
//Last update   : 2nd August, 2024.

//NOTE: no element can have the reserved word "submit" as ID or NAME in the form.

// git tag 		//show current tags
// git tag v11.0.22   	//create new tag
// git push --tags -u origin master
// https://codebeautify.org/minify-js

(function ($) {
    $.fn.formstar = function (options) {
        var form = $(this);

        var settings = $.extend({
            format: "auto",
            ajax:true,
            extraData: null,
            beforeValidation: null,
            onValidation: null,
            afterValidation: null,
            beforeSend: null,
            onResponse: null,
            successUndefined:null,
            onSuccess:null,
            beforeSuccessMessage:null,
            onSuccessMessage:null,
            afterSuccessMessage:null,
            successButton:null,
            onFail:null,
            failMessage:null,
            failButton:null,
            beforeRedirect: null,
            onRedirect: null,
            onError: null,
            errorButton: null,
            errorMessage: null,
            onComplete: null,
            reset: true,
            beforeReset:null,
            onReset:null,
            afterReset:null
        }, options);

        var action = form.attr('action');
        var method = form.attr('method');

        var $currentMessage;

        var button = $(this).find('button[type=submit]');
        var buttonText = "";
        var buttonTextElement = button.find("span.buttonText");
        var buttonIconElement = button.find("span.buttonIcon");
        var buttonIconHtml = "";

        function showError($message, $element){
            $.sweetModal({
                content: $message,
                icon: $.sweetModal.ICON_WARNING
            });

            $element.addClass("error");

            $('html,body').animate({
                scrollTop: $element.offset().top - 50
            }, 1000);

            $element.focus();
        }
  
        form.on('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var hasError = false;

            if(settings.beforeValidation) {
                if (settings.beforeValidation(form) == false) {
                    return;
                }
            }

            if(settings.onValidation) {
                if (settings.onValidation(form) == false) {
                    return;
                }
            }
            else{
                form.find('.validate').each(function(i, obj) {
                    var element = $(this);

                    var title = element.attr("data-title");
                    if ( typeof title == typeof undefined) {
                        title = element.parent('.field').find("label").html();
                    }

                    
                    var dataType = element.attr("data-datatype");
                    var value = element.val(); //$.trim();

                    if(element.parent('.field').hasClass("hidden")){
                        return;
                    }

                    var closestToggleVisibleWrapper = element.closest(".toggleVisibleWrapper");
                    if(typeof closestToggleVisibleWrapper != typeof undefined ){
                        if(closestToggleVisibleWrapper.hasClass("hidden")){
                            // alert("has");
                            return;
                        }
                        else{
                            // alert("has not from swift-submit");
                        }
                    }

                    //find whether a particular string has unicode characters (esp. Double Byte characters)
                    function isDoubleByte(str) {
                        for (var i = 0, n = str.length; i < n; i++) {
                            if (str.charCodeAt( i ) > 255) { return true; }
                        }
                        return false;
                    }

                    if($.trim(String(value)) != ''){
                        let isInvalid = isDoubleByte($.trim(String(value)));
                        if(isInvalid){
                            hasError = true;
                            console.log(element.attr('name'));
                            $currentMessage = "<strong>" + title + "</strong>"  + " must be in english";
                            showError($currentMessage, element);
                            return false;
                        }
                    }

                    var allowUnicode = element.attr("data-unicode"); ////Default is Unicode not allowed
                    if(allowUnicode !== false && typeof allowUnicode !== typeof undefined) {
                        if(allowUnicode == "no" && $.trim(String(value)) != ''){
                            let isInvalid = isDoubleByte($.trim(String(value)));
                            if(isInvalid){
                                hasError = true;
                                console.log(element.attr('name'));
                                $currentMessage = "<strong>" + title + "</strong>"  + " : Unicode not allowed";
                                showError($currentMessage, element);
                                return false;
                            }
                        }
                    }
                    else{
                        //Default is Unicode not allowed
                        if($.trim(String(value)) != ''){
                            let isInvalid = isDoubleByte($.trim(String(value)));
                            if(isInvalid){
                                hasError = true;
                                console.log(element.attr('name'));
                                $currentMessage = "<strong>" + title + "</strong>"  + " : Unicode not allowed.";
                                showError($currentMessage, element);
                                return false;
                            }
                        }
                    }

                    var isRequired = element.attr('data-required');
                    if (isRequired !== false && typeof isRequired !== typeof undefined) {
                        if(element.is(':checkbox')){
                            var checked = element.is(':checked');
                            if (!checked) {
                                hasError = true;
                                $currentMessage = "<strong>" + title + "</strong>" + " required.";
                                console.log(element.attr('name'));
                                showError($currentMessage, element);
                                return false;
                            }
                        }

                        if(isRequired == "required" && value == ""){
                            hasError = true;
                            console.log(element.attr('name'));
                            $currentMessage = "<strong>" + title + "</strong>" + " required.";
                            showError($currentMessage, element);
                            return false;
                        }
                    }

                    var dataType = element.attr("data-datatype");
                    var typeName = "characters";
                    if (dataType !== false && typeof dataType !== typeof undefined) {
                        var length = $.trim(value).length;
                        if(isRequired == "required" || (isRequired == "optional" && length>0)){
                            switch (dataType) {
                                case "letters":
                                    var re = /^[a-z\s]+$/i;
                                    if(!re.test(value)){
                                        hasError = true;
                                        message= title + " invalid." ;
                                        showError(message, element);
                                        return false;
                                    }                                
                                    break;
                                case "email":
                                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                    if(!re.test(value)){
                                        hasError = true;
                                        $currentMessage= title + " invalid." ;
                                        showError($currentMessage, element);
                                        return false;
                                    }                                
                                    break;
                                case "mobile":
                                    typeName = "digits";
                                    if(!IsMobileNumberValid(value)){
                                        hasError = true;
                                        $currentMessage = "<strong>" + title + "</strong>"  + " invalid." ;
                                        showError($currentMessage, element);
                                        return false;
                                    }
                                    break;
                                case "integer":
                                case "float":
                                case "double":
                                case "decimal":
                                    typeName = "digits";
                                    if(isNaN(value)){
                                        hasError = true;
                                        $currentMessage= "<strong>" + title + "</strong>"  + " must be a valid number.";
                                        showError($currentMessage, element);
                                        return false;
                                    }
                                    break;
                                case "date":
                                    var dateValue = moment(value, "DD-MM-YYYY");
                                    if(!dateValue.isValid()){
                                        hasError = true;
                                        $currentMessage= "<strong>" + title + "</strong>"  + " invalid." ;
                                        showError($currentMessage, element);
                                        return false;
                                    }
                                    
                                    break;
                                default:
                                    // hasError = true;
                                    // $currentMessage= "Datatype undefined for " + "<strong>" + title + "</strong>" + ".";
                                    // return false;
                                    break;
                            }
                        }
                    }

                    var minLength = element.attr("data-minlen");
                    if (minLength !== false && typeof minLength !== typeof undefined) {
                        var length = $.trim(value).length;
                        minLength = parseInt(minLength);
                        
                        //if required, must be valid. If optional and no data then skip otherwise must be valid.
                        if(isRequired == "required" || (isRequired == "optional" && length>0)){
                            if(length < minLength){
                                hasError = true;
                                console.log(element.attr('name'));
                                $currentMessage = "<strong>" + title + "</strong>"  + " must be equal or greater than " + minLength + " " + typeName + ".";
                                showError($currentMessage, element);
                                return false;
                            }
                        }
                    }

                    var maxLength = element.attr("data-maxlen");
                    if (maxLength !== false && typeof maxLength !== typeof undefined) {
                        var length = $.trim(value).length;
                        maxLength = parseInt(maxLength);
                        if(isRequired == "required" || (isRequired == "optional" && length>0)){
                            if(length > maxLength){
                                hasError = true;
                                console.log(element.attr('name'));
                                $currentMessage = "<strong>" + title + "</strong>"  + " must be equal or less than "+ maxLength + " " + typeName + ".";
                                showError($currentMessage, element);
                                return false;
                            }
                        }
                    }

                    var exactLength = element.attr("data-exactlen");
                    if (exactLength !== false && typeof exactLength !== typeof undefined) {
                        var length = $.trim(value).length;
                        exactLength = parseInt(exactLength);
                        if(isRequired == "required" || (isRequired == "optional" && length>0)){
                            if(length !== exactLength){
                                hasError = true;
                                console.log(element.attr('name'));
                                $currentMessage = "<strong>" + title + "</strong>"  + " must have "+ exactLength + " " + typeName + ".";
                                showError($currentMessage, element);
                                return false;
                            }
                        }
                    }

                    var minValue = element.attr("data-minval");
                    if (minValue !== false && typeof minValue !== typeof undefined) {
                        //Specific datatype is must for minimum value validation. 
                        if (dataType !== false && typeof dataType === typeof undefined) {
                            hasError = true;
                            $currentMessage= "Datatype undefined for " + "<strong>" + title + "</strong>" + ".";
                            showError($currentMessage, element);
                            return false;
                        }

                        var length = $.trim(value).length;
                        if(isRequired == "required" || (isRequired == "optional" && length>0)){
                            if(dataType == "integer" || dataType == "float" || dataType == "double" || dataType == "decimal"){
                                if(isNaN(value)){
                                    hasError = true;
                                    $currentMessage= "<strong>" + title + "</strong>"  + " must be a valid number.";
                                    showError($currentMessage, element);
                                    return false;
                                }
                            }
                            
                            switch (dataType){
                                case "integer":
                                    value = parseInt(value);
                                    minValue = parseInt(minValue);
                                    break;
                                case "float":
                                case "double":
                                case "decimal":
                                    value = parseFloat(value);
                                    minValue = parseFloat(minValue);
                                    break;
                                case "date":
                                    var value = moment(value, "DD-MM-YYYY");
                                    if(!value.isValid()){
                                        hasError = true;
                                        $currentMessage= "<strong>" + title + "</strong>"  + " invalid." ;
                                        showError($currentMessage, element);
                                        return false;
                                    }
                                    minValue = moment(minValue, "DD-MM-YYYY");
                                    break;
                                default: 
                                    hasError = true;
                                    $currentMessage= "Datatype undefined for " + "<strong>" + title + "</strong>"  + ".";
                                    showError($currentMessage, element);
                                    return false;
                            }
                            
                            if(value < minValue){
                                hasError = true;
                                $currentMessage= "<strong>" + title + "</strong>"  + " must be equal or greater than " + minValue + ".";
                                showError($currentMessage, element);
                                return false;
                            }
                        }
                    }

                    var maxValue = element.attr("data-maxval");
                    if (maxValue !== false && typeof maxValue !== typeof undefined) {
                        //Specific datatype is must for maximum value validation. 
                        if (dataType !== false && typeof dataType === typeof undefined) {
                            hasError = true;
                            $currentMessage= "Datatype undefined for " + title + ".";
                            showError($currentMessage, element);
                            return false;
                        }

                        var length = $.trim(value).length;
                        if(isRequired == "required" || (isRequired == "optional" && length>0)){
                            if(dataType == "integer" || dataType == "float" || dataType == "double" || dataType == "decimal"){
                                if(isNaN(value)){
                                    hasError = true;
                                    $currentMessage= "<strong>" + title + "</strong>"  + " must be a valid number.";
                                    showError($currentMessage, element);
                                    return false;
                                }
                            }
                            
                            switch (dataType){
                                case "integer":
                                    value = parseInt(value);
                                    maxValue = parseInt(maxValue);
                                    break;
                                case "float":
                                case "double":
                                case "decimal":
                                    value = parseFloat(value);
                                    maxValue = parseFloat(maxValue);
                                    break;
                                case "date":
                                    var value = moment(value, "DD-MM-YYYY");
                                    if(!value.isValid()){
                                        hasError = true;
                                        $currentMessage= title + " invalid." ;
                                        showError($currentMessage, element);
                                        return false;
                                    }
                                    maxValue = moment(maxValue, "DD-MM-YYYY");
                                    break;
                                default: 
                                    hasError = true;
                                    $currentMessage= "Datatype undefined for " + "<strong>" + title + "</strong>" + ".";
                                    showError($currentMessage, element);
                                    return false;
                            }
                            
                            if(value > maxValue){
                                hasError = true;
                                $currentMessage= "<strong>" + title + "</strong>"  + " must be equal or less than " + maxValue + ".";
                                showError($currentMessage, element);
                                return false;
                            }
                        }
                    }

                    var exactValue = element.attr("data-exactval");
                    if (exactValue !== false && typeof exactValue !== typeof undefined) {
                        //Specific datatype is must for exactimum value validation. 
                        if (dataType !== false && typeof dataType === typeof undefined) {
                            hasError = true;
                            $currentMessage= "Datatype undefined for " + title + ".";
                            showError($currentMessage, element);
                            return false;
                        }

                        var length = $.trim(value).length;
                        if(isRequired == "required" || (isRequired == "optional" && length>0)){
                            if(dataType == "integer" || dataType == "float" || dataType == "double" || dataType == "decimal"){
                                if(isNaN(value)){
                                    hasError = true;
                                    $currentMessage= "<strong>" + title + "</strong>"  + " must be a valid number.";
                                    showError($currentMessage, element);
                                    return false;
                                }
                            }
                            
                            switch (dataType){
                                case "integer":
                                    value = parseInt(value);
                                    exactValue = parseInt(exactValue);
                                    break;
                                case "float":
                                case "double":
                                case "decimal":
                                    value = parseFloat(value);
                                    exactValue = parseFloat(exactValue);
                                    break;
                                case "date":
                                    var value = moment(value, "DD-MM-YYYY");
                                    if(!value.isValid()){
                                        hasError = true;
                                        $currentMessage= "<strong>" + title + "</strong>"  + " invalid." ;
                                        showError($currentMessage, element);
                                        return false;
                                    }
                                    exactValue = moment(exactValue, "DD-MM-YYYY");
                                    break;
                                default: 
                                    hasError = true;
                                    $currentMessage= "Datatype undefined for " + "<strong>" + title + "</strong>"  + ".";
                                    showError($currentMessage, element);
                                    return false;
                            }
                            
                            if(value != exactValue){
                                hasError = true;
                                $currentMessage= "<strong>" + title + "</strong>"  + " must be equal to " + exactValue + ".";
                                showError($currentMessage, element);
                                return false;
                            }
                        }
                    }

                    if(element.hasClass("photo")){
                        var maxSizeInKb = element.attr("data-maxkb");
                        var requiredHeight = element.attr("data-height");
                        var requiredWidth = element.attr("data-width");
                        if (!ValidatePhoto(element, parseInt(maxSizeInKb), parseInt(requiredHeight), parseInt(requiredWidth))) {
                            hasError = true;
                            //NOTE: $currentMessage has been set inside the ValidatePhoto()
                            return false;
                        }
                    }

                    if(element.hasClass("signature")){
                    
                        var maxSizeInKb = element.attr("data-maxkb");
                        var requiredHeight = element.attr("data-height");
                        var requiredWidth = element.attr("data-width");
                        if (!ValidatePhoto(element, parseInt(maxSizeInKb), parseInt(requiredHeight), parseInt(requiredWidth))) {
                            hasError = true;
                            //NOTE: $currentMessage has been set inside the ValidatePhoto()
                            return false;
                        }
                    }

                    element.removeClass("error");
                });
            }

            if (hasError) {
                hasError=false;
                return;
            }

            if(settings.afterValidation) {
                if (settings.afterValidation(form) == false) {
                    return;
                }
            }

            if(settings.ajax){
                if(settings.format == "auto"){
                    // console.log($(form).serialize());
                    // submitFormAsAuto($(form).serialize());  //var data  = $(form).serialize();  // var data = new FormData(this);
                    let formData = new FormData(this);
                    if($.isEmptyObject(settings.extraData) == false){
                        $.each(settings.extraData, function( key, value )
                        {
                            formData.append(key, value);
                        });
                    }
                    submitFormAsAuto(formData);  //var data  = $(form).serialize();  // var data = new FormData(this);
                }
            }
            else{
                //submit without ajax-
                onBeforeSend();
                $(form).unbind('submit'); //must unbind 'submit'
                $(form).submit();
            }
        });

        function onBeforeSend() {
            if (settings.beforeSend) {
                settings.beforeSend(form);
            }
            else{
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
        }

        function onSuccess(response){
            //Handle all the functions after a response arrives from server, OR leave it for formstar.
            if (settings.onResponse){
                settings.onResponse(response, form);
            }
            else {
                if(typeof response.issuccess == typeof undefined){
                    if(settings.successUndefined){
                        settings.successUndefined(response, form);
                    }
                    else{
                        button.removeAttr('disabled');
                        console.log("response.issuccess property undefined. Details- " + response);
                        if(buttonTextElement.length !== 0){
                            buttonTextElement.html(buttonText);
                            buttonIconElement.removeClass('spinner').html("arrow_forward").css("color", "#A3B9D8");
                        }
                        else{
                            button.html(buttonText);
                        }
                        alert("Problem in getting response from server. Please try again.");
                    }
                   
                    return false;
                } //<-- response.issuccess == typeof undefined
            
                if(response.issuccess){
                    //Handle all the success consequences (show success msg, change button state & reset form), OR leave it for formstar.
                    if(settings.onSuccess){
                        settings.onSuccess(response, form);
                    }
                    else{
                        //If server sends any message to display, then show it here.
                        if(typeof response.message != typeof undefined )  //same as-> if(typeof $response.message != 'undefined' )
                        {
                            if(settings.beforeSuccessMessage){
                                settings.beforeSuccessMessage(response, form);
                            }

                            if(settings.onSuccessMessage){
                                settings.onSuccessMessage(response, form);
                            }
                            else{
                                $.sweetModal({
                                    content: response.message,
                                    icon: $.sweetModal.ICON_SUCCESS
                                });
                            }
                            if(settings.afterSuccessMessage){
                                settings.afterSuccessMessage(response, form);
                            }
                           
                            //Change the button state by yourself, or leave it for formstar.
                            if(settings.successButton){
                                settings.successButton(button);
                            }
                            else{
                                button.removeAttr('disabled');
                                if(buttonTextElement.length !== 0){
                                    buttonTextElement.html(buttonText);
                                    buttonIconElement.removeClass('spinner').html("arrow_forward").css("color", "#A3B9D8");
                                }
                                else{
                                    button.html(buttonText);
                                }
                            }
                          
                            //beforeReset(), onReset(), afterReset()
                            if(settings.reset){
                                //Do some tasks before the actual reset starts-
                                if(settings.beforeReset){
                                    settings.beforeReset(form);
                                }
                                
                                //Reset the form in your own way, or leave it for formstar.
                                if(settings.onReset){
                                    settings.onReset(form);
                                }
                                else{
                                    resetForm(form);
                                }

                                //Do some tasks after the actual reset completes-
                                if(settings.afterReset){
                                    settings.afterReset(form);
                                }
                            }
                        }

                        //If server sends any redirecturl, redirect to that url.
                        if(typeof response.redirecturl != typeof undefined )  //same as -> if(typeof $response.redirecturl != 'undefined' )
                        {
                            //Useful if you want to change DOM elements.
                            if(settings.beforeRedirect){
                                settings.beforeRedirect();
                            }

                            //Useful if you want to modify the response.redirecturl i.e. add/edit query string parameter/s.
                            if(settings.onRedirect){
                                settings.onRedirect(response.redirecturl);
                            }
                            else{
                                window.location = response.redirecturl;
                            }
                        }
                    }

                } //<--- response.issuccess
                else{
                    //Handle all the fail consequences (show fail msg & change button state), OR leave it for formstar.
                    if(settings.onFail){
                        settings.onFail(response, form);
                    }
                    else{
                        //Show the message by yourself, OR, leave it for formstar.
                        if(settings.failMessage){
                            settings.failMessage(response.message);
                        }
                        else{
                            $.sweetModal({
                                content: response.message,
                                icon: $.sweetModal.ICON_WARNING
                            });
                        }

                        //Change the button state by yourself, OR, leave it for formstar.
                        if(settings.failButton){
                            settings.failButton(button);
                        }
                        else{
                            button.removeAttr('disabled');
                            if(buttonTextElement.length !== 0 ){
                                buttonTextElement.html('Try again');
                                buttonIconElement.removeClass('spinner').html("arrow_forward").css("color", "#A3B9D8");
                            }
                            else{
                                button.html('Try again');
                            }  
                        }
                    }
                }
            }
        } //success ends

        function onError(xhr, status, error) {
            if (settings.onError) {
                settings.onError(xhr, status, error, button);
            }
            else{
                if (settings.errorButton) {
                    settings.errorButton(button);
                }
                else {
                    if(buttonTextElement !== 0){
                        buttonTextElement.html('Try again');
                        buttonIconElement.removeClass('spinner').html("arrow_forward").css("color", "#A3B9D8");
                    }
                    else{
                        button.html('Try again');
                    }
                }
               
                if (settings.errorMessage) {
                    settings.errorMessage(xhr, status, error);
                }
                else {
                    HandleError(xhr, status, error);
                }
            }            
        }

        function onCompleted() {
            if (settings.onComplete) {
                settings.onComplete(form);
            }
            else {
                button.removeAttr('disabled');
            }
        }

        function submitFormAsAuto(formData) {
            $.ajax({
                data:formData,
                cache:false,
                contentType: false,
                processData: false,
                type: method,
                url: action,
                beforeSend: onBeforeSend,
                success: onSuccess,
                error: onError,
                complete: onCompleted
            });
        }

        function submitFormAsJson() {
            var $JsonData = convertHtmlFormToJson(form); //all input variables        

            $.ajax({
                data: JSON.stringify($JsonData),
                type: method,
                url: action,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                beforeSend: beforeSend,
                success: success,
                error: onError,
                complete: onCompleted
            });
        }

        function convertHtmlFormToJson(selector) {
            var ary = $(selector).serializeArray();
            var obj = {};
            for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
            return obj;
        }

        function HandleError(jqXHR, textStatus, errorThrown) {
            var message = "Failed to execute.\n";
            switch (textStatus) {
                case "timeout":
                    message += "Operation timeout. Pleasy try again.";
                    message += "\n " + jqXHR.statusText + ' (' + jqXHR.status + ')';
                    break;
                case "error":
                    message += "An error ouccured.";
                    message += "\n " + jqXHR.statusText + ' (' + jqXHR.status + ')';
                    break;
                case "abort":
                    message += "Request aborted.";
                    message += "\n " + jqXHR.statusText + ' (' + jqXHR.status + ')';
                    break;
                case "parsererror":
                    message += "Parser error.";
                    message += "\n " + jqXHR.statusText + ' (' + jqXHR.status + ')';
                    break;
                default:
                    message += "An unexpected error occured.";
                    message += "\n " + jqXHR.statusText + ' (' + jqXHR.status + ')';
                    break;
            }

            $.sweetModal({
                content: message,
                icon: $.sweetModal.ICON_WARNING
            });

            console.log(jqXHR.status); //statusText: "Not Found"
            console.log(jqXHR.statusText); //statusText: "Not Found"
            console.log(textStatus);
            console.log(errorThrown);

        }

        function resetForm(HtmlForm) {
            HtmlForm.trigger('reset');
            $('select.resetIt', HtmlForm).each(function () {
                // $(this).select2("val", "");
                var defaultValue = $(this).attr('data-default-value');
                var defaultText = $(this).attr('data-default-text');
                $(this).empty().append('<option value="' + defaultValue + '">' + defaultText + '</option>');
            });

            $('select.emptyIt', HtmlForm).empty();

            $(HtmlForm).find('input:visible:first').focus();
        }

        function IsMobileNumberValid(mobileNumber) {
            mobileNumber = mobileNumber.trim();
        
            if (mobileNumber == '') { return false; }
            if (isNaN(mobileNumber)) { return false; }
        
            if (mobileNumber.length < 10) { return false; }
        
            var operatorCodes = ["013", "014" ,"015", "016", "017", "018", "019"];
        
            //if the number is 1711781878, it's length must be 10 digits
            if (mobileNumber.startsWith("1")) {
                if (mobileNumber.length != 10) { return false; }
                var firstTwoDigits = mobileNumber.substr(0, 2); //returns 17, 18 etc,
                var operatorCode = "0" + firstTwoDigits; //Make first two digits a valid operator code with adding 0.
                if (!operatorCodes.includes(operatorCode)) { return false; }
                return true;
            }
        
            if (mobileNumber.startsWith("01")) {
                //if the number is 01711781878, it's length must be 11 digits
                if (mobileNumber.length != 11) { return false; }
                var operatorCode = mobileNumber.substr(0, 3); //returns 017, 018 etc,
                if (!operatorCodes.includes(operatorCode)) { return false; }
                return true;
            }
        
            if (mobileNumber.startsWith("8801")) {
                //if the number is 8801711781878, it's length must be 13 digits
                if (mobileNumber.length != 13) { return false; }
                var operatorCode = mobileNumber.substr(2, 3); //returns 017, 018 etc,
                if (!operatorCodes.includes(operatorCode)) { return false; }
                return true;
            }
        
            return false;
        }


        function ValidatePhoto(fileInputControl, maximumKB, requiredHeight, requiredWidth){
            var fileName = fileInputControl.val();
            var title = fileInputControl.attr("data-title");

            if(fileName ==''){
                $currentMessage = "<strong>" + title + "</strong>" + " required.";
                showError($currentMessage, fileInputControl);
                return false;
            }

            var fileInput = fileInputControl[0];
            var selectedFile = fileInput.files[0];
            
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpeg|.jpg)$/;

            var arrFileName = fileName.split("\\");

            //check whether it is .jpeg or .jpg ---->
            if (!regex.test(fileName.toLowerCase())) {
                $currentMessage = "<strong>" + title + "</strong>" + " invalid. Please select a .jpg file.";
                showError($currentMessage, fileInputControl);
                return false;
            }
            //<---- check whether it is .jpeg or .jpg

            var fileSizeInByte = selectedFile.size;
            var Units = new Array('Bytes', 'KB', 'MB', 'GB');
            var unitPosition = 0;
            while (fileSizeInByte > 900) {
                fileSizeInByte /= 1024; unitPosition++;
            }

            var finalSize = (Math.round(fileSizeInByte * 100) / 100);
            var finalUnitName = Units[unitPosition];

            var fileSizeAndUnit = finalSize + ' ' + finalUnitName;

            //Check file size ----->
            if (finalUnitName != 'KB') {
                $currentMessage = "<strong>" + title + "</strong>" + " size is too large. Maximum size is 100 kilobytes.";
                showError($currentMessage, fileInputControl);
                return false;
            }
            else{
                if(finalSize > maximumKB){ 
                    $currentMessage = "<strong>" + title + "</strong>" + " size is too large. Maximum size is 100 kilobytes.";
                    showError($currentMessage, fileInputControl);
                    return false;
                }
            }

            /*Checks whether the browser supports HTML5*/
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                //Read the contents of Image File.
                reader.readAsDataURL(fileInput.files[0]);

                reader.onload = function (e) {
                    //Initiate the JavaScript Image object.
                    var image = new Image();
                    //Set the Base64 string return from FileReader as source.
                    image.src = e.target.result;
                
                    image.onload = function () {  
                        if (this.width != requiredWidth) {
                            $currentMessage =  "<strong>" + title + "</strong>" + " width invalid. Width must be " + requiredWidth + " pixel.";
                            showError($currentMessage, fileInputControl);
                            return false;
                        }                 
                        if (this.height != requiredHeight) {
                            $currentMessage = "<strong>" + title + "</strong>" + " height invalid. Height must be "+ requiredHeight  + " pixel.";
                            showError($currentMessage, fileInputControl);
                            return false;
                        }
                    };
                }
            }

            return true;
        }

    };

}(jQuery));