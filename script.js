// Globle valiables
var pwdValid = '';
var inputPlaceholder = '';
var uppercase = new RegExp('[A-Z]');
var lowercase = new RegExp('[a-z]');
var numbers = new RegExp('[0-9]');
var specialcase = new RegExp('([!,%,&,@,#,$,^,*,?,_,~])');

// script start here
jQuery(document).ready(function () {
    // browser cookies
    if (!jQuery('body').hasClass('teamcroco-test')) {
        var cookieName = 'teamcroco-test-05-05-2022';
        var cookieValue = '1';
        var myDate = new Date();
        myDate.setDate(myDate.getDate() + 30);
        document.cookie = cookieName + "=" + cookieValue + ";expires=" + myDate;
        jQuery('body').addClass('teamcroco-test');
        jQuery('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">').appendTo('head');
    }
    popup();
    // popup close event
    jQuery('body').on('click', '.close', function () {
        jQuery('body').removeClass('modal-loaded');
    });
    // change all a tag from http to https for security purpose
    jQuery('a[href^="http://"]').each(function () {
        var oldUrl = jQuery(this).attr("href"); // Get current url
        var newUrl = oldUrl.replace("http://", "https://"); // Create new url
        jQuery(this).attr("href", newUrl); // Set herf value
    });
    // set target for modal
    jQuery('#agree a').attr('target', 'dummyframe');
    jQuery('#agree a').on('click', function (e) {
        jQuery('body').addClass('modal-loaded');
        var termsURL = jQuery(this).attr('href');
        setTimeout(function () {
            jQuery('.popup-outer .popup-inner iframe').attr('src', termsURL)
        }, 100);
    });
    // form validation events
    var listPassword = '<ul class="password-checker-list hide"><li class="length">Eight characters minimum.</li><li class="uppercase">One uppercase character.</li><li class="lowercase">One lowercase character.</li><li class="special">One special character.</li><li class="number">One number.</li><ul>';
    jQuery('.controls.password-meter').append(listPassword);
    jQuery("#company").blur();
    jQuery('#signupForm')[0].reset();
    jQuery('.controls').append('<span class="mark"><i class="fa" aria-hidden="true"></i></span>');
    jQuery('.c-signup .btn-success').prop('disabled', 'disabled');
    // keyup event
    jQuery('#signupForm').on('keyup blur', 'input', function () {
        var currentVal = jQuery(this).val();
        var elem = jQuery(this);
        if (currentVal == '' && jQuery(this).attr('id') != 'password') {
            inputPlaceholder = jQuery(this).attr('placeholder').toLowerCase();
            if (jQuery(this).next('div.errormsg').length == 0) {
                jQuery(this).after('<div class="errormsg">Please enter your ' + inputPlaceholder + '</div>');
            } else {
                jQuery(this).next('.errormsg').text('Please enter your ' + inputPlaceholder);
            }
            invalid(elem);
        } else if (jQuery(this).attr('id') == 'fname' || jQuery(this).attr('id') == 'lname') {
            if (!IsLetter(jQuery(this).val())) {
                inputPlaceholder = 'Name contains only alphabets';
                errorEle(elem, inputPlaceholder);
                invalid(elem);
            } else {
                valid(elem);
            }
        } else if (jQuery(this).attr('id') == 'email') {
            if (!IsEmail(jQuery(this).val())) {
                inputPlaceholder = 'Please enter a valid email address';
                errorEle(elem, inputPlaceholder);
                invalid(elem);
            } else {
                valid(elem);
            }
        } else if (jQuery(this).attr('id') == 'password') {
            if (!IsPassword(jQuery(this).val())) {
                jQuery('.controls.password-meter .password-checker-list').removeClass('hide');
                invalid(elem);
            } else {
                jQuery('.controls.password-meter .password-checker-list').addClass('hide');
                valid(elem);
            }
        } else {
            jQuery('.controls.password-meter .password-checker-list').addClass('hide');
            valid(elem);
        }
        if (jQuery('#company').val() != '' && jQuery('#fname').val() != '' && jQuery('#lname').val() != '' && jQuery('#email').val() != '' && jQuery('#password').val() != '' && jQuery('#signupForm .errormsg').length == 0) {
            jQuery('.c-signup .btn-success').removeAttr('disabled');
        } else {
            jQuery('.c-signup .btn-success').prop('disabled', 'disabled');
        }
    });
});
// window back button for form reset
jQuery(window).on('popstate', function (e) {
    jQuery('#signupForm')[0].reset();
});
// modal form 
function popup() {
    if (jQuery('.popup-outer').length == 0) {
        jQuery('body').append('<div class="overlay"></div><div class="popup-outer"><div class="close"><img src="https://res.cloudinary.com/spiralyze/image/upload/v1624943467/Hello%20Bar/2004%20Pricing%20Page%20Modal%20Quiz/close-icon.svg" alt="close"></div><div class="popup-inner"><iframe src="" name="dummyframe" id="dummyframe" frameborder="0" width="100%" height="100%"></iframe></div></div>');
    }
    var modal = jQuery('.overlay');
    jQuery('.overlay').on('click', function (event) {
        if (event.target == modal[0]) {
            jQuery('body').removeClass('modal-loaded');
        }
    });
}
// input field validation functions
function IsLetter(text) {
    var regex = /^[a-zA-Z]*$/;
    if (!regex.test(text)) {
        return false;
    } else {
        return true;
    }
}
// check valid email
function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
        return false;
    } else {
        return true;
    }
}
// ivalid input field 
function invalid(ele) {
    ele.closest('.controls').addClass('invalid').removeClass('valid');
    ele.closest('.controls').find('.mark > i').addClass('fa-times-circle').removeClass('fa-check-circle');
}
// valid input field
function valid(ele) {
    ele.next('div.errormsg').remove();
    ele.closest('.controls').removeClass('invalid').addClass('valid');
    ele.closest('.controls').find('.mark > i').removeClass('fa-times-circle').addClass('fa-check-circle');
}

function errorEle(ele, msg) {
    if (ele.next('div.errormsg').length == 0) {
        ele.after('<div class="errormsg"> ' + msg + '</div>');
    } else if (ele.next('div.errormsg').length == 1) {
        ele.next('.errormsg').text(msg);
    }
}
// password validation
function IsPassword(password) {
    // Validate the length
    if (password.length > 7) {
        jQuery('.length').addClass('hide');
        pwdValid = true;
    } else {
        jQuery('.length').removeClass('hide');
    }
    // Validate capital letter
    regexPassCheck(password, uppercase, '.uppercase');
    // Validate lowercase letter
    regexPassCheck(password, lowercase, '.lowercase');
    // Validate Number
    regexPassCheck(password, numbers, '.number');
    // Validate Special character
    regexPassCheck(password, specialcase, '.special');
    return pwdValid;
}
// regex validator
function regexPassCheck(password, rg, selector) {
    if (password.match(rg)) {
        jQuery(selector).addClass('hide');
        pwdValid = pwdValid && true;
    } else {
        jQuery(selector).removeClass('hide');
        pwdValid = false;
    }
}