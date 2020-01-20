$(document).ready(function(){
    $('.editableColumns').forceNumeric();
    $('.weightEditable').forceNumeric();
    var access_token = getCookie("token");

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
            console.log(data);
            let date= formatDate(data.goal.startDate);
            document.getElementById("startDate").textContent = date;
            document.getElementById("startweight").textContent = data.goal.startWeight+" kg";
            document.getElementById("GoalWeight").textContent = data.goal.weight+" kg";
           
        }
        else{
            console.log("Status:"+xhr.status);
        }
    };
    xhr.send();


}

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

  $('.saveActivity').click(function () {
        var html = $(this).parents('tr').find('.editableColumnsStyle').val();
        console.log("input:" +html);
        var goalName = $(this).parents('tr').find('td.name').html();
        console.log("goal name:" +goalName);

        if(goalName.includes("Steps")){
            var xhr = new XMLHttpRequest();
            xhr.responseType= 'json';
            var param = 'steps='+html;
            console.log(param);
              xhr.open('POST', 'https://api.fitbit.com/1/user/-/activities/goals/daily.json?'+param);
             xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
           xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            console.log(data);
           
        }
        else{
            console.log("Status:"+xhr.status);
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
       
    }
    else{
        console.log("Status:"+xhr.status);
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
   
}
else{
    console.log("Status:"+xhr.status);
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
   
}
else{
    console.log("Status:"+xhr.status);
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
 
       }
     else{

        console.log("status:"+xhr.status);
       }
 }
 xhr.send();

 $(this).prop('disabled', true);
   $(this).parents('td').find('.editWeight').prop('disabled', false);
setTimeout(function(){
    getWeightGoals(); 
},1500);
});

  
  
getDailyActivityGoals();
getWeightGoals();

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

