$(document).ready(function(){
    var access_token = getCookie("token");

    var time = document.getElementsByClassName('colon'); //Get all elements with class "time"
    for (var i = 0; i < time.length; i++) { //Loop trough elements
        
        time[i].addEventListener('keyup', function (e) {; //Add event listener to every element
            var reg = /[0-9]/;
            if ((this.value.length == 2 || this.value.length == 5 )&& reg.test(this.value)) this.value = this.value + "-"; //Add colon if string length > 2 and string is a number 
            if (this.value.length > 10) this.value = this.value.substr(0, this.value.length - 1); //Delete the last digit if string length > 5
        });
    
    
    };

    $.validator.setDefaults({
        errorClass: 'invalid-feedback',
        highlight: function(element) {
           
            $(element)
              .closest('.form-control')
              .addClass('is-invalid');
              //console.log(element.next())

           
          },
          unhighlight: function(element) {
           
            $(element)
              .closest('.form-control')
              .removeClass('is-invalid')
            
              
            
          },
        
        errorPlacement: function (error, element) {
         
            error.insertAfter(element);
          
        }
      });
    $.validator.addMethod('checkDOB', function(value, element) {
        var reg = /[0-9]/;
        var regex  = /[-]/;
        var reg1 = /[0-3]/;
        var reg2 = /[0-1]/;
        return this.optional(element) 
        || value.length === 10
        && reg1.test(value.charAt(0))
        && reg.test(value.charAt(1))
        && regex.test(value.charAt(2))
        && reg2.test(value.charAt(3))
        && reg.test(value.charAt(4))
        && regex.test(value.charAt(5))
        && reg.test(value.charAt(6))
        && reg.test(value.charAt(7)) 
        && reg.test(value.charAt(8))
        && reg.test(value.charAt(9)) ;
      }, 'Please provide date of birth in DD-MM-YYYY format');


    $("#userForm").validate({
        rules: {
            profileFirstName:{
                required: true,
                minlength: 3,

            } ,
            profileLastName:{
                required:true,
                minlength: 3,
               

            },
            profiledob:{
                required:true,
                checkDOB: true,
                

            },
            profileHeight:{
                required:true,
                

            },
            profileWeight:{
                required:true,
                

            },

            
        },
        messages: {
            profileFirstName:{
                required: "Please specify first name",
                minlength: "first name must be atleast 3 characters"

            } ,
            profileLastName:{
                required:"Please specify surname",
                minlength: "surname must be atleast 3 characters"
               

            },
            profiledob:{
                required:"Please specify date of birth",
                

            },
            profileHeight:{
                required:"Please specify height in cm",
                

            },
            profileWeight:{
                required:"Please specify weight in kgs",
                

            },
           
           
        }
    });

function getProfile(){
    var xhr = new XMLHttpRequest();
    xhr.responseType= 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/profile.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
   xhr.onload = function () {
if (xhr.status === 200) {
    const data = xhr.response;
    console.log(data);
    document.getElementById("profpic").src=data.user.avatar;
    document.getElementById("username").textContent=data.user.displayName;
    document.getElementById("full-name").textContent=data.user.fullName;
    document.getElementById("age").textContent="Age: "+data.user.age;
    document.getElementById("joinDate").textContent="Member since "+formatDate(data.user.memberSince);
     let name = (data.user.fullName).split(" ");
     let firstName = name[0];
     let lastName = name[1];

    $("#profileFirstName").val(firstName);
    $("#profileLastName").val(lastName);
    $("#profileGender").val(data.user.gender);
    $("#profiledob").val(formatDate(data.user.dateOfBirth));
    $("#profileHeight").val((data.user.height).toFixed(2));
    $("#profileWeight").val(data.user.weight);
    $("#startDay").val(data.user.startDayOfWeek);


   
}
else{
    console.log("Status:"+xhr.status);
}
};
xhr.send();



}

function getLifeTimeStats(){
    
    var xhr = new XMLHttpRequest();
    xhr.responseType= 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
   xhr.onload = function () {
if (xhr.status === 200) {
    const data = xhr.response;
    console.log(data);
    let best = data.best.total;
    let life = data.lifetime.total;
                    if(best.length === 0){
                       
    
                    }
                    if(best.length !== 0){
                   document.getElementById("bestDist").textContent = (best.distance.value).toFixed(2)+" km on " +formatDate(best.distance.date);
                   document.getElementById("bestFloors").textContent = (best.floors.value).toFixed(0)+" floors on " +formatDate(best.floors.date);
                   document.getElementById("bestSteps").textContent = (best.steps.value).toFixed(0)+" steps on " +formatDate(best.steps.date);
                  if(life.length === 0){
                  }
                  if(life.length !== 0){
                   document.getElementById("lifeDist").textContent = (life.distance).toFixed(2)+" km";
                   document.getElementById("lifeFloors").textContent = (life.floors).toFixed(0)+" floors";
                   document.getElementById("lifeSteps").textContent = (life.steps).toFixed(0)+" steps";
                  }
}
}
else{
    console.log("Status:"+xhr.status);
}
};
xhr.send();
}

$("#saveBtn").click(function(){
    var valid = $("#userForm").valid();
        if(valid === false){
           
        }
        else{
    let fname = $("#profileFirstName").val();
    let sname = $("#profileLastName").val();
    let gender = $("#profileGender").val();
    let dob = formatDate($("#profiledob").val());
    let height = $("#profileHeight").val();
    let weight = $("#profileWeight").val();
    let start = $("#startDay").val(); 
   // console.log(fname+sname+gender+dob+height+weight+start);
    var param = "fullname="+fname+" "+sname+"&gender="+gender+"&birthday="+dob+"&height="+height
    +"&weight="+weight+"&startDayOfWeek="+start

    var xhr = new XMLHttpRequest();
    xhr.responseType= 'json';
    xhr.open('POST', 'https://api.fitbit.com/1/user/-/profile.json?'+param);
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
   xhr.onload = function () {
if (xhr.status === 200) {
    const data = xhr.response;
    console.log(data);
    Swal.fire({
        icon: 'success',
        title: 'Your details have been saved!',
        timer: 1500
      });
    

   
}
else{
    console.log("Status:"+xhr.status);
    Swal.fire({
        icon: 'error',
        title: 'Something went wrong, try again!',
        timer: 1500
      });
}
};
xhr.send();


setTimeout(function(){
    getProfile();
},1000);
        }


});

getProfile();
getLifeTimeStats();

});

function formatDate(date){
    let split = date.split("-");
    let formattedDate = split[2]+'-'+split[1]+'-'+split[0];
    return formattedDate;
}