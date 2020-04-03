$(document).ready(function(){
    var access_token = getCookie("token");
    var calsBurnedGoal;
    var currDistance = 0;
    var currActiveMins;
    var distGoal;
    var minsGoal;
    var activeCals;
    var currBurned;
    var metvalues =[];
    var names = [];
    var activitiesMap = new Map();
    var metvalMap = new Map();
    var totalCals = 0;
    var totalDist= 0;
    var totalDuration = 0;
    var intensity;
    var wasClicked = 0;
    var change = 0;
    $("nav").css({'background-image': 'linear-gradient(to right,  #FF0000 0%, #FF7878 100%)'})
    $('#logActivity').select2({placeholder: "Search Activity....", allowClear: true});
    
    $("#logActivity").on('change', function (e) {  
        if(wasClicked === change){
        $(this).valid();
        }
        else{
            change = wasClicked;
        }
    });
    var time = document.getElementsByClassName('colon'); //Get all elements with class "time"
for (var i = 0; i < time.length; i++) { //Loop trough elements
    if(i % 2 === 0){
    time[i].addEventListener('keyup', function (e) {; //Add event listener to every element
        var reg = /[0-9]/;
        if (this.value.length == 2 && reg.test(this.value)) this.value = this.value + ":"; //Add colon if string length > 2 and string is a number 
        if (this.value.length > 5) this.value = this.value.substr(0, this.value.length - 1); //Delete the last digit if string length > 5
    });
}
else{
    time[i].addEventListener('keyup', function (e) {; //Add event listener to every element
        var reg = /[0-9]/;
        if ((this.value.length == 2 ||this.value.length == 5 ) && reg.test(this.value)) this.value = this.value + ":"; //Add colon if string length > 2 and string is a number 
        if (this.value.length > 8) this.value = this.value.substr(0, this.value.length - 1); //Delete the last digit if string length > 5
    });

}
};

    function getFoodGoals(){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/foods/log/goal.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
                if(data.foodPlan !== undefined){
                intensity = data.foodPlan.intensity;
                }
                
            }
            else{
                console.log("Status:"+xhr.status);
            }
        };
        xhr.send();
    
    
    }

    function getBalance(){
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
        let baseDate = year+'-'+month+'-'+day;
        console.log(baseDate);
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/foods/log/date/'+baseDate+'.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
               
               let currIn = data.summary.calories;
               let balance = currIn - currBurned;
               console.log(balance);
               if(intensity === "MAINTENANCE"){

                document.getElementById("balStatus").textContent = "N/A for maintenance and weight gain";
            }
               if(intensity === "EASIER"){

                if(balance <= -200 && balance >=-300){
                    getBalanceGauge(150);
                    document.getElementById("balStatus").textContent = "Caloric deficit goal met: 250 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";

                }
                if(balance < -300){
                    getBalanceGauge(250);
                    document.getElementById("balStatus").textContent = "Over Caloric deficit goal: 250 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";

                }
                if(balance >-200){
                    getBalanceGauge(50);
                    document.getElementById("balStatus").textContent = "Under Caloric deficit goal: 250 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";
                }
               }
               
               if(intensity === "MEDIUM"){

                if(balance <= -450 && balance >= -550){
                    getBalanceGauge(150);
                    document.getElementById("balStatus").textContent = "Caloric deficit goal met: 500 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";

                }
                if(balance < -550){
                    getBalanceGauge(250);
                    document.getElementById("balStatus").textContent = "Over Caloric deficit goal: 500 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";


                }
                if(balance > -450){
                    getBalanceGauge(50);
                    document.getElementById("balStatus").textContent = "Under Caloric deficit goal: 500 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";

                }
               }
               if(intensity === "KINDAHARD"){

                if(balance <= -700 && balance >= -800){
                    getBalanceGauge(150);
                    document.getElementById("balStatus").textContent = "Caloric deficit goal met: 750 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";

                }
                if(balance < -800){
                    getBalanceGauge(250);
                    document.getElementById("balStatus").textContent = "Over Caloric deficit goal: 750 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";


                }
                if(balance > -700){
                    getBalanceGauge(50);
                    document.getElementById("balStatus").textContent = "Under Caloric deficit goal: 750 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";


                }
               }
               if(intensity === "HARDER"){

                if(balance <= -950 && balance >= -1050){
                    getBalanceGauge(150);
                    document.getElementById("balStatus").textContent = "Caloric deficit goal met: 1,000 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";


                }
                if(balance < -1050){
                    getBalanceGauge(250);
                    document.getElementById("balStatus").textContent = "Over Caloric deficit goal: 1,000 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";



                }
                if(balance > -950){
                    getBalanceGauge(50);
                    document.getElementById("balStatus").textContent = "Under Caloric deficit goal: 1,000 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";


                }
               }





            }
            else{
                console.log("status:"+xhr.status);
            }
        };
        xhr.send();
    }

    $("#submitFave").click(function(){
        var input = $("#addFave").val();
        console.log(input)
        
        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
        var param  = activitiesMap.get(input);
        console.log(param);

        xhr.open('POST', 'https://api.fitbit.com/1/user/-/activities/log/favorite/'+param+'.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
       xhr.onload = function () {
    if (xhr.status === 201) {
        const data = xhr.response;
        console.log(data);
       location.reload();
    }
    else{
        console.log("Status:"+xhr.status);
    }
};
xhr.send();


    });

    $("#delFave").click(function(){
        var input = $("#deleteFave").val();
        console.log(input)
        
        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
        var param  = activitiesMap.get(input);
     //   console.log(foodIdMap.entries());

        xhr.open('DELETE', 'https://api.fitbit.com/1/user/-/activities/log/favorite/'+param+'.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
       xhr.onload = function () {
    if (xhr.status === 204) {
        const data = xhr.response;
        console.log(data);
       location.reload();
    }
    else{
        console.log("Status:"+xhr.status);
    }
};
xhr.send();


    });

    function getBalanceGauge(value){

        var opts = {
            angle: 0.10, // The span of the gauge arc
            lineWidth: 0.2, // The line thickness
            radiusScale: 1, // Relative radius
            pointer: {
              length: 0.45, // // Relative to gauge radius
              strokeWidth: 0.035, // The thickness
              color: '#000000' // Fill color
            },
            limitMax: false,     // If false, max value increases automatically if value > maxValue
            
            limitMin: false,     // If true, the min value of the gauge will be fixed
            colorStart: '#6F6EA0',   // Colors
            colorStop: '#C0C0DB',    // just experiment with them
            strokeColor: '#EEEEEE',  // to see which ones work best for you
            generateGradient: true,
            highDpiSupport: true,     // High resolution support
            staticZones: [
                {strokeStyle: "#FF4B57", min: 1, max: 100, height:0.7}, // Red from 100 to 130
                {strokeStyle: " rgb(26, 197, 26)", min: 90, max: 210, height:0.7}, // Green
                {strokeStyle: "yellow", min: 210, max: 300, height:0.7}, // Yellow
                
             ],
            
            
          };
          var target = document.getElementById('balanceGauge'); // your canvas element
          var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
          gauge.maxValue = 300; // set max gauge value
          gauge.setMinValue(1);  // Prefer setter over gauge.minValue = 0
          gauge.animationSpeed = 32; // set animation speed (32 is default value)
          gauge.set(value); // set actual value
    }

    function getActiveMinsGauge(value){
        var opts = {
            angle: 0.15, // The span of the gauge arc
            lineWidth: 0.44, // The line thickness
            radiusScale: 1, // Relative radius
            pointer: {
              length: 0.6, // // Relative to gauge radius
              strokeWidth: 0.035, // The thickness
              color: '#000000' // Fill color
            },
            limitMax: false,     // If false, max value increases automatically if value > maxValue
            limitMin: false,     // If true, the min value of the gauge will be fixed
            colorStart: '#CF3E3E',   // Colors
            colorStop: 'yellow',    // just experiment with them
            strokeColor: '#E0E0E0',  // to see which ones work best for you
            generateGradient: true,
            highDpiSupport: true,     // High resolution support
            
          };
          var target = document.getElementById('minutesGauge'); // your canvas element
          var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
          gauge.maxValue = 100; // set max gauge value
          gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
          gauge.animationSpeed = 32; // set animation speed (32 is default value)
          gauge.set(value); // set actual value
    }

    function getDistanceGauge(value){
        var opts = {
            angle: 0.15, // The span of the gauge arc
            lineWidth: 0.44, // The line thickness
            radiusScale: 1, // Relative radius
            pointer: {
              length: 0.6, // // Relative to gauge radius
              strokeWidth: 0.035, // The thickness
              color: '#000000' // Fill color
            },
            limitMax: false,     // If false, max value increases automatically if value > maxValue
            limitMin: false,     // If true, the min value of the gauge will be fixed
            colorStart: '#CF3E3E',   // Colors
            colorStop: '#FF0000',    // just experiment with them
            strokeColor: '#E0E0E0',  // to see which ones work best for you
            generateGradient: true,
            highDpiSupport: true,     // High resolution support
            
          };
          var target = document.getElementById('distanceGauge'); // your canvas element
          var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
          gauge.maxValue = 100; // set max gauge value
          gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
          gauge.animationSpeed = 32; // set animation speed (32 is default value)
          gauge.set(value); // set actual value
    }

    
    


    function getWeeklyCalsBurned(){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/calories/date/today/7d.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
                let weekly = data["activities-calories"];
                    if(weekly.length === 0){
                        createLineChart(null,null,"Not Data Available!");
    
                    }
                    else{
                    const calsBurned = weekly.map(entries => entries.value);
                
                    const day = weekly.map(entries => entries.dateTime);
                
                    let title = "7 day Calories Burned Comparison graph"
                    createLineChart(day,calsBurned,title);
                    }
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();
    };

    function resetCanvas(){
        $('#caloriesBurned').remove(); // this is my <canvas> element
        $('#graphContainer').append('<canvas id="caloriesBurned" width="400" height="210" style="border: 2px white; border-radius: 20px"></canvas>');
       
      };

    async function createLineChart( xlabels, ylabels,title ){
        await xlabels;
        await ylabels;
        var ctx = document.getElementById('caloriesBurned').getContext('2d');
        $('#caloriesBurned').css({'background-image': 'linear-gradient(to bottom,  #FF0000 0%, #FF7878 100%)'});
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xlabels,
            
            datasets: [{
                label: 'Calories Burned in last 7 days',
               
                fill: false,
                data: ylabels,
                backgroundColor: "rgba(255, 255, 255,0.7)",
                borderColor:'white',
                borderWidth: 2
            }]
        },
        
        options: {
            responsive: true,
            title: {
                display: true,
                text: title,
                fontSize: 20,
                fontColor: 'white'
            },
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 18
                }
            },
            scales: {
                xAxes: [{
                    
                    display: true,
                    ticks: {
                        display: true, //this will remove only the label
                        fontColor: 'white'
                    
                    
                    },
                    gridLines: {
                        display:true,
                        color: "rgba(255, 255, 255,0.2)",
                        zeroLineColor: "white",
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: 'white',
                        beginAtZero: true
                        
                    },
                    gridLines: {
                        display:true,
                        color: "rgba(255, 255, 255,0.2)",
                        zeroLineColor: "white",
                    }
                }]
            },
            tooltips: {
                mode: 'index',
                intersect: true
              },
              annotation: {
                annotations: [{
                  type: 'line',
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  value: calsBurnedGoal,
                  borderColor: 'white',
                  borderWidth: 4,
                  label: {
                    enabled: true,
                    content: 'Calories Burned Goal: '+calsBurnedGoal
                    
                  }
                }]
            }
        }
        
        
    });
    
    }

    function getActivityLogs(){
        var rows = $('#activityLog tbody tr').length;
        console.log("rows:"+rows);
        var index= 0;
        var table= document.getElementById('activityLog').getElementsByTagName('tbody')[0];
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
        let distProgress =0;
        let minsProgress = 0;
        return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/date/'+baseDate+'.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
                calsBurnedGoal = data.goals.caloriesOut;
                currBurned = data.summary.caloriesOut;
                distGoal = data.goals.distance;
                minsGoal = data.goals.activeMinutes;
                currActiveMins = data.summary.veryActiveMinutes;
                activeCals = currBurned - data.summary.caloriesBMR;
               document.getElementById("minStatus").textContent = currActiveMins+"/"+minsGoal+" mins completed!"
               document.getElementById("bmr").textContent = "Today you have burned "+data.summary.caloriesBMR +" kcals so far due to your BMR!";
              for(var z = 0; z < data.summary.distances.length; z++ ){
                if(data.summary.distances[z].activity === "total"){
                currDistance = data.summary.distances[0].distance;
                }
            }
                document.getElementById("distStatus").textContent = currDistance+"/"+distGoal+" km completed!"
                 distProgress = ((currDistance/distGoal)*100).toFixed(2);
                 minsProgress = ((currActiveMins/minsGoal)*100).toFixed(2);
                 if( distProgress >= 100){
                    Swal.fire({
                        icon: 'success',
                        title: 'You have reached your Distance Goal!',
                        timer: 1500
                      });
                 }
                 if( minsProgress >= 100){
                    Swal.fire({
                        icon: 'success',
                        title: 'You have reached your Active Minutes Goal!',
                        timer: 1500
                      });
                 }
                
                for(var i =data.activities.length-1 ; i>=0; i--){
                    let tableRef = document.getElementById('activityLog').getElementsByTagName('tbody')[0];
                    var newRow   = tableRef.insertRow();
    
                     var time  = newRow.insertCell(0);
                     var timeText  = document.createTextNode(data.activities[i].startTime);
                     time.appendChild(timeText);
                     var name  = newRow.insertCell(1);
                     var nameText  = document.createTextNode(data.activities[i].name);
                     name.appendChild(nameText);
                     var desc  = newRow.insertCell(2);
                     var descText  = document.createTextNode(data.activities[i].description);
                     desc.appendChild(descText);
                     var distance = newRow.insertCell(3);
                     if(data.activities[i].distance !== undefined){
                         var dist = data.activities[i].distance
                         totalDist += dist;
                     var distanceText = document.createTextNode(dist+" km");
                     distance.appendChild(distanceText);
                     }
                     else{
                        var distanceText = document.createTextNode("N/A");
                        distance.appendChild(distanceText);

                     }
                     var dur  = newRow.insertCell(4);
                     totalCals += data.activities[i].calories;
                     totalDuration += data.activities[i].duration;
                     var durText  = document.createTextNode(msToTime(data.activities[i].duration));
                     dur.appendChild(durText);
                     var cals  = newRow.insertCell(5);
                     var calsText  = document.createTextNode(data.activities[i].calories+" kcal");
                     cals.appendChild(calsText);
                     var manage  = newRow.insertCell(6);
                     var deleteButton =document.createElement("input");
                     deleteButton.type ="button";
                     deleteButton.value = "Delete";
                     let logID = data.activities[i].logId;
                     deleteButton.onclick = function(){deleteLog(logID);};
                     manage.appendChild(deleteButton);
    
                    
                }
                getRecommended(metvalMap,metvalues,names);
                let tableRef = document.getElementById('activityLog').getElementsByTagName('tbody')[0];
                var newRow   = tableRef.insertRow();
                newRow.style.fontWeight = 'bold';
                newRow.insertCell(0);
                newRow.insertCell(1);
                newRow.insertCell(2);
                var distance = newRow.insertCell(3)
                var distanceText= document.createTextNode(totalDist+" km");
                distance.appendChild(distanceText);
               var duration = newRow.insertCell(4)
               var durationText= document.createTextNode(msToTime(totalDuration));
               duration.appendChild(durationText);
               var cals = newRow.insertCell(5)
                var calsText= document.createTextNode(totalCals+" kcal");
                cals.appendChild(calsText);
                newRow.insertCell(6);
                getActivityProgress();
                getBalance();
                console.log("prog"+minsProgress+distProgress)
                getActiveMinsGauge(minsProgress);
                getDistanceGauge(distProgress);
                analyseActivityLevel();
                resolve();
               
            }
            else{
                console.log("Status:"+xhr.status);
            }
        };
        xhr.send();
       
        });
    }

    function deleteLog(logID){
        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
          xhr.open('DELETE', 'https://api.fitbit.com/1/user/-/activities/'+logID+'.json?');
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
          totalCals = 0;
          totalDist= 0;
          totalDuration = 0;
         resetCanvas();
         getWeeklyCalsBurned();
         getActivityLogs(); 
       
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

    function getActivityProgress(){
        document.getElementById("red").setAttribute("style","width:0%");
        document.getElementById("yellow").setAttribute("style","width:0%");
        document.getElementById("green").setAttribute("style","width:0%");
    
       
        let remaining = calsBurnedGoal - currBurned;
        let progress = (currBurned/calsBurnedGoal).toFixed(2)*100;
        console.log(progress);
        if(progress >= 100){
            Swal.fire({
                icon: 'success',
                title: 'You have reached your Calories Burned Goal!',
                timer: 1500
              });
        }
        document.getElementById("goal").textContent =  calsBurnedGoal+" kcal";
        if(currBurned ===0){
            document.getElementById("progressStatus").textContent ="N/A please ensure an activity log and goal exists for progress";
            document.getElementById("red").setAttribute("style","width:0%");
            document.getElementById("yellow").setAttribute("style","width:0%");
            document.getElementById("green").setAttribute("style","width:0%");
    
    
        }
        
        if(currBurned !=0){
            document.getElementById("progressStatus").textContent = " Current Calories Burned Progress: "+currBurned+" kcal("+Math.abs(remaining)+" kcal remaining)";
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
                    document.getElementById("progressStatus").textContent = "You have exceeded your goal! Current Calories Burned: "+currBurned+" kcal("+Math.abs(remaining)+" kcal more)";
                    document.getElementById("red").setAttribute("style","width:34%");
                    document.getElementById("yellow").setAttribute("style","width:41%");
                    document.getElementById("green").setAttribute("style","width:25%");
                    }
    
                if(remaining ===0){
                    document.getElementById("progressStatus").textContent = "Congratulations! You have reached your goal of "+currBurned+" kcal!";
                document.getElementById("red").setAttribute("style","width:34%");
                document.getElementById("yellow").setAttribute("style","width:41%");
                document.getElementById("green").setAttribute("style","width:25%");
                }
        
        
            }
        
        
        }
    
    
    
    }

    function getActivities(metvalues, names){
        
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/activities.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
            
                for(var i = 0;i <data.categories.length; i++){
                    let category = data.categories[i];
                    let categoryName = data.categories[i].name;
                    $("#logActivity").append('<optgroup label="'+categoryName+'">');
                  //  console.log(category.activities.length);
                    for( var n = 0 ; n < category.activities.length; n++){
                        let activities = category.activities[n];
                        let activityName = activities.name
                        if(activities.activityLevels !== undefined){
                            for(var x = 0; x < activities.activityLevels.length ; x++){
                                let activityLevels = activities.activityLevels[x];
                                let levelName = activityLevels.name;
                                let metvalue = activityLevels.mets;
                                if(categoryName.includes("Sports and Workouts")){
                                if(metvalues.includes(metvalue)){
                                    metvalMap.set(activityName+"-"+levelName,metvalue);
                                }
                            }
                                document.getElementById("logActivity").append(new Option(activityName+"-"+levelName, activityLevels.id));
                        
                                document.getElementById("hosting-activities").append(new Option(activityName+"-"+levelName));
            
                            
                                activitiesMap.set(activityName+"-"+levelName,activityLevels.id);
                             //   console.log("activitylevel:"+ activityLevels.id)
                            }
                            
                        }
                        
                        
                       
                        else{
                        //console.log(activities);
                        let metvalue = activities.mets;
                        if(categoryName.includes("Sports and Workouts")){
                        if(metvalues.includes(metvalue)){
                            metvalMap.set(activityName,metvalue);
                        }
                    }
                        document.getElementById("logActivity").append(new Option(activityName, activities.id));
                        document.getElementById("hosting-activities").append(new Option(activityName));
            
                        activitiesMap.set(activityName,activities.id);
                      //  console.log(activitiesMap.get(activities.name));
                        }

                    }
                    if(category.subCategories !== undefined){
                        for(var y =0; y<category.subCategories.length; y++){
                            let subCat = category.subCategories[y];
                            let subCatName = subCat.name;
                            $("#logActivity").append('<optgroup label="'+subCatName+'">');
                            for(var j =0; j< subCat.activities.length; j++){
                                let activs = subCat.activities[j];
                                let activsName = activs.name;
                                if(activs.activityLevels !== undefined){
                                    for(var z=0; z< activs.activityLevels.length; z++){
                                        let activLevels = activs.activityLevels[z];
                                        let lvlName = activLevels.name;
                                        let metvalue = activLevels.mets;
                                        if(categoryName.includes("Sports and Workouts")){
                                        if(metvalues.includes(metvalue)){
                                            metvalMap.set(activsName+"-"+lvlName,metvalue);
                                        }
                                    }
                                        document.getElementById("logActivity").append(new Option(activsName+"-"+lvlName, activLevels.id));
                                        document.getElementById("hosting-activities").append(new Option(activsName+"-"+lvlName));
            
                                        activitiesMap.set(activsName+"-"+lvlName,activLevels.id);
                                       
                                    }
                                }
                                else{
                                    let metvalue = activs.mets;
                                    if(categoryName.includes("Sports and Workouts")){
                                    if(metvalues.includes(metvalue)){
                                        metvalMap.set(activsName,metvalue);
                                    }
                                }
                                    document.getElementById("logActivity").append(new Option(activsName, activs.id));
                                    document.getElementById("hosting-activities").append(new Option(activsName));
            
                                    activitiesMap.set(activsName,activs.id);

                                }
                            }

                        }
                    }
                    
                    setTimeout(function(){
                        $("#logActivity").append('</optgroup>');
                    },1000);
                    
                    
                }
                console.log(metvalMap.entries());
               
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();
        


    }

    function getRecommended(metvalMap, metvalues, names){
        $("#cardbody").empty();
        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/profile.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
       xhr.onload = function () {
    if (xhr.status === 200) {
        const data = xhr.response;
        console.log(data);
        let gender = data.user.gender;
        let height = data.user.height;
        let weight = data.user.weight;
        let age = data.user.age;
        if(gender === "MALE"){
            let BMR =  ((10 * weight) + (6.25 * height) - (5* age)  + 5).toFixed(0);
            let remaining = calsBurnedGoal - BMR-activeCals;
            if(remaining < 0){
                $("#activityRec").empty();
                $("#activityRec").append('<div class="row"><div class="col-sm-6"> <div class="card"><div class="card-body"><h5 class="card-title">No need for any more activities today!</h5></div></div></div></div>');
            }
            if(remaining > 0){
                $("#activityRec").empty();
            console.log(remaining);
            if(metvalues.length === 0){
                $("#activityRec").append('<div class="row"><div class="col-sm-6"> <div class="card"><div class="card-body"><h5 class="card-title">N/A, Save Favourite Activities Below</h5></div></div></div></div>');
            }
            console.log(metvalues.length, metvalues);
            for(var j =0; j < metvalues.length; j++){
                let calsperhour = (BMR*metvalues[j]*(60/1440)).toFixed(0);
                let timeInHours=((remaining+(BMR/24))/calsperhour).toFixed(2);
                console.log("time"+timeInHours,calsperhour,remaining);
                let mins = (timeInHours *60).toFixed(0);
                console.log("time"+mins)
                $("#activityRec").append('<div>To reach your Calories Burned Goal, you can do '+mins+' mins of '+names[j]+' today.</div>')
                if(j !== metvalues.length-1){
                    
                    $("#activityRec").append('<div style="font-family:Oswald,sans-serif;">OR</div>');
                }




            }
        }

        }
        else{
            let BMR =  (10 * weight) + (6.25 * height) - (5* age) - 161;
            let remaining = calsBurnedGoal - BMR-activityCalories;
            console.log(remaining);
            if(remaining < 0){
                $("#activityRec").empty();
                $("#activityRec").append('<div>No need for more activities today!</div>');
            }
            if(remaining > 0){
                $("#activityRec").empty();
            console.log(remaining);
            if(metvalues.length === 0){
                $("#activityRec").append('<div class="row"><div class="col-sm-6"> <div class="card"><div class="card-body"><h5 class="card-title">N/A, Save Favourite Activities Below</h5></div></div></div></div>');
            }
            
            for(var j =0; j < metvalues.length; j++){
                let calsperhour = (BMR*metvalues[j]*(60/1440)+1).toFixed(0);
                let timeInHours=((remaining+75.33333)/calsperhour).toFixed(2);
                console.log("time"+timeInHours,calsperhour,remaining);
                let mins = (timeInHours *60).toFixed(0);
                console.log("time"+mins)
                
                $("#activityRec").append('<div>To reach your Calories Burned Goal, you can do '+mins+' mins of '+names[j]+' today.</div>')
                if(j !== metvalues.length-1){
                    
                    $("#activityRec").append('<div style="font-family:Oswald,sans-serif;">OR</div>');
                }
            }
        }
        
        }
        if(metvalues.length === 0){
           $("#cardbody").append('<div class="row"><div class="col-sm-6"> <div class="card"><div class="card-body"><h5 class="card-title">N/A, Save Favourite Activities Below</h5></div></div></div></div>');
     
        }
        console.log(metvalues)
        for(var i = 0; i < metvalues.length; i++){
           
            let nameKeys = [...metvalMap.entries()].filter(({ 1: v }) => v === metvalues[i])  .map(([k]) => k);
            shuffle(nameKeys);
            var index = nameKeys.indexOf(names[i]);
 
           if (index > -1) {
              nameKeys.splice(index, 1);
           }
           console.log(names[i])
            console.log(nameKeys)
            if(nameKeys.length >= 3){
            $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Instead of '+names[i]+' why not try these activities with similar intensity:</h5>')
            $("#cardbody").append('<div class="row"><div class="col-sm-4"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+nameKeys[0]+'</h5></div></div></div><div class="col-sm-4"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+nameKeys[1]+'</h5></div></div></div><div class="col-sm-4"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+nameKeys[2]+'</h5></div></div></div></div><br>')
            }
            if(nameKeys.length == 2){
                $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Instead of '+names[i]+' why not try these activities with similar intensity:</h5>')
                $("#cardbody").append('<div class="row"><div class="col-sm-6"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+nameKeys[0]+'</h5></div></div></div><div class="col-sm-6"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+nameKeys[1]+'</h5></div></div></div></div><br>')
                }
                if(nameKeys.length == 1){
                    $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Instead of '+names[i]+' why not try these activities with similar intensity:</h5>')
                    $("#cardbody").append('<div class="row"><div class="col-sm-6"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+nameKeys[0]+'</h5></div></div></div></div><br>')
                    }
        }
    }
    else{
        console.log("status:"+xhr.status)
    }
    };
    xhr.send();


    }

    $.validator.setDefaults({
        errorClass: 'invalid-feedback',
        highlight: function(element) {
            if ($(element).hasClass('select2-hidden-accessible')){
                $(element)
               .next().find('span.select2-selection')
                .addClass('is-invalid');

            }
            else{
            $(element)
              .closest('.form-control')
              .addClass('is-invalid');
              //console.log(element.next())

            }
          },
          unhighlight: function(element) {
            if ($(element).hasClass('select2-hidden-accessible')){
                $(element)
               .next().find('span.select2-selection')
                .removeClass('is-invalid');

            }
            else{
            $(element)
              .closest('.form-control')
              .removeClass('is-invalid')
            }
              
            
          },
        
        errorPlacement: function (error, element) {
          if (element.hasClass('select2-hidden-accessible') && element.next('.select2-container').length) {
            error.insertAfter(element.next('.select2-container'));
          } else {
            error.insertAfter(element);
          }
        }
      });

    $.validator.addMethod('correctFormat', function(value, element) {
        var reg = /[0-2]/;
        var reg1 = /[0-3]/;
        var reg2 = /[0-5]/;
        var reg3 = /[0-9]/;
        var regex  = /[:]/;
        return this.optional(element) 
          || value.length === 5
          && reg.test(value.charAt(0))
          && reg3.test(value.charAt(1))
          && regex.test(value.charAt(2))
          && reg2.test(value.charAt(3))
          && reg3.test(value.charAt(4));
      }, 'Please specify time in the format 00:00 to 23:59');

      $.validator.addMethod('correctDuration', function(value, element) {
        var reg = /[0-9]/;
        var regex  = /[:]/;
        return this.optional(element) 
          || value.length === 8
          && reg.test(value.charAt(0))
          && reg.test(value.charAt(1))
          && regex.test(value.charAt(2))
          && reg.test(value.charAt(3))
          && reg.test(value.charAt(4))
          && regex.test(value.charAt(5))
          && reg.test(value.charAt(6))
          && reg.test(value.charAt(7)) ;
      }, 'Please specify duration in the format hh:mm:ss');
    
    $("#logForm").validate({
        rules: {
            logActivity:{
                required: true

            } ,
            logStartTime:{
                required:true,
                correctFormat: true

            },
            logDuration:{
                required:true,
                correctDuration: true

            },
            
        },
        messages: {
            logActivity:{
                required: "Please specify an activity"

            } ,
            logStartTime:{
                required:"Please specify a start time",

            },
            logDuration:{
                required:"Please specify duration",

            },
           
           
        }
    });

    $("#createForm").validate({
        rules: {
            newActivity:{
                required: true,
                minlength: 3

            } ,
            newStartTime:{
                required:true,
                correctFormat: true

            },
            newDuration:{
                required:true,
                correctDuration: true

            },
            newCals:{
                required:true,
            },
        },
        messages: {
            newActivity:{
                required: "Please specify an activity",
                minlength: "Name must be atleast 3 characters"

            } ,
            newStartTime:{
                required:"Please specify a start time",

            },
            newDuration:{
                required:"Please specify duration",

            },
            newCals:{
                required:"Please specify Calories",
            }
           
        }
    });
    
    $("#saveActivity").click(function(e){
        var valid = $("#logForm").valid();
        if(valid === false){
           
        }
        else{
         
        let activity = $("#logActivity").val();
        let startTime = $("#logStartTime").val();
        let dur = $("#logDuration").val();
        var cals="" ;
        if($("#logCals").val() != ""){
            cals = $("#logCals").val();
            
        }
        var distance = "";
        if($("#logDist").val() != ""){
            distance = parseFloat($("#logDist").val());
            
        }

        let durArray = dur.split(":")
        let hours = (parseFloat(durArray[0])*3600000);
        let mins = (parseFloat(durArray[1])*60000);
        let seconds= (parseFloat(durArray[2])*1000);
        let duration = hours+mins+seconds;

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
        console.log(activity+startTime+baseDate+duration+"CAls"+cals)
        
        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
        var param = "";
        if(cals === "" && distance === ""){
         param = 'activityId='+activity+"&startTime="+startTime+"&durationMillis="+duration+"&date="+baseDate;
        }
        if(cals !== ""){
            param = 'activityId='+activity+"&startTime="+startTime+"&durationMillis="+duration+"&date="+baseDate+"&manualCalories="+cals;
        }
        if(distance !== ""){
            param = 'activityId='+activity+"&startTime="+startTime+"&durationMillis="+duration+"&date="+baseDate+"&distance="+distance;
        }
        if(cals !== "" && distance !== ""){
            param = 'activityId='+activity+"&startTime="+startTime+"&durationMillis="+duration+"&date="+baseDate+"&manualCalories="+cals+"&distance="+distance;
           }
           console.log("param:"+param);

        xhr.open('POST', 'https://api.fitbit.com/1/user/-/activities.json?'+param);
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

          $("#logForm").find('#logStartTime , #logDuration , #logCals , #logDist').val("");
$("#logActivity").val( null).trigger('change');
 totalCals = 0;
 totalDist= 0;
 totalDuration = 0;

    resetCanvas();
    getWeeklyCalsBurned();
    getActivityLogs();

       
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
wasClicked++;

        }

    });

    $("#saveNewActivity").click(function(){
        var valid = $("#createForm").valid();
        if(valid === false){
           
        }
        else{

        let activity = $("#newActivity").val();
        let startTime = $("#newStartTime").val();
        let dur = $("#newDuration").val();
       
        let  cals = $("#newCals").val();
            
       
        var distance = "";
        if($("#newDist").val() != ""){
            distance = parseFloat($("#newDist").val());
            
        }

        let durArray = dur.split(":")
        let hours = (parseFloat(durArray[0])*3600000);
        let mins = (parseFloat(durArray[1])*60000);
        let seconds= (parseFloat(durArray[2])*1000);
        let duration = hours+mins+seconds;

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
        console.log(activity+startTime+baseDate+duration+"CAls"+cals)
        
        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
        var param = "";
        if(cals === "" && distance === ""){
         param = 'activityName='+activity+"&startTime="+startTime+"&durationMillis="+duration+"&date="+baseDate;
        }
        if(cals !== ""){
            param = 'activityName='+activity+"&startTime="+startTime+"&durationMillis="+duration+"&date="+baseDate+"&manualCalories="+cals;
        }
        if(distance !== ""){
            param = 'activityName='+activity+"&startTime="+startTime+"&durationMillis="+duration+"&date="+baseDate+"&distance="+distance;
        }
        if(cals !== "" && distance !== ""){
            param = 'activityName='+activity+"&startTime="+startTime+"&durationMillis="+duration+"&date="+baseDate+"&manualCalories="+cals+"&distance="+distance;
           }
           console.log("param:"+param);

        xhr.open('POST', 'https://api.fitbit.com/1/user/-/activities.json?'+param);
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
       xhr.onload = function () {
    if (xhr.status === 201) {
        const data = xhr.response;
        console.log(data);
        location.reload();
       
    }
    else{
        console.log("Status:"+xhr.status);
    }
};
xhr.send();

        }
    });


    function getFavouriteActivities(){
        metvalues = [];
        names = [];
        $("#logActivity").append('<option style="display:none;"></option>');
        return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/favorite.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
                $("#logActivity").append('<optgroup label="Favourite Activities">');
                for(var i = 0; i< data.length; i++){

                    let act = data[i];
                    metvalues.push(act.mets);
                    let actString = "";
                    if(act.description !== ""){
                     actString = act.name+"/"+act.description;
                    }
                    else{
                        actString = act.name;
                    }
                    names.push(actString);
                    activitiesMap.set(actString,act.activityId);
                    document.getElementById("logActivity").append(new Option(actString, act.activityId));
                        
                    document.getElementById("fave-activities").append(new Option(actString));
                   

                   
                    
                }
                console.log(metvalues);
                setTimeout(function(){
                    $("#logActivity").append('</optgroup>');
                   
                   


                },1000);
                getActivities(metvalues,names);
                resolve();
                
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();
    });

    }

    function analyseActivityLevel(){
        var analyseMap = new Map();
        $("#trend").empty();
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
            let baseDate = year+'-'+month+'-'+day;
            let startDate = year+'-'+month+'-01';
    
        var xhr = new XMLHttpRequest();
        
        xhr.responseType = 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/calories/date/'+startDate+'/'+baseDate+'.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;  
                let weekly = data["activities-calories"];
                let counter = 0;
                for(var j =0; j < weekly.length; j++){
                    console.log(weekly[j].value,weekly[j].dateTime);
                    analyseMap.set(weekly[j].dateTime,weekly[j].value*1);
                    if(weekly[j].value >= calsBurnedGoal){
                        counter++;
                    }

                   
                }
                $("#monthNum").text("You have achieved your Calories Burned goal "+ counter+"/"+weekly.length+ " times this month so far.");
                a = [];
                for(var x of analyseMap) 
                  a.push(x);
                
                a.sort(function(x, y) {
                  return y[1] - x[1];
                });  
                  
                sorted = new Map(a);
                console.log(sorted.entries());
                let days = Array.from(sorted.keys());
                console.log(days); 
                let topDays = (days.length*0.33333).toFixed(0);
                if(topDays ==  0 || topDays == 1){
                    $("#trend").append('<div class="row"><div class="col-sm-6"> <div class="card"><div class="card-body"><h5 class="card-title">N/A not enough days to determine best active days</h5></div></div></div></div>');

                }
                else{
                let monCounter = 0;
                let tueCounter = 0;
                let wedCounter = 0;
                let thurCounter = 0;
                let friCounter = 0;
                let satCounter = 0;
                let sunCounter = 0;
               // console.log("topdays"+ topDays);
                for(var j = 0 ; j < topDays; j++){
                    console.log(days[j]);
                    var date = new Date(days[j]);
                    console.log(date);
                    let day = date.getDay();
                    if(day === 0){
                        sunCounter ++;

                    }
                    if(day === 1){
                        monCounter ++;

                    }
                    if(day === 2){
                        tueCounter ++;

                    }
                    if(day === 3){
                        wedCounter ++;

                    }
                    if(day === 4){
                        thurCounter ++;

                    }
                    if(day === 5){
                        friCounter ++;

                    }
                    if(day === 6){
                        satCounter ++;

                    }
                
                }
                console.log(monCounter,tueCounter,wedCounter,thurCounter,friCounter,satCounter,sunCounter);
                var dayArray = [monCounter,tueCounter,wedCounter,thurCounter,friCounter,satCounter,sunCounter];
            if(identical(dayArray)){
                $("#trend").append('<div class="row"><div class="col-sm-6"> <div class="card"><div class="card-body"><h5 class="card-title">You are equally productive each day!</h5></div></div></div></div>');

            }
            else{
                var numbers = {
                    Monday:  monCounter,
                    Tueday:  tueCounter,
                    Wednesday: wedCounter,
                    Thursday: thurCounter,
                    Friday: friCounter,
                    Saturday: satCounter,
                    Sunday: sunCounter
                  };
                  
                  
                    var keys = Object.keys(numbers);
                    keys.sort(function(a,b){
                      return numbers[b] - numbers[a];
                    })
                     let topTwo = keys.slice(0,2);
                     $("#trend").append('<div class="row"><div class="col-sm-3"> <div class="card"><div class="card-body"><h5 class="card-title">1. '+topTwo[0]+'</h5></div></div></div><div class="col-sm-3"> <div class="card h-80"><div class="card-body"><h5 class="card-title">2. '+topTwo[1]+'</h5></div></div></div></div>');

                }
                
                }
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();
    
    }

getFoodGoals();
getFavouriteActivities().then(getActivityLogs).then(function(){
    getWeeklyCalsBurned();
    getActivityProgress();
});
    
    
   
    
    

});



function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

   

    return hours + " hrs " + minutes + " mins " + seconds + " secs";
}

function identical(array) {
    for(var i = 0; i < array.length - 1; i++) {
        if(array[i] !== array[i+1]) {
            return false;
        }
    }
    return true;
}

function shuffle(array) {
    var currIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currIndex);
      currIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currIndex];
      array[currIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }