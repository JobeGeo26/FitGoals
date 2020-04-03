$(document).ready(function(){
    $('.editableColumns').forceNumeric();
    $('.weightEditable').forceNumeric();
    $('.logtext').forceNumeric();
    var access_token = getCookie("token");
    var userId = localStorage.getItem("userId");
    var currentWeight = 0;
    var currentWeightGoal = 0;
    var startWeight = 0;
    var foodgoal = 0;

   
    var time = document.getElementsByClassName('colon'); //Get all elements with class "time"
    for (var i = 0; i < time.length; i++) { //Loop trough elements

        time[i].addEventListener('keyup', function (e) {; //Add event listener to every element
            var reg = /[0-9]/;
            if ((this.value.length == 2 || this.value.length == 5 )&& reg.test(this.value)) this.value = this.value + "-"; //Add colon if string length > 2 and string is a number 
            if (this.value.length > 10) this.value = this.value.substr(0, this.value.length - 1); //Delete the last digit if string length > 5
        });


    };

    function getProfile(){
        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/profile.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
       xhr.onload = function () {
    if (xhr.status === 200) {
        const data = xhr.response;
        console.log(data);
        if(data.user.gender === "MALE"){
        $("#gender").val(1);
        }
        else{
            $("#gender").val(2);
        }

        $("#height").val((data.user.height).toFixed(2));
        $("#weight").val(data.user.weight);
        
        if(data.user.age <= 46){
            console.log("inside age")
        document.getElementById("proteinInfo").textContent = "We suspect that people your age are interested in heavy weight training and muscle mass, try aiming for 2.2 grams per kg for protein intake"
        $("#proteinpercent").val(2.2);
        let proteinVal = (2.2 * data.user.weight).toFixed(0);
        $("#proteingrams").text(proteinVal+ " grams");

        document.getElementById("proteinInfo2").textContent = "We suspect that people your age are interested in heavy weight training and muscle mass, try aiming for 2.2 grams per kg for protein intake"
        $("#proteinpercent2").val(2.2);
        let proteinVal2 = (2.2 * data.user.weight).toFixed(0);
        $("#proteingrams2").text(proteinVal2+ " grams");

        }

        if(data.user.age > 46){
            document.getElementById("proteinInfo").textContent = "We suspect that people your age may not be interested in heavy weight training and muscle mass, so try aiming for 0.8 gram per kg for protein intake"
        $("#proteinpercent").val(0.8);
        let proteinVal = (0.8 * data.user.weight).toFixed(0);
        $("#proteingrams").text(proteinVal+ " grams");

        document.getElementById("proteinInfo2").textContent = "We suspect that people your age may not be interested in heavy weight training and muscle mass, so try aiming for 0.8 gram per kg for protein intake"
        $("#proteinpercent2").val(0.8);
        let proteinVal2 = (0.8 * data.user.weight).toFixed(0);
        $("#proteingrams2").text(proteinVal2+ " grams");

        }

        if(data.user.age <= 50 && data.user.gender === "MALE"){
            $("#fiberInfo").text("According to your age and sex we recommend you pick a middle value of 34 grams");
            $("#fibergrams").text(34 +" grams");
            $("#fiberInfo2").text("According to your age and sex we recommend you pick a middle value of 34 grams");
            $("#fibergrams2").text(34 +" grams");
        }

        if(data.user.age <= 50 && data.user.gender === "FEMALE"){
            $("#fiberInfo").text("According to your age and sex we recommend you pick a middle value of 23 grams");
            $("#fibergrams").text(23 +" grams");
            $("#fiberInfo2").text("According to your age and sex we recommend you pick a middle value of 23 grams");
            $("#fibergrams2").text(23 +" grams");
        }
        if(data.user.age > 50 && data.user.gender === "FEMALE"){
            $("#fiberInfo").text("According to your age and sex we recommend you pick a value of 25 grams ");
            $("#fibergrams").text(21 +" grams");
            $("#fiberInfo2").text("According to your age and sex we recommend you pick a value of 25 grams ");
            $("#fibergrams2").text(21 +" grams");

        }
        if(data.user.age > 50 && data.user.gender === "MALE"){
            $("#fiberInfo").text("According to your age and sex we recommend you pick a middle value of 34 grams");
            $("#fibergrams").text(30 +" grams");
            $("#fiberInfo2").text("According to your age and sex we recommend you pick a middle value of 34 grams");
            $("#fibergrams2").text(30 +" grams");
        }

        $("#age").val(data.user.age);
       
    
    
       
    }
    else{
        console.log("Status:"+xhr.status);
    }
    };
    xhr.send();
    
    
    
    }
    
function getDailyActivityGoals(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/goals/daily.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            console.log(data);
            const steps = data.goals.steps;
            const calOutval = data.goals.caloriesOut;
            const activeMinutes = data.goals.activeMinutes;
            const distVal = data.goals.distance;

            document.getElementById("stepval").textContent = steps+" steps";
            document.getElementById("activeMins").textContent = activeMinutes+" mins";
            document.getElementById("calOutval").textContent = calOutval +" kcal";
            document.getElementById("distval").textContent = distVal +" km";
           
        }
        else{
            console.log("Status:"+xhr.status);
        }
    };
    xhr.send();

}

function getWeightGoals(){
    return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/body/log/weight/goal.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            let date= formatDate(data.goal.startDate);
            document.getElementById("startDate").textContent = date;
            document.getElementById("startweight").textContent = data.goal.startWeight+" kg";
            document.getElementById("GoalWeight").textContent = data.goal.weight+" kg";
            currentWeightGoal = data.goal.weight;
            startWeight = data.goal.startWeight;
            resolve();
           
        }
        else{
            console.log("Status:"+xhr.status);
        }
    };
    xhr.send();
    });

}

function getFoodGoals(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/foods/log/goal.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            console.log(data);
            document.getElementById("foodCals").textContent = data.goals.calories+ " kcal";
            foodgoal = data.goals.calories;
            document.getElementById("intensity").textContent = data.foodPlan.intensity;
            if(data.foodPlan.estimatedDate != undefined){
            document.getElementById("endDate").textContent = formatDate(data.foodPlan.estimatedDate);
            }
            else{
                document.getElementById("endDate").textContent = "N/A";
            }

            
        }
        else{
            console.log("Status:"+xhr.status);
        }
    };
    xhr.send();

    


}

function getWeightLogs(){
    var rows = $('#weightlog tbody tr').length;
    console.log("rows:"+rows);
    var index= 0;
    var table= document.getElementById('weightlog').getElementsByTagName('tbody')[0];
    if(rows>0){
        while(rows !=0){
            var index= rows-1;
            table.deleteRow(index);
            rows--;
    }
    }
    let date = new Date();
    let year = date.getFullYear();
    let mnth = (date.getMonth()+1);
    var month="";
    if(mnth <10){
     month = "0"+mnth;
    }
    else{
        month = mnth
    }
    let d = date.getDate();
    var day ="";
    if(d <10){
        day = "0"+d;
       }
       else{
           day = d
       }
    let baseDate = +year+'-'+month+'-'+day;
    console.log(baseDate);
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/body/log/weight/date/'+baseDate+'/1m.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            console.log(data);
            for(var i =data.weight.length-1 ; i>=0; i--){
                let tableRef = document.getElementById('weightlog').getElementsByTagName('tbody')[0];
                var newRow   = tableRef.insertRow();

                 var date  = newRow.insertCell(0);
                 var dateText  = document.createTextNode(formatDate(data.weight[i].date));
                 date.appendChild(dateText);
                 var time  = newRow.insertCell(1);
                 var timeText  = document.createTextNode(data.weight[i].time);
                 time.appendChild(timeText);
                 var weight  = newRow.insertCell(2);
                 var weightText  = document.createTextNode(data.weight[i].weight+" kg");
                 weight.appendChild(weightText);
                 var bmi  = newRow.insertCell(3);
                 var bmiText  = document.createTextNode(data.weight[i].bmi);
                 bmi.appendChild(bmiText);
                 var manage  = newRow.insertCell(4);
                 var deleteButton =document.createElement("input");
                 deleteButton.type ="button";
                 deleteButton.value = "Delete";
                 let logID = data.weight[i].logId;
                 deleteButton.onclick = function(){deleteLog(logID);};
                 manage.appendChild(deleteButton);

                
            }
            if( data.weight[data.weight.length-1]!= undefined){
            currentWeight = data.weight[data.weight.length-1].weight;
            }
            else{
                currentWeight =0;
            }
           
            getWeightProgress();
            getFoodGoals();
        }
        else{
            console.log("Status:"+xhr.status);
        }
    };
    xhr.send();
    
   
    

}

function deleteLog(logID){
    var xhr = new XMLHttpRequest();
    xhr.responseType= 'json';
      xhr.open('DELETE', 'https://api.fitbit.com/1/user/-/body/log/weight/'+logID+'.json?');
     xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
   xhr.onload = function () {
if (xhr.status === 204) {
    const data = xhr.response;
    console.log("status"+xhr.status+" data:"+data);
    Swal.fire({
        icon: 'success',
        title: 'Your Log has been deleted!',
        timer: 1500
      });
      getWeightLogs(); 
   
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




}

$('.editFood').click(function () {
    $(this).prop('disabled', true);
    $(this).parents('td').find('.saveFood').prop('disabled', false);
    if(currentWeightGoal - currentWeight <=0){

    $(this).parents('tr').find('td.foodEditableList').each(function() {
      var html = $(this).html();
      var numbers = html.split(" ");
      var input = $('<select id="myList"><option class="editableColumnsFoodStyle" value="EASIER" >Easier(-250 kcals)</option><option class="editableColumnsFoodStyle" value="MEDIUM">Medium(-500 kcals)</option><option class="editableColumnsFoodStyle" value="KINDAHARD" >Kinda Hard(-750 kcals)</option><option class="editableColumnsFoodStyle" value="HARDER" >Harder(-1,000 kcals)</option></select>');
      input.val(numbers[0]);
      $(this).html(input);
    });


}
else{
    $(this).parents('tr').find('td.foodEditableList').each(function() {
        var html = $(this).html();
        var numbers = html.split(" ");
        var input = $('<select id="myList"><option class="editableColumnsFoodStyle" >MAINTENANCE</option></select>');
        input.val(numbers[0]);
        $(this).html(input);
        
      });

}
    
  });
 
  $('.editNutrition').click(function () {
    $(this).prop('disabled', true);
    $(this).parents('td').find('.saveNutrition').prop('disabled', false);
    var index = 1;
    var i = 1;
    $(this).parents('tr').find('td.nutritionEditable, td.nutritionAmount').each(function() {
        if($(this).hasClass("nutritionEditable")){
       let  id = "nutval" + index;
      var html = $(this).html();
      var numbers = html.split(" ");
      var input = $('<select id="'+id+'"><option value="Carbohydrates">Carbohydrates</option><option value="Protein" >Protein</option><option value="Fiber">Fiber</option><option value="Fats">Fats</option></select>');
      input.val(numbers[0]);
      $(this).html(input);
      index++;
        }
        else{
            let  id = "nutAmount" + i;
            var html = $(this).html();
            var numbers = html.split(" ");
            var input = $('<div style="position:relative;margin-bottom:10px;" class="buttonInside"><input style="height:30px;width:100%;padding-left:10px;border-radius: 4px;border:none;outline:none;" class="editableColumnsStyle" id="'+id+'" placeholder="grams" type="text" /><button style="position:absolute; right: 0px; top: 3px;border:none;height:25px;width:25px;border-radius:100%;outline:none;font-weight:bold;" id="showInfo'+i+'" data-toggle="modal" data-target="#nutInfo'+i+'">?</button></div>');
           // var input = $('<input type="number" id="'+id+'" placeholder="grams" style="height: 85%; width:85%;" />');
            input.find("#"+id).val(numbers[0]);
            $(this).html(input);
            i++;

        }
        
    });
    let table = $("#nutrition");
    disableUsedOptions(table);

  });

  $('.saveNutrition').click(function () {
      document.getElementById("gMessage").textContent = null;
      let nutrition1 = $("#nutval1").val();
      let amount1 = $("#nutAmount1").val();
      let nutrition2 = $("#nutval2").val();
      let amount2 =  $("#nutAmount2").val();
      console.log(nutrition1, amount1,nutrition2,amount2);
      var param = {user_id: userId,
        nutrition_val1:nutrition1 , 
        nutrition_amount1:amount1, 
        nutrition_val2:nutrition2,
        nutrition_amount2:amount2};
        var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
        xhr.open('POST', '/updateNutrition');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log(xhr.response);
                getNutritionGoals();
               
                Swal.fire({
                    icon: 'success',
                    title: 'Your Goal has been saved!',
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
        console.log(param);
        xhr.send(JSON.stringify(param));
        $(this).prop('disabled', true);
        $(this).parents('td').find('.editNutrition').prop('disabled', false);

});

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
    
  });

$("#calculate").validate({
    rules: {
        weight:{
            required: true

        } ,
        height:{
            required:true,
           

        },
        age:{
            required:true,
            

        },
       
        
    },
    messages: {
        weight:{
            required: "Please specify weight",

        } ,
        height:{
            required:"Please specify height",
           

        },
        age:{
            required:"Please specify age",
            

        },
        logUnit:{
            required:"Please specify a food unit",
            
            

        },
       
       
    }
});
  $('#calculateButton').click(function () {
      var valid = $("#calculate").valid();
      if(valid === false){

      }
      else{
      let calsGoal = 0;
      if( $('#gender').val() === "1"){
          let weight = $('#weight').val();
          let height = $('#height').val();
          let age = $('#age').val();
          let effort = $('#effort').val();
          let BMR =  (10 * weight) + (6.25 * height) - (5* age)  + 5;
          calsGoal = (BMR * effort).toFixed(0);
          console.log(calsGoal)
          document.getElementById("goalCalc").textContent = calsGoal +" kcals";


      }
      else{

        let weight = $('#weight').val();
          let height = $('#height').val();
          let age = $('#age').val();
          let effort = $('#effort').val();
          let BMR =  (10 * weight) + (6.25 * height) - (5* age) - 161;
          calsGoal = BMR * effort;
          document.getElementById("goalCalc").textContent = calsGoal +" kcals";
      }
      if(calsGoal !== 0){
          $("#useThis").prop("disabled",false);
      }
    }

  });
  $('#useThis').mouseup(function () {
      let calsGoal = 0;
      let calstxt = $("#goalCalc").html() 
      let splitcals = calstxt.split(" ");
      calsGoal = splitcals[0];
      $("#inputCalGoal").val(calsGoal);
      
    

      console.log(calsGoal)
  });

  $('.saveFood').click(function () {
      
    
    var html =$("#myList").val();
    console.log("saveFood:"+html);
    
        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
        var param = 'intensity='+html;
        xhr.open('POST', 'https://api.fitbit.com/1/user/-/foods/log/goal.json?'+param);
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
       xhr.onload = function () {
    if (xhr.status === 200) {
        const data = xhr.response;
        console.log(data);
        Swal.fire({
            icon: 'success',
            title: 'Your Goal has been saved!',
            timer: 1500
          });
          document.getElementById("gainMessage").textContent = null;
          $(".saveFood").prop('disabled', true);
$(".saveFood").parents('td').find('.editFood').prop('disabled', false);
document.getElementById("gMessage").textContent = "Select a new plan!";
getFoodGoals();
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



});

$('.editActivity').click(function () {
    $(this).prop('disabled', true);
    $(this).parents('td').find('.saveActivity').prop('disabled', false);

    $(this).parents('tr').find('td.editableColumns').each(function() {
      var html = $(this).html();
      var numbers = html.split(" ");
      if($(this).get(0).id === 'calOutval'){
       // var input = $('<input class="editableColumnsStyle" type="text" />');
        var input = $('<div style="position:relative;margin-bottom:10px;" class="buttonInside"><input style="height:30px;width:100%;padding-left:10px;border-radius: 4px;border:none;outline:none;" class="editableColumnsStyle" id="inputCalGoal" type="text" /><button style="position:absolute; right: 0px; top: 3px;border:none;height:25px;width:25px;border-radius:100%;outline:none;font-weight:bold;" id="showHelp" data-toggle="modal" data-target="#goalCalculator">?</button></div>');
        input.find("#inputCalGoal").val(numbers[0]);
      
    }
      else{
      var input = $('<input class="editableColumnsStyle" type="text" />');
      input.val(numbers[0]);
      }
    
      
      $(this).html(input);
    });
  });
 

  $('.submitLog').click(function () {
    var param="";
    $(this).parents('div').find('.logtextDate , .logtext').each(function() {
        
        var html = $(this).val();
        console.log("html"+html);
        if(this.name ==="weightdate"){
            param += "date="+formatDate(html);
        }
        if(this.name ==="weight"){
            param += "&weight="+html;
        }
        
    });
    var today = new Date();
        var hr = today.getHours();
        var mns = today.getMinutes();
        var secs = today.getSeconds()
        var hour= "";
        var mins ="";
        var seconds ="";
        if(hr<10){
            hour ="0"+hr
        }
        else{
            hour=hr;
        }

        if(mns<10){
            mins ="0"+mns;
        }
        else{
            mins=mns;
        }

        if(secs<10){
            seconds ="0"+secs
        }
        else{
            seconds=secs;
        }
    
        var time = hour + ":" + mins + ":" + seconds;
        param+="&time="+time;

        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
        xhr.open('POST', 'https://api.fitbit.com/1/user/-/body/log/weight.json?'+param);
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
    if (xhr.status === 201) {
        const data = xhr.response;
        console.log(data);
        Swal.fire({
            icon: 'success',
            title: 'Your Log has been saved!',
            timer: 1500
          });
          $('.submitLog').parents('div').find('.logtextDate , .logtext').val("");
          getWeightLogs();
       
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



  });

  
  $('.saveActivity').click(function () {
        var html = $(this).parents('tr').find('.editableColumnsStyle').val();
        var goalName = $(this).parents('tr').find('td.name').html();
        if(goalName.includes("Steps")){
            var xhr = new XMLHttpRequest();
            xhr.responseType= 'json';
            var param = 'steps='+html;
              xhr.open('POST', 'https://api.fitbit.com/1/user/-/activities/goals/daily.json?'+param);
             xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
           xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            Swal.fire({
                icon: 'success',
                title: 'Your Goal has been saved!',
                timer: 1500
              });
              $(".editActivity").prop('disabled', false);
              $(".saveActivity").prop('disabled', true);
              getDailyActivityGoals(); 
           
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
    }

    if(goalName.includes("Active")){
        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
        var param = 'activeMinutes='+html;
        console.log(param);
          xhr.open('POST', 'https://api.fitbit.com/1/user/-/activities/goals/daily.json?'+param);
         xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
       xhr.onload = function () {
    if (xhr.status === 200) {
        const data = xhr.response;
        console.log(data);
        Swal.fire({
            icon: 'success',
            title: 'Your Goal has been saved!',
            timer: 1500
          });
          $(".editActivity").prop('disabled', false);
          $(".saveActivity").prop('disabled', true);
          getDailyActivityGoals(); 
       
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
}

if(goalName.includes("Calories")){
    var xhr = new XMLHttpRequest();
    xhr.responseType= 'json';
    var param = 'caloriesOut='+html;
    console.log(param);
      xhr.open('POST', 'https://api.fitbit.com/1/user/-/activities/goals/daily.json?'+param);
     xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
   xhr.onload = function () {
if (xhr.status === 200) {
    const data = xhr.response;
    console.log(data);
    Swal.fire({
        icon: 'success',
        title: 'Your Goal has been saved!',
        timer: 1500
      });
      $(".editActivity").prop('disabled', false);
      $(".saveActivity").prop('disabled', true);
      getDailyActivityGoals(); 
   
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
}

if(goalName.includes("Distance")){
    var xhr = new XMLHttpRequest();
    xhr.responseType= 'json';
    var param = 'distance='+html;
    console.log(param);
      xhr.open('POST', 'https://api.fitbit.com/1/user/-/activities/goals/daily.json?'+param);
     xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
   xhr.onload = function () {
if (xhr.status === 200) {
    const data = xhr.response;
    console.log(data);
    Swal.fire({
        icon: 'success',
        title: 'Your Goal has been saved!',
        timer: 1500
      });
      $(".editActivity").prop('disabled', false);
      $(".saveActivity").prop('disabled', true);
      getDailyActivityGoals(); 
   
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
}
  

   

  });


  $('.editWeight').click(function () {
    $(this).prop('disabled', true);
    $(this).parents('td').find('.saveWeight').prop('disabled', false);

var id =0;
    $(this).parents('tr').find('td.weightEditable,td.startEditable').each(function() {
        id++;
        console.log(id);
      var html = $(this).html();
      var numbers = html.split(" ");
      var input = $('<input class="editableColumnsWeightEditable" type="text" '+'id="'+id+'"'+'/>');
      input.val(numbers[0]);
      $(this).html(input);
    });
  });

  $('.saveWeight').click(function () {
    var param='';
    $(this).parents('tr').find('.editableColumnsWeightEditable').each(function() {
        var html = $(this).val();
        if(this.id ==="1"){
            let date =formatDate(html);
            param+= "startDate="+date;   
        }
        if(this.id ==="2"){
           param+="&startWeight="+html;
        }
        if(this.id ==="3"){
            param+="&weight="+html;   
         }
  });
  var xhr = new XMLHttpRequest();
  xhr.responseType= 'json';
  console.log(param);
  xhr.open('POST', 'https://api.fitbit.com/1/user/-/body/log/weight/goal.json?'+param);
  xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
  xhr.onload = function () {
      if (xhr.status === 200) {
          const data = xhr.response;
          console.log(data);
          Swal.fire({
            icon: 'success',
            title: 'Your goal has been saved!',
            timer: 1500
          });
          $('.saveWeight').prop('disabled', true);
   $('.saveWeight').parents('td').find('.editWeight').prop('disabled', false);
   document.getElementById("gainMessage").textContent = "Select a new plan!";
   getWeightGoals().then(getWeightLogs); 
  
       }
     else{

        console.log("status:"+xhr.status);
        Swal.fire({
            icon: 'error',
            title: 'Something went wrong, try again!',
            timer: 1500
          });
       }
 }
 xhr.send();

 
});

function getWeightProgress(){
    document.getElementById("red").setAttribute("style","width:0%");
    document.getElementById("yellow").setAttribute("style","width:0%");
    document.getElementById("green").setAttribute("style","width:0%");

    let target = currentWeightGoal - startWeight;
    console.log("target:"+target);
    let remaining = currentWeightGoal - currentWeight;
    if(currentWeightGoal - startWeight < 0){
        document.getElementById("carbInfo").textContent = "Since you are on a weight loss program we recommend you eat 50% carbs of your daily intake";
        let carbgrams = ((0.5* foodgoal)/4).toFixed(0);
        $("#carbgrams").text(carbgrams+" grams");
        $("#carbpercent").val(50);

        document.getElementById("fatInfo").textContent = "Since you are on a weight loss program we recommend you eat 20% fats of your daily intake";
        let fatgrams = ((0.2* foodgoal)/9).toFixed(0);
        $("#fatgrams").text(fatgrams+" grams");
        $("#fatpercent").val(20);

        document.getElementById("carbInfo2").textContent = "Since you are on a weight loss program we recommend you eat 50% carbs of your daily intake";
        let carbgrams2 = ((0.5* foodgoal)/4).toFixed(0);
        $("#carbgrams2").text(carbgrams2+" grams");
        $("#carbpercent2").val(50);

        document.getElementById("fatInfo2").textContent = "Since you are on a weight loss program we recommend you eat 20% fats of your daily intake";
        let fatgrams2 = ((0.2* foodgoal)/9).toFixed(0);
        $("#fatgrams2").text(fatgrams2+" grams");
        $("#fatpercent2").val(20);
     }
     if(currentWeightGoal - startWeight > 0){
        document.getElementById("carbInfo").textContent = "Since you are on a weight gain program we recommend you eat 65% carbs of your daily intake";
        let carbgrams = ((0.65* foodgoal)/4).toFixed(0);
        $("#carbgrams").text(carbgrams+" grams");
        $("#carbpercent").val(65);  

        document.getElementById("fatInfo").textContent = "Since you are on a weight gain program we recommend you eat 30% fats of your daily intake";
        let fatgrams = ((0.30* foodgoal)/9).toFixed(0);
        $("#fatgrams").text(fatgrams+" grams");
        $("#fatpercent").val(30);

        document.getElementById("carbInfo2").textContent = "Since you are on a weight gain program we recommend you eat 65% carbs of your daily intake";
        let carbgrams2 = ((0.65* foodgoal)/4).toFixed(0);
        $("#carbgrams2").text(carbgrams2+" grams");
        $("#carbpercent2").val(65);  

        document.getElementById("fatInfo2").textContent = "Since you are on a weight gain program we recommend you eat 30% fats of your daily intake";
        let fatgrams2 = ((0.30* foodgoal)/9).toFixed(0);
        $("#fatgrams2").text(fatgrams2+" grams");
        $("#fatpercent2").val(30);
    }
    let prog = (((currentWeightGoal - currentWeight)/target)*100).toFixed(2);
    let progress = 100 - prog;
    console.log(progress);
    if(progress >= 100){
        Swal.fire({
            icon: 'success',
            title: 'Congratulations! Your Weight goal has been reached!',
            timer: 1500
          });
    }

    document.getElementById("start").textContent =  startWeight+" kg";
    document.getElementById("goal").textContent =  currentWeightGoal+" kg";
    if(currentWeight ===0){
        document.getElementById("progressStatus").textContent ="N/A please ensure a weight log and goal exists for progress";
        document.getElementById("red").setAttribute("style","width:0%");
        document.getElementById("yellow").setAttribute("style","width:0%");
        document.getElementById("green").setAttribute("style","width:0%");


    }
    
    if(target <0 && currentWeight !=0){
        document.getElementById("progressStatus").textContent = " Current Weight Loss Progress: "+currentWeight+" kg(Lose "+Math.abs(remaining)+" kg)";
        if(progress <=34){
            document.getElementById("red").setAttribute("style","width:"+progress+"%");
        }
        if(progress >34 && progress <=75){
            let remainder = progress- 34;
            document.getElementById("red").setAttribute("style","width:34%");
            document.getElementById("yellow").setAttribute("style","width:"+remainder+"%");
    
        }
        if(progress>75){
            let remainder = progress- 75;
            if(remainder <=25){
            document.getElementById("red").setAttribute("style","width:34%");
            document.getElementById("yellow").setAttribute("style","width:41%");
            document.getElementById("green").setAttribute("style","width:"+remainder+"%");
            }
            if(remaining >0){
                document.getElementById("gainMessage").textContent = "You have reached your goal this plan is no longer needed!";
                document.getElementById("progressStatus").textContent = "You have exceeded your goal! Current weight: "+currentWeight+" kg("+Math.abs(remaining)+" kg less)";
                document.getElementById("red").setAttribute("style","width:34%");
                document.getElementById("yellow").setAttribute("style","width:41%");
                document.getElementById("green").setAttribute("style","width:25%");
                }

            if(remaining ===0){
                document.getElementById("gainMessage").textContent = "You have reached your goal this plan is no longer needed!";
                document.getElementById("progressStatus").textContent = "Congratulations! You have reached your goal of "+currentWeightGoal+" kg!";
            document.getElementById("red").setAttribute("style","width:34%");
            document.getElementById("yellow").setAttribute("style","width:41%");
            document.getElementById("green").setAttribute("style","width:25%");
            }
    
    
        }
    }
    if(target >0 && currentWeight !=0){
        document.getElementById("gainMessage").textContent = "No food plan available for weight gain"
        document.getElementById("progressStatus").textContent = " Current Weight Gain Progress: "+currentWeight+" kg(Gain "+Math.abs(remaining)+" kg)";
        if(progress <=34){
            document.getElementById("red").setAttribute("style","width:"+progress+"%");
        }
        if(progress >34 && progress <=75){
            let remainder = progress- 34;
            document.getElementById("red").setAttribute("style","width:34%");
            document.getElementById("yellow").setAttribute("style","width:"+remainder+"%");
    
        }
        if(progress>75){
            let remainder = progress- 75;
            if(remainder <=25){
            document.getElementById("red").setAttribute("style","width:34%");
            document.getElementById("yellow").setAttribute("style","width:41%");
            document.getElementById("green").setAttribute("style","width:"+remainder+"%");
            }
            if(remaining <0){
            document.getElementById("progressStatus").textContent = "You have exceeded your goal! Current weight: "+currentWeight+" kg("+Math.abs(remaining)+" kg more)";
            document.getElementById("red").setAttribute("style","width:34%");
            document.getElementById("yellow").setAttribute("style","width:41%");
            document.getElementById("green").setAttribute("style","width:25%");
            }
            if(remaining ===0){
            document.getElementById("progressStatus").textContent = "Congratulations! You have reached your goal of "+currentWeightGoal+" kg!";
            document.getElementById("red").setAttribute("style","width:34%");
            document.getElementById("yellow").setAttribute("style","width:41%");
            document.getElementById("green").setAttribute("style","width:25%");
            }
    
    
        }
    }



}

  function getNutritionGoals(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', '/getNutritionGoals/'+userId);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.response);
            let data = xhr.response;
            document.getElementById("val1").textContent = data.nutrition_val1;
            document.getElementById("amount1").textContent = data.nutrition_amount1;
            document.getElementById("val2").textContent = data.nutrition_val2;
            document.getElementById("amount2").textContent = data.nutrition_amount2;     
        }
        else{
            console.log("Status:"+xhr.status);
        }
    };

    xhr.send();

  };


  // nutrition info section
  $("#usecarb").mouseup(function(){
      if($("#nutval2").val()!== "Carbohydrates" ){
      $("#nutval1").val("Carbohydrates");
      let amount  = $("#carbgrams").text().split(" ");
      let nutAmount = amount[0];
      $("#nutAmount1").val(nutAmount);
    }

  });
  $("#useprotein").mouseup(function(){
    if($("#nutval2").val()!== "Protein" ){
    $("#nutval1").val("Protein");
    let amount  = $("#proteingrams").text().split(" ");
    let nutAmount = amount[0];
    $("#nutAmount1").val(nutAmount);
    }

});
$("#usefiber").mouseup(function(){
    if($("#nutval2").val()!== "Fiber" ){
    $("#nutval1").val("Fiber");
    let amount  = $("#fibergrams").text().split(" ");
    let nutAmount = amount[0];
    $("#nutAmount1").val(nutAmount);
    }

});
$("#usefat").mouseup(function(){
    if($("#nutval2").val()!== "Fats" ){
    $("#nutval1").val("Fats");
    let amount  = $("#fatgrams").text().split(" ");
    let nutAmount = amount[0];
    $("#nutAmount1").val(nutAmount);
    }

});


$("#usecarb2").mouseup(function(){
    if($("#nutval1").val()!== "Carbohydrates" ){
    $("#nutval2").val("Carbohydrates");
    let amount  = $("#carbgrams2").text().split(" ");
    let nutAmount = amount[0];
    $("#nutAmount2").val(nutAmount);
  }

});
$("#useprotein2").mouseup(function(){
  if($("#nutval1").val()!== "Protein" ){
  $("#nutval2").val("Protein");
  let amount  = $("#proteingrams2").text().split(" ");
  let nutAmount = amount[0];
  $("#nutAmount2").val(nutAmount);
  }

});
$("#usefiber2").mouseup(function(){
  if($("#nutval1").val()!== "Fiber" ){
  $("#nutval2").val("Fiber");
  let amount  = $("#fibergrams2").text().split(" ");
  let nutAmount = amount[0];
  $("#nutAmount2").val(nutAmount);
  }

});
$("#usefat2").mouseup(function(){
  if($("#nutval1").val()!== "Fats" ){
  $("#nutval2").val("Fats");
  let amount  = $("#fatgrams2").text().split(" ");
  let nutAmount = amount[0];
  $("#nutAmount2").val(nutAmount);
  }

});

$("#carbpercent").keyup(function(){
    let percent = $("#carbpercent").val()/100;
    let grams = ((percent *foodgoal)/4).toFixed(0);
    $("#carbgrams").text(grams +" grams");

});
$("#proteinpercent").keyup(function(){
    let percent = $("#proteinpercent").val();
    let grams = ((percent * currentWeight)).toFixed(0);
    $("#proteingrams").text(grams +" grams");

});

$("#fatpercent").keyup(function(){
    let percent = $("#fatpercent").val()/100;
    let grams = ((percent *foodgoal)/9).toFixed(0);
    $("#fatgrams").text(grams +" grams");

});

$("#carbpercent2").keyup(function(){
    let percent = $("#carbpercent2").val()/100;
    let grams = ((percent *foodgoal)/4).toFixed(0);
    $("#carbgrams2").text(grams +" grams");

});
$("#proteinpercent2").keyup(function(){
    let percent = $("#proteinpercent2").val();
    let grams = ((percent * currentWeight)).toFixed(0);
    $("#proteingrams2").text(grams +" grams");

});

$("#fatpercent2").keyup(function(){
    let percent = $("#fatpercent2").val()/100;
    let grams = ((percent *foodgoal)/9).toFixed(0);
    $("#fatgrams2").text(grams +" grams");

});


 getProfile(); 
getDailyActivityGoals();
getWeightGoals().then(getWeightLogs)

getFoodGoals();
getNutritionGoals();


});

jQuery.fn.forceNumeric = function () {
    return this.each(function () {
        $(this).keydown(function (e) {
            var key = e.which || e.keyCode;

            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
            // numbers   
                key >= 48 && key <= 57 ||
            // Numeric keypad
                key >= 96 && key <= 105 ||
            // comma, period and minus, . on keypad
               key == 190 || key == 188 || key == 109 || key == 110 ||
            // Backspace and Tab and Enter
               key == 8 || key == 9 || key == 13 ||
            // Home and End
               key == 35 || key == 36 ||
            // left and right arrows
               key == 37 || key == 39 ||
            // Del and Ins
               key == 46 || key == 45)
                return true;

            return false;
        });
    });
}

function formatDate(date){
    let split = date.split("-");
    let formattedDate = split[2]+'-'+split[1]+'-'+split[0];
    return formattedDate;
}

function disableUsedOptions(table) {
    selects = table.find("select");
    selects.on("change", function () {
        selects = table.find("select");
        if (selects.length <= 1) return;
        let selected = [];

        selects.each(function (index, select) {
            if (select.value !== "") {
                selected.push(select.value);
            }
        });
        for (var index in selected) {
            table
                .find('option[value="' + selected[index] + '"]:not(:selected)')
                .prop("disabled", true);
        }
    });
    selects.trigger("change");
}

