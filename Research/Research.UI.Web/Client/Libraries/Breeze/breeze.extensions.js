breeze.CustomValidator = breeze.CustomValidator || (function ()
{
    function CustomValidator()
    {
    }

    CustomValidator.prototype.Research_UI_Web_Validation_FieldValidators_StringLengthRangeAttribute = function (fieldName, fieldValue, fieldValidator)
    {
        var result = {
            message: "",
            isValid: true
        };

        if (!(fieldValue && fieldValue.length && fieldValue.length >= fieldValidator.Minimum && fieldValue.length <= fieldValidator.Maximum))
        {
            result.message = fieldName + " should be between " + fieldValidator.Minimum.toString() + " and " + fieldValidator.Maximum.toString() + ".";
            result.isValid = false;
        }
        
        return result;
    };

    return CustomValidator;
})();