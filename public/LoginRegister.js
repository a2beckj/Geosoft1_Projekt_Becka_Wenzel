// Projektaufgabe Geosoft 1, SoSe 2020 
//@author Judith Becka, 426693
//@author Felix Wenzel, 430483

  /**
   * @desc When document is ready, execute followiing functions:
   * - when button 'submit' is clicked, get values from input fields and call function getUsersFromMongo
   * - when button 'register' is clicked, get values from input fields and call function checkUsersRegister
   */
$(document).ready(function(){

  console.log(localStorage)
  $("#submit").click(function(){
      email_log=$("#email_log").val();
      pass_log=$("#password_log").val();
      getUsersFromMongo(email_log, pass_log)
    })

  $('#register').click(function(){
      email_reg=$("#email_reg").val();
      pass_reg=$("#password_reg").val();
      checkUsersRegister(email_reg, pass_reg);
      })
})
      

/**
 * @desc This function inserts the input values to MongoDB when registering
 * @param {string} email - given email adress
 * @param {string} pw - given password
 * @param {boolean} doctor - user is a doctor?
 */
function inputUserToMongo(email, pw, doctor){
  $.ajax({  url: "//localhost:3000/user",       
            type: "POST",
            data: {mail: email, pw: pw, doctor: doctor},
            success: function(x){
              console.log("eingefügt!")
              openApp(email, doctor);
            }
          })
}  

/**
 * @desc This function gets the users from MongoDB and calls function checkUsersSubmit
 * @param {string} email - users email  
 * @param {string} pass - users password
 */
function getUsersFromMongo(email, pass){
  $.ajax({  url: "//localhost:3000/user",      
            type: "GET",
            success: function(users){
                    checkUsersSubmit(users, email, pass);
                    }
        })
}

/**
 * @desc This function checks if the user that wants to register is already registered. If not
 * the new user will be input to MongoDB by calling function inputUserToMongo
 * @param {string} email_reg - users email to register
 * @param {string} pass_reg - users password to register
 */
function checkUsersRegister(email_reg, pass_reg){
  //get existing users
  $.ajax({  url: "//localhost:3000/user",     
  type: "GET",
  success: function(users){
  
    users.forEach(user => {
      // if mail already exists
      if(user.mail.indexOf(email_reg) > -1){
        alert('Nutzer existiert bereits');
        throw new Error ('Nutzer existiert bereits');
      }})
      // if password doesn't meet the requirements
      if(pass_reg.length < 6){
        alert('Passwort muss mindestens 6 Zeichen lang sein');
        throw new Error ('Passwort zu klein');
      }
      // check if user is a doctor
      if (document.getElementById('doctor').checked){
          var doctor = true;}
        else { var doctor = false}; 
      // input user to MongoDB
        inputUserToMongo(email_reg, pass_reg, doctor)
      }
    });
  
  }


/**
 * @desc This function checks if the given user exists and if the password is correct.
 * Then the according apps will be loaded.
 * If the user doesn't exist or the password is wrong, an error message will be thrown.
 * @param {array} users - the users from MongoDB
 * @param {string} email - given mail adress from input field
 * @param {string} pass - given password from input field
 */
function checkUsersSubmit(users, email, pass){
  // initialize counter
  var counter = 0;
  for (i=0; i< users.length; i++){
    
    // if mail exists in MongoDB
    if (users[i].mail == email){
      // if password is correct
      if (users[i].pw == pass){
        // open app
        openApp(email, users[i].doctor);

      }
      else {
        // wrong password given
      alert("falsches Passwort");
      throw new Error ('Falsches Passwort');
      }

    }
    // set counter +1
    else {counter += 1};
  }
  // when counter reached length of array, user is not in array
  if (counter == users.length){
    alert("Nutzer existiert nicht. Bitte registrieren.");
  }
}
  


/**
 * @desc This function opens the correct App, depending on whether the user is a doctor or not.
 * @param {string} email - users mail adress
 * @param {boolean} doctor - user a doctor?
 */
function openApp(email, doctor){
  //console.log(JSON.parse(doctor));
  // if user is a doctor
  if (JSON.parse(doctor)){
    localStorage.setItem('user', email);
 
    location.replace("http://localhost:3000/doctor")
  }
  // if user is not a doctor
  else{
    localStorage.setItem('user', email);
    location.replace("http://localhost:3000/userSelection")
  }
}