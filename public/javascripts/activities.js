$(document).ready(function(){
    var access_token = getCookie("token");
    var calsBurnedGoal;
    var currBurned;
    var activitiesMap = new Map();
    $('#logActivity').select2({placeholder: "Search Activity....", allowClear: true});
    
    


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
        $('#graphContainer').append('<canvas class="col-10 col-sm-10 col-md-10 col-lg-10 col-xl-12" id="caloriesBurned" width="1000vw" height="450vh"></canvas>');
       
      };

    async function createLineChart( xlabels, ylabels,title ){
        await xlabels;
        await ylabels;
        var ctx = document.getElementById('caloriesBurned').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xlabels,
            datasets: [{
                label: 'Calories Burned in last 7 days',
                fill: false,
                data: ylabels,
                backgroundColor: ['rgb(204, 51, 51)',],
                borderColor: ['rgb(204, 51, 51)', ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: false,
            title: {
                display: true,
                text: title,
                fontSize: 20,
            },
            scales: {
                xAxes: [{
                    display: true,
                    ticks: {
                        display: true, //this will remove only the label
                    
                    }
                }],
                yAxes: [{
                    ticks: {
                        
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
                     var distanceText = document.createTextNode(dist+" km");
                     distance.appendChild(distanceText);
                     }
                     else{
                        var distanceText = document.createTextNode("N/A");
                        distance.appendChild(distanceText);

                     }
                     var dur  = newRow.insertCell(4);
                     var durText  = document.createTextNode(data.activities[i].duration/60000 +" mins");
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
               
               
            }
            else{
                console.log("Status:"+xhr.status);
            }
        };
        xhr.send();
        setTimeout(function(){
            getActivityProgress();
                },1000);
      
    
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
       
    }
    else{
        console.log("Status:"+xhr.status);
    }
    };
    xhr.send();
    
    setTimeout(function(){
        resetCanvas();
        getWeeklyCalsBurned();
        getActivityLogs(); 
    },1500);
    
    
    
    }

    function getActivityProgress(){
        document.getElementById("red").setAttribute("style","width:0%");
        document.getElementById("yellow").setAttribute("style","width:0%");
        document.getElementById("green").setAttribute("style","width:0%");
    
       
        let remaining = calsBurnedGoal - currBurned;
        let progress = (currBurned/calsBurnedGoal).toFixed(2)*100;
        console.log(progress);
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

    function getActivities(){
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
                                document.getElementById("logActivity").append(new Option(activityName+"-"+levelName, activityLevels.id));
                                activitiesMap.set(activityName+"-"+levelName,activityLevels.id);
                             //   console.log("activitylevel:"+ activityLevels.id)
                            }

                        }
                        
                       
                        else{
                        //console.log(activities);
                        document.getElementById("logActivity").append(new Option(activityName, activities.id));
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
                                        document.getElementById("logActivity").append(new Option(activsName+"-"+lvlName, activLevels.id));
                                        activitiesMap.set(activsName+"-"+lvlName,activLevels.id);
                                        console.log("activleel:"+ activLevels.id)
                                        console.log("aaacitvitylevels:"+activitiesMap.get(activsName+"-"+lvlName));
                                    }
                                }
                                else{
                                    document.getElementById("logActivity").append(new Option(activsName, activs.id));
                                    activitiesMap.set(activsName,activs.id);

                                }
                            }

                        }
                    }
                    
                }
                
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();
        


    }

    $("#saveActivity").click(function(){
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
       
    }
    else{
        console.log("Status:"+xhr.status);
    }
};
xhr.send();

setTimeout(function(){
    resetCanvas();
    getWeeklyCalsBurned();
    getActivityLogs();
},1500);




    });


    getWeeklyCalsBurned();
    getActivityLogs();
    getActivities();
    setTimeout(function(){
        getActivityProgress();
    },1000);

});
