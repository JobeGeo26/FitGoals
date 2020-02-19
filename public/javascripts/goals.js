$(document).ready(function(){
    $('.editableColumns').forceNumeric();
    $('.weightEditable').forceNumeric();
    $('.logtext').forceNumeric();
    var access_token = getCookie("token");
    var currentWeight = 0;
    var currentWeightGoal = 0;
    var startWeight = 0;

   
    var time = document.getElementsByClassName('colon'); //Get all elements with class "time"
    for (var i = 0; i < time.length; i++) { //Loop trough elements

        time[i].addEventListener('keyup', function (e) {; //Add event listener to every element
            var reg = /[0-9]/;
            if ((this.value.length == 2 || this.value.length == 5 )&& reg.test(this.value)) this.value = this.value + "-"; //Add colon if string length > 2 and string is a number 
            if (this.value.length > 10) this.value = this.value.substr(0, this.value.length - 1); //Delete the last digit if string length > 5
        });


    };
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
           
        }
        else{
            console.log("Status:"+xhr.status);
        }
    };
    xhr.send();


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
           
           
        }
        else{
            console.log("Status:"+xhr.status);
        }
    };
    xhr.send();
    setTimeout(function(){
getWeightProgress();
    },1000);
    getFoodGoals();
    

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
    getWeightLogs(); 
},1500);


}

$('.editFood').click(function () {
    $(this).prop('disabled', true);
    $(this).parents('td').find('.saveFood').prop('disabled', false);
    if(currentWeightGoal - currentWeight <0){

    $(this).parents('tr').find('td.foodEditableList').each(function() {
      var html = $(this).html();
      var numbers = html.split(" ");
      var input = $('<select id="myList"><option class="editableColumnsFoodStyle" >EASIER</option><option class="editableColumnsFoodStyle" >MEDIUM</option><option class="editableColumnsFoodStyle" >KINDAHARD</option><option class="editableColumnsFoodStyle" >HARDER</option></select>');
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

  $('.saveFood').click(function () {
      
    var myList = document.getElementById('myList');
    var html =myList.options[myList.selectedIndex].text;
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
$(this).prop('disabled', true);
$(this).parents('td').find('.editFood').prop('disabled', false);
setTimeout(function(){
    getFoodGoals();
},1000);


});

$('.editActivity').click(function () {
    $(this).prop('disabled', true);
    $(this).parents('td').find('.saveActivity').prop('disabled', false);

    $(this).parents('tr').find('td.editableColumns').each(function() {
      var html = $(this).html();
      var numbers = html.split(" ");
      var input = $('<input class="editableColumnsStyle" type="text" />');
      input.val(numbers[0]);
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
$(this).parents('div').find('.logtextDate , .logtext').val("");
setTimeout(function(){

    getWeightLogs(); 
},1500);

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
   
   $(this).prop('disabled', true);
   $(this).parents('td').find('.editActivity').prop('disabled', false);
setTimeout(function(){
    getDailyActivityGoals(); 
},1500);
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

 $(this).prop('disabled', true);
   $(this).parents('td').find('.editWeight').prop('disabled', false);
setTimeout(function(){
    getWeightGoals(); 
    getWeightLogs();
},1500);
});

function getWeightProgress(){
    document.getElementById("red").setAttribute("style","width:0%");
    document.getElementById("yellow").setAttribute("style","width:0%");
    document.getElementById("green").setAttribute("style","width:0%");

    let target = currentWeightGoal - startWeight;
    console.log("target:"+target);
    let remaining = currentWeightGoal - currentWeight;
    let prog = (((currentWeightGoal - currentWeight)/target)*100).toFixed(2);
    let progress = 100 - prog;
    console.log(progress);

    document.getElementById("start").textContent =  startWeight+" kg";
    document.getElementById("goal").textContent =  currentWeightGoal+" kg";
    if(currentWeight ===0){
        document.getElementById("progressStatus").textContent ="N/A please ensure a weight log and goal exists for progress";
        document.getElementById("red").setAttribute("style","width:0%");
        document.getElementById("yellow").setAttribute("style","width:0%");
        document.getElementById("green").setAttribute("style","width:0%");


    }
    
    if(target <0 && currentWeight !=0){
        document.getElementById("gainMessage").textContent = null;
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
                document.getElementById("progressStatus").textContent = "You have exceeded your goal! Current weight: "+currentWeight+" kg("+Math.abs(remaining)+" kg less)";
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

  
  
getDailyActivityGoals();
getWeightGoals();
getWeightLogs();
getFoodGoals();
setTimeout(function(){

    getWeightProgress();
},1000);

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

