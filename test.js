var count = 0;
var selectedArray = [];
var check;
var iti;
var language = 'en-US';
var dictionary = [];
const owner_city = ['Owner', 'CopyOfMulkiya', 'CopyOfKrooki', 'CopyOfOwnerIDCard', 'NOCFromMunicipality', 'CopyOfElectricianLicense'];
const owner_rural = ['Owner ', 'CopyOfKrooki', 'CopyOfOwnerIDCard', 'NOCFromMunicipality', 'CopyOfElectricianLicense'];
const inheritors_city = ['Inheritors', 'CopyOfMulkiya', 'CopyOfKrooki', 'CopyOfLegalNotification', 'CopyOfOwnerIDCard', 'NOCFromMunicipality', 'CopyOfElectricianLicense'];
const inheritors_rural = ['Inheritors', 'CopyOfKrooki', 'CopyOfLegalNotification', 'CopyOfOwnerIDCard', 'NOCFromMunicipality', 'CopyOfElectricianLicense'];
const multipleOwners = ['MultipleOwnersOneMulkiya', 'CopyOfMulkiya', 'CopyOfKrooki', 'CopyOfOwnerIDCard', 'NOCFromMunicipality', 'CopyOfElectricianLicense'];
const company = ['FormalLetterFromCompany', 'CopyOfMulkiya', 'CopyOfKrooki', 'CopyOfCommercialReference', 'NOCFromMunicipality', 'CopyOfElectricianLicense'];
const Government = ['FormalLetterFromGovernmentEntity', 'CopyOfMulkiya', 'CopyOfKrooki', 'NOCFromMunicipality', 'CopyOfElectricianLicense'];
const AllElements = [...new Set([...owner_city, ...owner_rural, ...inheritors_city, ...inheritors_rural, ...multipleOwners, ...company, ...Government])];
let allArray = [owner_city, owner_rural, inheritors_city, inheritors_rural, multipleOwners, company, Government];

var validateFunctionsArray = [validateMandatoryInput, validateMandatoryRadioInput, validateMandatoryCheckboxInput, validateMandatorydropDownList, validateMandatoryPrivateIndividualClass, validateAttachment, validateTotalRequestMeters, GSMValidation]
const fileExtensionType = ['pdf', 'png'];

$(document).ready(function () {

    initialize();
    $("#YourPhoneNumber").on("blur", function () {
        var phoneNumberInput = $(this).val();
        var parsedPhoneNumber = libphonenumber.parsePhoneNumberFromString(phoneNumberInput, "US"); // Replace "US" with the default country code

        if (parsedPhoneNumber) {
            // If a valid phone number, update the input value with the formatted version
            var formattedPhoneNumber = parsedPhoneNumber.formatInternational();
            $(this).val(formattedPhoneNumber);
        } else {
            // Handle invalid phone numbers
        }
    });

    $("#language-toggle").change(function () {
        // Check if the checkbox is checked (on) or not (off)
        if ($(this).is(":checked")) {
            // Checkbox is checked (on), so the language is EN
            language = 'ar-SA';
            fillDictionary(language)
            //translateText(language);
            translateToArabic();
            console.log("Language is AR");
        } else {
            // Checkbox is not checked (off), so the language is عربي
            language = 'en-US';
            fillDictionary(language);
            //translateText(language);
            translateToEnglish();
            console.log("Language is EN");
        }
    });

    $('#ApplicationType input[type=radio]').change(function () {
        showHideAccordingApplicationType($(this));
    })

    $('#CustomerClass input[type=radio]').change(function () {
        hideAllAttachment()
        hideShowControlsCustomerClass($(this))
    })

    $('#PrivateClass input[type=radio]').change(function () {
        $('.private').find('span').css('visibility', 'hidden');
        console.log($(this).val())
        hideAllAttachment()
        hideShowControlsPrivateClass($(this));
    })

    $('#CityOrRural').on('change', function () {
        var cityRural = $(this).find("input[type='radio']:checked").val();
        var individualClass = $('#IndividualClassDropDown').val();

        hideAllAttachment()
        hideShowControlsIndividualClass(individualClass, cityRural)
    })

    $('#IndividualClassDropDown').on('change', function () {
        var individualClass = $(this).val();
        var cityRural = $("#CityOrRural input[type='radio']:checked").val();
        if (individualClass != undefined) {
            $('.individual').find('span').css('visibility', 'hidden');
        }
        hideAllAttachment()
        hideShowControlsIndividualClass(individualClass, cityRural);
    })

    $('#NumberOfRequestedSinglePhaseCustomer').change(function () {
        valueA = $(this).val();
        if (valueA >= 0) {
            sum();
        }
    })
    $('#NumberOfRequestedThreePhaseMeters').change(function () {
        valueB = $(this).val();
        if (valueB >= 0) {
            sum();
        }
    })
    $('#NumberOfRequestedCTMeters').change(function () {
        valueC = $(this).val();
        if (valueC >= 0) {
            sum();
        }
    })

    $('.input-container').on('click', "input[type = 'radio' ]", function () {
        var current = $(this).attr('id');
        $('.radio-button-list').find("input[type ='radio']").map(function () {
            if ($(this).val() == current) {
                $(this).prop('checked', true).change();
            };
        });
    });

    $('.input-container-mini').on('click', "input[type = 'radio' ]", function () {
        var current = $(this).attr('id');
        $(this).parent().parent().parent().find('table').find("input[type ='radio']").map(function () {
            if ($(this).val() == current) {
                $(this).prop('checked', true).change();
            };
        });
    })


    $('.input-container-receive').on('click', "input[type = 'checkbox' ]", function () {
        var currentCart = $(this).attr('id');
        $('.checkbox-list').find("input[type ='checkbox']").map(function () {
            if ($(this).val() == currentCart) {
                $(this).prop('checked', !$(this).prop('checked'));
            };
        });
    });

    $('.ms-dtinput input').on('focus', function () {
        ShowCalendar($(this))
    })

    $(document).on('click', '.icon-close', function () {
        InitialiseAttachmentLabels($(this));
    })

    // Open the image or the pdf in another tab when you click the a tag 
    $('.custom-file-upload').on('click', function () {
        $(this).css('border', '2px dashed #cacaca;')
        aspControlAttachmentListener($(this));
    });

    $('#DateTimeTemporaryConnectionFromDate').on('focus', function () {
        temporaryDate = $(this).val();
        duration = $('#DurationOfTemporaryConnectio').val();

        addDuration(temporaryDate, duration);
    });

    $('#DurationOfTemporaryConnection').on('change', function () {
        temporaryDate = $('#DateTimeTemporaryConnectionFromDate').val();
        duration = $(this).val();

        addDuration(temporaryDate, duration);
    });

    $("input[type='file']").on('change', function () {
        console.log($(this).val())
        if ($(this).val() != '') {
            $(this).parent().find('.custom-file-upload').css('border', '2px dashed #cacaca')
        }

    });

    $(".form-section .header").on("click", function () {

        collapse($(this));
    });

    $('#ReceiveGreenBill').on('change', function () {
        if ($(this).val() != '') {
            $(this).closest('.form-field').find('.requiredField').css('visibility', 'hidden');
        }
    });

    $('#btnCancel').on('click', function () {
        clearFormElements();
    });

    $('#DateTimeExpectedDateOfConnectionDate').on('change', function () {
        if ($(this).val() != '') {
            $(this).closest('.form-field').find(".requiredField").css('visibility', 'hidden');
        }
    });

    // $('#GSMInternational').on('change', checkGSMInternationalInput);

    $('.mandatory').on('change', function () {
        if ($(this).val() != '') {
            $(this).parent().find('label span').css('visibility', 'hidden')
        }
    })

    $(".radio-button-list.mandatory").on('change', function () {
        $(this).closest('.form-field').find('label span').css('visibility', 'hidden')
    })

    $('#SubmitButton').on('click', function () {
        console.log('clicked btn')
    })

    $('#GSMInternational').on('change', GSMValidation);

});

// Initilize all needed variables, hide inputs and set values by default

function initialize() {
    $('.ms-dtinput').click(function () {
        ShowCalendar($(this));
    });

    $('#IndividualClassDropDown').val('');
    $('.ms-dtinput').find('img').attr('src', 'http://sharepoint2016:99/Site%20Assets/Icons/calendar.png');
    $('#PrivateClass').closest('.form-field').hide();
    $('#IndividualClassDropDown').closest('div').hide();
    $('#ApplicationTypeRadioButtonList').hide();
    $('.checkbox-list').hide();
    $('.radio-button-list').hide();
    $("input[type='file']").hide();
    $('#DateTimeTemporaryConnectionFromDate').closest('div').hide();
    $('#DurationOfTemporaryConnection').closest('div').hide();
    $('#TemporaryConnectionTo').closest('div').hide();
    $('#NumberOfRequestedSinglePhaseCustomer').val('0');
    $('#NumberOfRequestedThreePhaseMeters').val('0');
    $('#NumberOfRequestedThreePhaseMeters').val('0');
    $('.attach-header').css('visibility', 'hidden');
    $('*').css('font-family', '');
    $('.validationMSG').css('visibility', 'hidden');
    // $('.radio-button-list').each( function () {
    //     $(this).find('input[type=radio]:checked').val('');
    // }) 
    sum();
    hideAllAttachment();
    globalGSMFunction();
    //fillDictionary("en-US");
}

function globalGSMFunction() {
    var input = $("#GSMInternational");
    
    iti = window.intlTelInput(input[0], {
        initialCountry: "auto",
        geoIpLookup: function (callback) {
            fetch("https://ipapi.co/json")
            .then(function(res) {return res.json();})
            .then(function(data){console.log(data); callback(data.country_code);})
            .catch(function() {callback("us");});
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.min.js"
    });
}

function GSMValidation () {
    var isValidGSMInernational = true;

    var input = $("#GSMInternational");
    const errorMsg = $('.validationMsg');

    if (input.val().trim()) {
        if (iti.isValidNumber()) {
            errorMsg.css('visibility', 'hidden');
        } else {
            var errorCode = iti.getValidationError();
            console.log(errorCode);
            if (errorCode !== -1) {
                errorMsg.css('visibility', 'visible');
                isValidGSMInernational = false;
            }
        }
    }
    return isValidGSMInernational;
}

function fillDictionary(language) {
    const url = "https://cdn.jsdelivr.net/gh/Nourjawhari/nama1@main/dictionary.txt";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            // 'data' contains the parsed JSON data (the dictionary array)
            // Now you can use the 'data' in your translation function
            translateText(data, language); // Replace 'en-US' with the desired language code
        })
        .catch(error => {
            console.error("Error fetching JSON:", error);
        });
}

function translateText(dictionary, lng) {
    let toTranslate = $('.translatable');

    toTranslate.each(function () {
        if ($(this).is('input')) {
            $(this).val(getFromDictionary(($(this).val().trim()), dictionary, lng))
        } else {
            $(this).text(getFromDictionary(($(this).text().trim()), dictionary, lng))
        }
    });
}

function getFromDictionary(text, dictionary, toLanguage) {
    for (var i = 0; i < dictionary.length; i++) {

        var entry = dictionary[i];

        if (entry["en-US"] === text) return entry[toLanguage];
        if (entry["ar-SA"] === text) return entry[toLanguage];
    }

    return 'Translation not found';
}

function translateToArabic() {
    $('*').css('font-family', 'Lateef, serif !important');
    $('.form-container .form-section .header').css('flex-direction', 'row-reverse');
    $('.section-container .container').css('flex-direction', 'row-reverse');
    $('.section-container .container .radio-tile-group').css('flex-direction', 'row-reverse');
    $('.form-fields').css('flex-direction', 'row-reverse');
    $('.form-field').css('flex-direction', 'row-reverse');
    $('.form-field-label').css('flex-direction', 'row-reverse');
    $('.form-field label').css('text-align', 'right');
    $('.text-field').css('text-align', 'right');
    $('.submit-btn').css('flex-direction', 'row-reverse');
    $('.dropdown-list').css('direction', 'rtl');
    $('.ms-dtinput input').css('text-align', 'right');
    $('.grid-attachment').css('flex-direction', 'row-reverse');
    $('#notes').css('text-align', 'right');
    $('.file-type-message').css('text-align', 'right');
    $('.requiredField.validationMSG').css('flex-direction', 'row-reverse');
}

function translateToEnglish() {
    $('*').css('font-family', 'Poppins, sans-serif !important');
    $('.form-container .form-section .header').css('flex-direction', 'row');
    $('.section-container .container').css('flex-direction', 'row');
    $('.section-container .container .radio-tile-group').css('flex-direction', 'row');
    $('.form-field').css('flex-direction', 'row');
    $('.form-fields').css('flex-direction', 'row');
    $('.form-field-label').css('flex-direction', 'row');
    $('.form-field label').css('text-align', 'left');
    $('.text-field').css('text-align', 'left');
    $('.submit-btn').css('flex-direction', 'row');
    $('.dropdown-list').css('direction', 'ltr');
    $('.ms-dtinput input').css('text-align', 'left');
    $('.grid-attachment').css('flex-direction', 'row');
    $('#notes').css('text-align', 'left');
    $('.file-type-message').css('text-align', 'left');
    $('.requiredField.validationMSG').css('flex-direction', 'row');
}
// function to calculate the sum of A+B+C

function sum() {
    var valueA = $('#NumberOfRequestedSinglePhaseCustomer').val();
    var valueB = $('#NumberOfRequestedThreePhaseMeters').val();
    var valueC = $('#NumberOfRequestedCTMeters').val();
    var sum = parseInt(valueA) + parseInt(valueB) + parseInt(valueC);
    if (sum > 0) {
        $('#TotalRequestedMeters').next('span').css('display', 'none');
    }
    $('#TotalRequestedMeters').val(sum).change();
}

// function to caluculate the new date using date and duration in month 

function addDuration(startDateString, duration) {
    if ($('#DurationOfTemporaryConnection').val() == '') {
        duration = 0;
    } else {
        duration = parseInt($('#DurationOfTemporaryConnection').val());
    }
    let startDate = new Date(startDateString);
    let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + duration, startDate.getDate());
    let formattedEndDate = (endDate.getMonth() + 1).toString().padStart(2, '0') + '/' + endDate.getDate().toString().padStart(2, '0') + '/' + endDate.getFullYear();
    $('#TemporaryConnectionTo').val(formattedEndDate);
}

// function to show the calender when you press the image 

function ShowCalendar(currentInput) {
    currentInput.find('.ui-datepicker-trigger').trigger('click');
}

//Function to display the file link and the close icon
// FileInput is the input[type='file'] and the current is the label (the dashed box)
function displayUploadedFile(fileInput, event) {
    let files = event.target.files;
    if (files && files.length > 0) {
        let fileName = files.item(0).name;
        let fileExtension = fileName.split('.').pop().toLowerCase();
        var current = fileInput.parent().find('.custom-file-upload');

        if (fileExtensionType.includes(fileExtension)) {
            console.log(current);
            displayControlsWhenDesiredFileExtensionPresent(current, fileName);
        }
        else {
            displayErrorMsgWhenDesiredFileExtensionAbsent(current, fileInput);
        }
    }
}


//Function to open the attachment link in a new tab 
function openUploadedFile(current, event) {
    const file = event.target.files[0];
    $('.uploadedFile').on('click', function () {
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                let newWindow = window.open("", "_blank");

                console.log('opened window')
                const preview = $("<iframe style ='width: 100% !important; height: 100% !important;'>");
                preview.attr('src', e.target.result);
                $(newWindow.document.body).html("<h1>New Window</h1>");
                $(newWindow.document.body).html('').append(preview);
            }
            reader.readAsDataURL(file);
        }
    })
}

// Function to display the first view of attachment (icon,text )
function InitialiseAttachmentLabels(currentItem) {

    let current = currentItem.parent();
    current.find('.icon').css('display', 'block');
    current.find('.text').text('');
    currentItem.css('display', 'none');
    current.find('.text').text('Click to upload png or pdf');
    currentItem.parent().parent().find('input[type=file]').val('');
    current.on('click', function () {
        aspControlAttachmentListener($(this))
    })
}

// Listener to asp attachment control help to display the link of uploaded file and to open it in the current attachment
function aspControlAttachmentListener(current) {
    var fileInput = current.next("input[type='file']");

    fileInput.click();

    fileInput.on('change', function (event) {
        displayUploadedFile(fileInput, event);
        openUploadedFile(current, event);
    })
}

// Form Validation

function validateForm() {

    var isFormValid = true;

    $.each(validateFunctionsArray, function (index, func) {
        
        if (!func()) {
            console.log(index + "function" + func())
            isFormValid = false;
        }
    });


    if (!isFormValid || !Page_ClientValidate()) {
        return false; // Prevent form submission
    } else {
        selectedArray = selectedArray.split(',');
        const commonElements = AllElements.filter(item => selectedArray.includes(item));
        const differentElements = AllElements.concat(selectedArray).filter(item => !commonElements.includes(item));

        alert('different: ' + differentElements)
        differentElements.forEach(item => {
            $('#' + item).val(0);
        })

        this.submit()
    }
}
// Function to hide attchment when the id is present in the currentArray 
function hideAttachment(currentArray) {
    console.log(typeof (currentArray))
    currentArray.map(arr => {
        $('#' + arr).hide();
    })
}

// Function to show attchment when the id is present in the currentArray 
function showAttachment(currentArray) {
    currentArray.map(arr => {
        $('#' + arr).show();
    })
}

// Hide/Show controls when the customer class change if it's government they have a controls will be hide and if the value is private we have a controls will be appear 
function hideShowControlsCustomerClass(current) {
    $('#IndividualClassDropDown').prop('checked', false);
    $('#individual, #company').prop('checked', false);
    $('#PrivateClass input[type="radio"]').prop('checked', false);
    if (current.val() == 'private') {
        $('.private').show();
        if ($('.private').val() == '') {
            selectedArray = []
        }
    } else if (current.val() == 'government') {
        $('.private').hide();
        $('#IndividualClassDropDown').closest('div').hide();
        $('.private').prop('required', false);
        selectedArray = Government;
        hideShowAttachment(Government)
    }
}

//Hide/Show controls when the private class change if it's company they have a controls will be hide and if the value is individual we have a controls will be appear 
function hideShowControlsPrivateClass(current) {
    if (current.val() == 'individual') {
        $('#individual').prop('checked', true);
        $('#IndividualClassDropDown').closest('div').show();
        if ($('#IndividualClassDropDown').val() == null) {
            $('#IndividualClassDropDown').val('empty');
        }
        $('#IndividualClassDropDown').prop('required', true);
        if ($('#IndividualClassDropDown').val() == '') {
            selectedArray = [];
        }
    } else if (current.val() == 'company') {
        $('#company').prop('checked', true);
        $('#IndividualClassDropDown').closest('div').hide();
        $('#IndividualClassDropDown').prop('required', false);
        hideShowAttachment(company);
        selectedArray = company;
    }
}

// Function to indicate the specific value of the show/hide array refer to individual class option and the city or rural 
function hideShowControlsIndividualClass(individualClass, cityRural) {
    if ((individualClass == 'Owner') && (cityRural == 'city')) {
        hideShowAttachment(owner_city);
        selectedArray = owner_city;
    } else if ((individualClass == 'Owner') && (cityRural == 'rural')) {
        hideShowAttachment(owner_rural);
        selectedArray = owner_rural;
    } else if ((individualClass == 'Inheritors') && (cityRural == 'city')) {
        hideShowAttachment(inheritors_city)
        selectedArray = inheritors_city
    } else if ((individualClass == 'Inheritors') && (cityRural == 'rural')) {
        hideShowAttachment(inheritors_rural)
        selectedArray = inheritors_rural
    } else if (individualClass == 'MultipleOwners') {
        hideShowAttachment(multipleOwners)
        selectedArray = multipleOwners
    } else {
        selectedArray = [];
    }
}

//Function to hide all attchment array and show the current one
function hideShowAttachment(current) {
    console.log(typeof (current))
    array = $.grep(allArray, function (element) {
        return element !== current;
    });
    array.map(arr => {
        hideAttachment(arr);
    })
    $('.attach-header').css('visibility', 'visible');
    $('#notes').css('display', 'block');
    showAttachment(current);
}

// Function to hide all attachment used in the initialise and when you have a control change  
function hideAllAttachment() {
    $('.attach-header').css('visibility', 'hidden');
    $('#notes').css('display', 'none');
    allArray.map(arr => {
        hideAttachment(arr);
    })
}

//Function to remove the listener form the label, to add the delete icon and the file name and if necessary remove the error msg
//The current is the .custom-file-upload in the attchment (label)
function displayControlsWhenDesiredFileExtensionPresent(current, fileName) {
    // Remove listener 
    current.off('click');

    current.find('.icon').css('display', 'none');
    current.find('.text').text('');
    current.find('.icon-close').css('display', 'block');
    current.find('.text').append(`<a class='uploadedFile'>${fileName}</a>`);
    current.removeClass('border-red');
    current.parent().find('.file-type-message').css('display', 'none');
}

//Function to display the error msg when the file extension is not the desired one and to empty the file input 
//The current is the .custom-file-upload in the attchment (label) and the file input is the input[type='file']
function displayErrorMsgWhenDesiredFileExtensionAbsent(current, fileInput) {
    // Invalid file type, handle the error
    //var errorMessage = $('<span class="file-type-message error_red">Please upload a PDF or PNG file.</span>');
    // Find the parent form-field element and append the error message to it
    fileInput.closest('.form-field').find('.file-type-message').css('display', 'block');
    current.addClass('border-red');
    // Clear the file input
    fileInput.val(null);

}

function collapse(currentheader) {
    var content = currentheader.next();
    if (content.css("display") === "block" || content.css("display") === "flex") {
        content.removeClass('displayClass');
        currentheader.find('.icons-header .minus-icon').css('display', 'none');
        currentheader.find('.icons-header .plus-icon').css('display', 'block');
    } else {
        content.addClass('displayClass');
        currentheader.find('.icons-header .minus-icon').css('display', 'block');
        currentheader.find('.icons-header .plus-icon').css('display', 'none');
    }
}

function showHideAccordingApplicationType(currentType) {
    if (currentType.val() == 'TemporaryConnection') {
        $('#DateTimeTemporaryConnectionFromDate').closest('div').show();
        $('#DurationOfTemporaryConnection').closest('div').show();
        $('#TemporaryConnectionTo').closest('div').show();
    } else {
        $('#DateTimeTemporaryConnectionFromDate').closest('div').hide();
        $('#DurationOfTemporaryConnection').closest('div').hide();
        $('#TemporaryConnectionTo').closest('div').hide();
    }
}

function clearFormElements() {
    console.log('clear')
    $('input[type="text"]').val("");
}

// Function to check the syntax GSM international input it should be +***-******** using regular expression


function validateMandatoryInput() {
    var count = 0;
    var countEmpty = 0;
    var isValidCurrentMandatoryInput = true;
    $('.mandatory').each(function () {
        count++;
        var currentMandatoryInput = $(this);
        var inputType = currentMandatoryInput.prop('type');

        if (inputType !== 'checkbox' && inputType !== 'radio') {
            if (currentMandatoryInput.val() == '') {
                currentMandatoryInput.parent().find('.requiredField').css('visibility', 'visible');
                //return false;
                countEmpty++;
                console.log('currentInputEmpty' + $(this).html())
                isValidCurrentMandatoryInput = false;
            } else {
                currentMandatoryInput.parent().find('.requiredField').css('visibility', 'hidden');
            }
        }
    })
    console.log('mandatory Input ' + count);
    console.log('mandatory Empty Input ' + countEmpty);

    return isValidCurrentMandatoryInput;
}

function validateMandatoryRadioInput() {
    var isValidCurrentMandatoryRadioInput = true;

    $('.form-field.double-radio-buttons').each(function () {
        var groupValid = false;
        var radioButtons = $(this).find('input[type="radio"]');
        radioButtons.each(function () {
            if ($(this).is(':checked')) {
                groupValid = true;
                return false; // Stop the loop, we found a checked radio button
            }
        });
        $(this).find('.requiredField').css('visibility', groupValid ? 'hidden' : 'visible');

        // Update the overall form validation state
        if (!groupValid) {
            isValidCurrentMandatoryRadioInput = false;
        }
    });
    return isValidCurrentMandatoryRadioInput;
}

function validateMandatoryCheckboxInput() {
    ``
    var isValidCurrentMandatoryCheckboxInput = true;
    $('.form-field.checkbox-group').each(function () {
        var groupValid = false;
        var checkboxes = $(this).find("input[type='checkbox']");

        checkboxes.each(function () {
            if ($(this).is(':checked')) {
                groupValid = true;
                return false;
            }
        });
        console.log(checkboxes.val())
        console.log(groupValid)

        $(this).find('.requiredField').css('visibility', groupValid ? 'hidden' : 'visible');

        if (!groupValid) {
            isValidCurrentMandatoryCheckboxInput = false;
        }
        console.log(isValidCurrentMandatoryCheckboxInput);
    });
    return isValidCurrentMandatoryCheckboxInput;
}

function validateMandatorydropDownList() {
    var isValidCurrentMandatoryDropDownList = true;
    $('.form-field.drop-down').each(function () {
        var groupValid = false;
        var dropdowns = $(this).find('select');

        dropdowns.each(function () {
            if ($(this).val() !== 'empty') {
                groupValid = true;
                return false;
            }
        });

        $(this).find('.requiredField').css('visibility', groupValid ? 'hidden' : 'visible');

        if (!groupValid) {
            isValidCurrentMandatoryDropDownList = false;
        }
    });
    return isValidCurrentMandatoryDropDownList;
}

function validateMandatoryPrivateIndividualClass() {
    var isValidMandatoryPrivateIndividualClass = true;

    var customerClassValue = $('#CustomerClass').find("input[type='radio']:checked").val();
    var privateClassValue = $('#PrivateClass').find("input[type='radio']:checked").val();
    var individualClassvalue = $('#IndividualClassDropDown').val();

    if (customerClassValue == 'private') {
        if (privateClassValue == undefined) {
            console.log('private empty')
            $('.private').find('span').css('visibility', 'visible');
            isValidMandatoryPrivateIndividualClass = false;
        } else if (privateClassValue == 'individual') {
            if (individualClassvalue == '') {
                console.log('individual empty')
                $('.individual').find('span').css('visibility', 'visible');

                isValidMandatoryPrivateIndividualClass = false;
            }
        }
    }
    return isValidMandatoryPrivateIndividualClass;
}

function validateAttachment() {
    var id;
    var isValidAttachment = true;

    selectedArray.map(arr => {
        id = '#' + arr;
        if ($(id).find("input[type='file']").val() === '') {
            $(id).find('.custom-file-upload').css('border', '2px dashed red');
            isValidAttachment = false;
        }
    });

    return isValidAttachment;
}

function validateTotalRequestMeters() {
    var isValidTotalRequestMeters = true;
    var totalRequest = $('#TotalRequestedMeters');

    if (totalRequest.val() == 0) {
        console.log('total request is null')
        totalRequest.css('border', '1px solid red');

        totalRequest.parent().find('span').css('display', 'block');
        isErrorMessageAppended = true;
        isValidTotalRequestMeters = false;
    }

    return isValidTotalRequestMeters;
}


$('.ms-input').on('focus', function () {
    $(this).parent().next('td').find('a').trigger('click');
})

$('.ms-dtinput').on('click', function (e) {
    e.preventDefault(); // Prevent the default behavior of the link
    console.log('Link clicked!');
    // Do other actions you want when the link is clicked
});


