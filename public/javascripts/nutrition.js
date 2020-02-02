$(document).ready(function(){
    var access_token = getCookie("token");
    var calsInGoal;
    var currIn;

    function getWeeklyCalsIn(){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/foods/log/caloriesIn/date/today/7d.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
                let weekly = data["foods-log-caloriesIn"];
                    if(weekly.length === 0){
                        createLineChart(null,null,"Not Data Available!");
    
                    }
                    else{
                    const calsIn = weekly.map(entries => entries.value);
                
                    const day = weekly.map(entries => entries.dateTime);
                
                    let title = "7 day Calories Intake Comparison graph"
                    createLineChart(day,calsIn,title);
                    }
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();
    };

    function resetCanvas(){
        $('#caloriesIn').remove(); // this is my <canvas> element
        $('#graphContainer').append('<canvas class="col-10 col-sm-10 col-md-10 col-lg-10 col-xl-12" id="caloriesIn" width="1000vw" height="450vh"></canvas>');
       
      };

    async function createLineChart( xlabels, ylabels,title ){
        await xlabels;
        await ylabels;
        var ctx = document.getElementById('caloriesIn').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xlabels,
            datasets: [{
                label: 'Calories Intake in last 7 days',
                fill: false,
                data: ylabels,
                backgroundColor: ['yellow',],
                borderColor: ['yellow', ],
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

    function getNutritionLogs(){
        var rows = $('#nutritionLog tbody tr').length;
        console.log("rows:"+rows);
        var index= 0;
        var table= document.getElementById('nutritionLog').getElementsByTagName('tbody')[0];
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
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/foods/log/date/'+baseDate+'.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
                calsInGoal = data.goals.calories;
                currIn = data.summary.calories;
                
                for(var i =data.foods.length-1 ; i>=0; i--){
                    let tableRef = document.getElementById('nutritionLog').getElementsByTagName('tbody')[0];
                    var newRow   = tableRef.insertRow();
                    var unit =data.foods[i].loggedFood.unit.plural;
    
                     var name  = newRow.insertCell(0);
                     var nameText  = document.createTextNode(data.foods[i].loggedFood.name);
                     name.appendChild(nameText);
                     var type  = newRow.insertCell(1);
                     var text ="";
                     if(data.foods[i].loggedFood.mealTypeId === 1){text = "BreakFast"};
                     if(data.foods[i].loggedFood.mealTypeId === 2){text = "Morning Snack"}
                     if(data.foods[i].loggedFood.mealTypeId === 3){text = "Lunch"}
                     if(data.foods[i].loggedFood.mealTypeId === 4){text = "Afternoon Snack"}
                     if(data.foods[i].loggedFood.mealTypeId === 5){text = "Dinner"}
                     if(data.foods[i].loggedFood.mealTypeId === 7){text = "Anytime"}
                    typeText  = document.createTextNode(text);
                     type.appendChild(typeText);
                     var amount  = newRow.insertCell(2);
                     var amountText  = document.createTextNode(data.foods[i].loggedFood.amount+" "+unit);
                     amount.appendChild(amountText);
                     var brand = newRow.insertCell(3);
                     var brandText = document.createTextNode(data.foods[i].loggedFood.brand);
                     brand.appendChild(brandText)
                    
                     var calories  = newRow.insertCell(4);
                     var caloriesText  = document.createTextNode(data.foods[i].loggedFood.calories+" kcal");
                     calories.appendChild(caloriesText);
                     var carb  = newRow.insertCell(5);
                     var carbText  = document.createTextNode(data.foods[i].nutritionalValues.carbs+" "+unit);
                     carb.appendChild(carbText);
                     var fat  = newRow.insertCell(6);
                     var fatText  = document.createTextNode(data.foods[i].nutritionalValues.fat+" "+unit);
                     fat.appendChild(fatText);
                     var fiber  = newRow.insertCell(7);
                     var fiberText  = document.createTextNode(data.foods[i].nutritionalValues.fiber+" "+unit);
                     fiber.appendChild(fiberText);
                     var protein  = newRow.insertCell(8);
                     var proteinText  = document.createTextNode(data.foods[i].nutritionalValues.protein+" "+unit);
                     protein.appendChild(proteinText);
                     var manage  = newRow.insertCell(9);
                     var deleteButton =document.createElement("input");
                     deleteButton.type ="button";
                     deleteButton.value = "Delete";
                     let logID = data.foods[i].logId;
                     deleteButton.onclick = function(){deleteLog(logID);};
                     manage.appendChild(deleteButton);
    
                    
                }
               
               
            }
            else{
                console.log("Status:"+xhr.status);
            }
        };
        xhr.send();

        //setTimeout(function(){
          //  getActivityProgress();
            //    },1000);
      
    
    }

    function deleteLog(logID){
        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
          xhr.open('DELETE', 'https://api.fitbit.com/1/user/-/foods/log/'+logID+'.json?');
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
        getWeeklyCalsIn();
        getNutritionLogs(); 
    },1500);
    
    }

    function getNutritionProgress(){
        document.getElementById("red").setAttribute("style","width:0%");
        document.getElementById("yellow").setAttribute("style","width:0%");
        document.getElementById("green").setAttribute("style","width:0%");
    
       
        let remaining = calsInGoal - currIn;
        let progress = (currIn/calsInGoal).toFixed(2)*100;
        console.log(progress);
        document.getElementById("goal").textContent =  calsInGoal+" kcal";
        if(currIn ===0){
            document.getElementById("progressStatus").textContent ="N/A please ensure a nutrition log and goal exists for progress";
            document.getElementById("red").setAttribute("style","width:0%");
            document.getElementById("yellow").setAttribute("style","width:0%");
            document.getElementById("green").setAttribute("style","width:0%");
    
    
        }
        
        if(currIn !=0){
            document.getElementById("progressStatus").textContent = " Current Calories Intale Progress: "+currIn+" kcal("+Math.abs(remaining)+" kcal remaining)";
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
                    document.getElementById("progressStatus").textContent = "You have exceeded your goal! Current Calories Burned: "+currIn+" kcal("+Math.abs(remaining)+" kcal more)";
                    document.getElementById("red").setAttribute("style","width:34%");
                    document.getElementById("yellow").setAttribute("style","width:41%");
                    document.getElementById("green").setAttribute("style","width:25%");
                    }
    
                if(remaining ===0){
                    document.getElementById("progressStatus").textContent = "Congratulations! You have reached your goal of "+currIn+" kcal!";
                document.getElementById("red").setAttribute("style","width:34%");
                document.getElementById("yellow").setAttribute("style","width:41%");
                document.getElementById("green").setAttribute("style","width:25%");
                }
        
        
            }
        
        
        }
    
    
    
    }
    function getUnits(){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/foods/units.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();

    }

    function getFoods(){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        var param = encodeURI("baked beans");
        console.log(param);
        query = "query="+param;
        xhr.open('GET', 'https://api.fitbit.com/1/foods/search.json?'+query);
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
                
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();
        


    }

    getWeeklyCalsIn();
    getNutritionLogs();
    getUnits();
    getFoods();
    setTimeout(function(){
        getNutritionProgress();

    },1000);

});