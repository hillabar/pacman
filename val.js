
  $.validator.setDefaults({
    errorClass: 'help-block',
    highlight: function(element) {
      $(element)
        .closest('.form-group')
        .addClass('has-error');
    },
    unhighlight: function(element) {
      $(element)
        .closest('.form-group')
        .removeClass('has-error');
    },
    errorPlacement: function (error, element) {
      if (element.prop('type') === 'checkbox') {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    }
  });
  $.validator.addMethod('strongPassword', function(value, element) {
    return this.optional(element)
      || value.length >= 8
      && /\d/.test(value)
      && /[a-z]/i.test(value);
  }, 'The password must be at least 8 characters long and contain at least one number and one char\'.');
  $.validator.addMethod('userExists', function(value, element) {
    return this.optional(element)
      || !(dictionary.keyExists(value));
  }, 'User name is exists.');
  $.validator.addMethod('validEmail', function(value, element) {
    return this.optional(element)
      || (value.trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/));
  }, 'not correct.');
  $.validator.addMethod('dateOfBirth', function(value, element) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
      dd = '0'+dd
    }

    if(mm<10) {
      mm = '0'+mm
    }
    var str = value.split("-");
    var year = str[0];
    var month = str[1];
    var day = str[2];
    return this.optional(element)
      || year <= yyyy
      && month <= mm
      && day <= dd;
  }, 'There date birth is not posible.');
  $.validator.addMethod('numOfPoints', function(value, element) {
    return this.optional(element)
      || value >=50
      && value <= 90;
  }, 'choose number between 50 and 90');

  $.validator.addMethod('minTime', function(value, element) {
    return this.optional(element)
      || value >= 60;
  }, 'the game shoud be at least 60 sec!');

  $("#register-form").validate({
    rules: {
      userName:{
        required: true,
        userExists: true
      },
      email: {
        required: true,
        email: true,
        validEmail: true
      },
      password: {
        required: true,
        strongPassword: true
      },
      password2: {
        required: true,
        equalTo: '#password'
      },
      firstName: {
        required: true,
        nowhitespace: true,
        lettersonly: true
      },
      lastName: {
        required: true,
        nowhitespace: true,
        lettersonly: true
      },
      birthday: {
        required: true,
        date: true,
        dateOfBirth:true
      },
    },
    messages: {
      email: {
        required: 'Please enter an email address.',
        email: 'Please enter a <em>valid</em> email address.',
      },
      userName:{
        required: 'Please enter a user name.'
      },
      firstName: {
        required: 'Please enter first name.',
      },
      lastName:{
        required: 'Please enter last name.',
      },
      password: {
        required: 'Please enter a password.',
      },
      password2:{
        required: 'Please enter a password again.',
      }
    }
  });

  $("#startGameForm").validate({
    rules: {
      points:{
        required: true,
        numOfPoints:true,
        digits: true
      },
      time:{
        required:true,
        minTime:true,
        digits: true
      }
    }
  });


  $('#submit-button').on('submit',(function ($) {

    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
      var check = true;

      for(var i=0; i<input.length; i++) {
        if(validate(input[i]) == false){
          showValidate(input[i]);
          check=false;
        }
      }

      return check;
    });


    $('.validate-form .input100').each(function(){
      $(this).on('focus',function(){
        hideValidate(this);
      });
    });

    function validate (input) {
      if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
        if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
          return false;
        }
      }
      else {
        if($(input).val().trim() == ''){
          return false;
        }
      }
    }

    function showValidate(input) {
      var thisAlert = $(input).parent();

      $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
      var thisAlert = $(input).parent();

      $(thisAlert).removeClass('alert-validate');
    }



  })(jQuery));



  $('#loginBut').on('submit',(function ($) {

    var input = $('.validate-input1 .input100');

    $('.validate-form1').on('submit',function(){
      var check = true;

      for(var i=0; i<input.length; i++) {
        if(validate(input[i]) == false){
          showValidate(input[i]);
          check=false;
        }
      }

      return check;
    });


    $('.validate-form1 .input100').each(function(){
      $(this).on('focus',function(){
        hideValidate(this);
      });
    });

    function validate (input) {
      if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
        if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
          return false;
        }
      }
      else {
        if($(input).val().trim() == ''){
          return false;
        }
      }
    }

    function showValidate(input) {
      var thisAlert = $(input).parent();

      $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
      var thisAlert = $(input).parent();

      $(thisAlert).removeClass('alert-validate');
    }


return false;
  })(jQuery));









