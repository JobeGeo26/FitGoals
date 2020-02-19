$(document).ready(function(){
    var access_token = getCookie("token");
    var calsInGoal;
    var currIn;
    var intensity;
    var foodIdMap = new Map();
    var units = new Map();
    var foodAccessMap = new Map();
    var foodUnitMap = new Map();
    var foodDefUnitMap = new Map();
    var foodDefSizeMap = new Map();
    var totalCals = 0;
    var totalCarbs= 0;
    var totalFats = 0;
    var totalFibers= 0;
    var totalProtein= 0;
    var wasClicked = 0;
    var change = 0;
    $('#logFood').select2({placeholder: "Start Typing....", allowClear: true});

    $("#logFood").append('<option style="display:none;"></option>');
    $("#logType").val("");

    $("#logFood").on('change', function (e) {  
        if(wasClicked === change){
        $(this).valid();
        }
        else{
            change = wasClicked;
        }
    });
    $("#logAmount").on('change', function (e) {  
        if(wasClicked === change){
        $(this).valid();
        }
        else{
            change = wasClicked;
        }
    });
    $("#logUnit").on('change', function (e) {  
        if(wasClicked === change){
        $(this).valid();
        }
        else{
            change = wasClicked;
        }
    });

    $.validator.addMethod('checkUnit', function(value, element) {
        return foodUnitMap.get(value);
      }, 'Please pick a unit in the list');

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

    $("#logForm").validate({
        rules: {
            logFood:{
                required: true

            } ,
            logType:{
                required:true,
               

            },
            logAmount:{
                required:true,
                

            },
            logUnit:{
                required:true,
                
                

            },
            
        },
        messages: {
            logFood:{
                required: "Please specify a food item",

            } ,
            logType:{
                required:"Please specify a meal type",
               

            },
            logAmount:{
                required:"Please specify amount",
                

            },
            logUnit:{
                required:"Please specify a food unit",
                
                

            },
           
           
        }
    });
    $("#createForm").validate({
        rules: {
            newName:{
                required: true,
                minlength: 3,

            } ,
            newAmount:{
                required:true,
               

            },
            newUnit:{
                required:true,
                checkUnit: true,
                

            },
            newCals:{
                required:true,
                

            },
            newCarbs:{
                required:true,
                

            },
            newFats:{
                required:true,
                

            },
            newFiber:{
                required:true,
                

            },
            newProtein:{
                required:true,
                

            },
            
        },
        messages: {
            newName:{
                required: "Please specify food name",
                minlength: "Name must be atleast 3 characters"

            } ,
            newAmount:{
                required:"Please specify food default size",
               

            },
            newUnit:{
                required:"Please specify food default unit",
                

            },
            newCals:{
                required:"Please specify food default Calories",
                

            },
            newCarbs:{
                required:"Please specify food default carbohydrates",
                

            },
            newFats:{
                required:"Please specify food default fats",
                

            },
            newFiber:{
                required:"Please specify food default fibers",
                

            },
            newProtein:{
                required:"Please specify food default proteins",
                

            },
           
        }
    });
    function getFoodGoals(){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/foods/log/goal.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
                intensity = data.foodPlan.intensity;
                
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
               
               let currBurned = data.summary.caloriesOut;
               let balance = currIn - currBurned;
               console.log(balance);
               if(intensity === "MAINTENANCE"){

                document.getElementById("balStatus").textContent = "N/A for maintenance and weight gain";
            }
               if(intensity === "EASIER"){

                if(balance === -250){
                    getBalanceGauge(150);
                    document.getElementById("balStatus").textContent = "Goal Caloric deficit met: 250 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";

                }
                if(balance < -250){
                    getBalanceGauge(250);
                    document.getElementById("balStatus").textContent = "Over Caloric deficit goal: 250 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";

                }
                if(balance >-250){
                    getBalanceGauge(50);
                    document.getElementById("balStatus").textContent = "Under Caloric deficit goal: 250 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";
                }
               }
               
               if(intensity === "MEDIUM"){

                if(balance === -500){
                    getBalanceGauge(150);
                    document.getElementById("balStatus").textContent = "Goal Caloric deficit met: 500 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";

                }
                if(balance < -500){
                    getBalanceGauge(250);
                    document.getElementById("balStatus").textContent = "Over Caloric deficit goal: 500 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";


                }
                if(balance >-500){
                    getBalanceGauge(50);
                    document.getElementById("balStatus").textContent = "Under Caloric deficit goal: 500 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";

                }
               }
               if(intensity === "KINDAHARD"){

                if(balance === -750){
                    getBalanceGauge(150);
                    document.getElementById("balStatus").textContent = "Goal Caloric deficit met: 750 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";

                }
                if(balance < -750){
                    getBalanceGauge(250);
                    document.getElementById("balStatus").textContent = "Over Caloric deficit goal: 750 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";


                }
                if(balance >-750){
                    getBalanceGauge(50);
                    document.getElementById("balStatus").textContent = "Under Caloric deficit goal: 750 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";


                }
               }
               if(intensity === "HARDER"){

                if(balance === -1000){
                    getBalanceGauge(150);
                    document.getElementById("balStatus").textContent = "Goal Caloric deficit met: 1,000 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";


                }
                if(balance < -1000){
                    getBalanceGauge(250);
                    document.getElementById("balStatus").textContent = "Over Caloric deficit goal: 1,000 kcal"
                    document.getElementById("inVsOut").textContent = currIn +" kcals in VS "+currBurned+" kcals out";



                }
                if(balance >-1000){
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
        $('#caloriesIn').css({'background-image': 'linear-gradient(to bottom,  #93FB9D 0%, #09C7FB 100%)'});
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xlabels,
            
            datasets: [{
                label: 'Calories Intake in last 7 days',
               
                fill: false,
                data: ylabels,
                backgroundColor: "rgba(255, 255, 255,0.7)",
                borderColor:'white',
                borderWidth: 2
            }]
        },
        
        options: {
            responsive: false,
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
                        fontColor: 'white'
                        
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
                  value: calsInGoal,
                  borderColor: 'white',
                  borderWidth: 4,
                  label: {
                    enabled: true,
                    content: 'Calories Intake Goal: '+calsInGoal
                    
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
                    if (unit === "grams"){
                        unit = "g";
                    }
    
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
                     totalCals += data.foods[i].loggedFood.calories;
                     var caloriesText  = document.createTextNode(data.foods[i].loggedFood.calories+" kcal");
                     calories.appendChild(caloriesText);
                     console.log(totalCals);
                     if(data.foods[i].nutritionalValues !== undefined){
                     totalCarbs += data.foods[i].nutritionalValues.carbs;
                     totalFats +=data.foods[i].nutritionalValues.fat;
                     totalFibers +=data.foods[i].nutritionalValues.fiber;
                     totalProtein +=data.foods[i].nutritionalValues.protein;
                   
                     var carb  = newRow.insertCell(5);
                     var carbText  = document.createTextNode(data.foods[i].nutritionalValues.carbs+" g");
                     carb.appendChild(carbText);
                     var fat  = newRow.insertCell(6);
                     var fatText  = document.createTextNode(data.foods[i].nutritionalValues.fat+" g");
                     fat.appendChild(fatText);
                     var fiber  = newRow.insertCell(7);
                     var fiberText  = document.createTextNode(data.foods[i].nutritionalValues.fiber+" g");
                     fiber.appendChild(fiberText);
                     var protein  = newRow.insertCell(8);
                     var proteinText  = document.createTextNode(data.foods[i].nutritionalValues.protein+" g");
                     protein.appendChild(proteinText);
                     }
                     else{
                         newRow.insertCell(5);
                         newRow.insertCell(6)
                         newRow.insertCell(7)
                         newRow.insertCell(8)
                     }
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
       



        setTimeout(function(){
            let tableRef = document.getElementById('nutritionLog').getElementsByTagName('tbody')[0];
            var newRow   = tableRef.insertRow();
            newRow.style.fontWeight = 'bold';
            newRow.insertCell(0);
            newRow.insertCell(1);
            newRow.insertCell(2);
           var total =  newRow.insertCell(3);
        
            var calories  = newRow.insertCell(4);
            var caloriesText  = document.createTextNode(totalCals+" kcal");
            calories.appendChild(caloriesText);
            var carb  = newRow.insertCell(5);
            var carbText  = document.createTextNode(totalCarbs.toFixed(2)+" g");
            carb.appendChild(carbText);
            var fat  = newRow.insertCell(6);
            var fatText  = document.createTextNode(totalFats.toFixed(2)+" g");
            fat.appendChild(fatText);
            var fiber  = newRow.insertCell(7);
            var fiberText  = document.createTextNode(totalFibers.toFixed(2)+" g");
            fiber.appendChild(fiberText);
            var protein  = newRow.insertCell(8);
            var proteinText  = document.createTextNode(totalProtein.toFixed(2)+" g");
            protein.appendChild(proteinText);
            newRow.insertCell(9);
           getNutritionProgress();
           getBalance();
               },1000);
      
    
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
        totalCals= 0;
        totalCarbs =0;
        totalFats = 0;
        totalFibers = 0;
        totalProtein = 0;
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
            document.getElementById("progressStatus").textContent = " Current Calories Intake Progress: "+currIn+" kcal("+Math.abs(remaining)+" kcal remaining)";
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
                    document.getElementById("progressStatus").textContent = "You have exceeded your goal! Current Calories In: "+currIn+" kcal("+Math.abs(remaining)+" kcal more)";
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

    function getFavouriteFoods(){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/foods/log/favorite.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
                $("#logFood").append('<optgroup label="Favourite Foods">');
                for(var i = 0; i< data.length; i++){

                    let food = data[i];
                    let foodName = food.name;
                    let foodBrand = food.brand;
                    let foodItem = "";
                    if(foodBrand ===""){
                     foodItem = foodName+", Brand: N/A";
                    }
                    else{
                        foodItem = foodName+", Brand: "+foodBrand;

                    }
                    let foodUnits = food.units;
                    
                    let servingSize= "";
                    if(food.defaultServingSize !==1 ){
                    servingSize = "default size: "+food.defaultServingSize +" "+food.defaultUnit.plural;
                    }
                    else{
                        servingSize = "default size: "+food.defaultServingSize +" "+food.defaultUnit.name;
                    }
                    let cals = "Calories: "+food.calories;
                    foodUnitMap.set(foodItem+"  "+servingSize+ "  "+cals,foodUnits);
                    foodDefSizeMap.set(foodItem+"  "+servingSize+ "  "+cals,food.defaultServingSize);
                    foodDefUnitMap.set(foodItem+"  "+servingSize+ "  "+cals,food.defaultUnit.id);
                    foodIdMap.set(foodItem+" "+servingSize+ " "+cals,food.foodId);
                    foodAccessMap.set(foodItem+"  "+servingSize+ "  "+cals,food.accessLevel)
                    
                    document.getElementById("logFood").append(new Option(foodItem+"  "+servingSize+ "  "+cals, food.foodId));
                    document.getElementById("fave-foods").append(new Option(foodItem+"  "+servingSize+ "  "+cals));
                   
                
                    
                }
                setTimeout(function(){
                    $("#logFood").append('</optgroup>');
                    $("#logFood").append('<optgroup label="Previous Results">');


                },1000);
                
                
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();

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
                for(var j= 0; j <data.length ;j++){
                units.set(data[j].id,data[j].plural)
                document.getElementById("unitList").append(new Option(data[j].plural));
                foodUnitMap.set(data[j].plural,data[j].id)
                }
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();

    }


    $(document).on('keyup', '#addFave', function () {  
        var input = $("#addFave").val();
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        var param = encodeURI(input);
        console.log(param);
        query = "&query="+param;
        xhr.open('GET', 'https://api.fitbit.com/1/foods/search.json?'+query);
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
              
                
                console.log(data);
               

                for(var i = 0; i< data.foods.length; i++){

                    let food = data.foods[i];
                    let foodName = food.name;
                    let foodBrand = food.brand;
                    let foodItem = "";
                    if(foodBrand ===""){
                     foodItem = foodName+", Brand: N/A";
                    }
                    else{
                        foodItem = foodName+", Brand: "+foodBrand;

                    }
                    let foodUnits = food.units;
                    
                    let servingSize= "";
                    if(food.defaultServingSize !==1 ){
                    servingSize = "default size: "+food.defaultServingSize +" "+food.defaultUnit.plural;
                    }
                    else{
                        servingSize = "default size: "+food.defaultServingSize +" "+food.defaultUnit.name;
                    }
                    let cals = "Calories: "+food.calories;
                   foodIdMap .set(foodItem+" "+servingSize+ " "+cals,food.foodId)
                    
                    document.getElementById("hosting-foods").append(new Option(foodItem+"  "+servingSize+ "  "+cals));

                
                    
                }
                
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();
        
    });

    $("#submitFave").click(function(){
        var input = $("#addFave").val();
        console.log(input)
        
        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
        var param  = foodIdMap.get(input);
        console.log(param);

        xhr.open('POST', 'https://api.fitbit.com/1/user/-/foods/log/favorite/'+param+'.json');
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
        var param  = foodIdMap.get(input);
        console.log(foodIdMap.entries());

        xhr.open('DELETE', 'https://api.fitbit.com/1/user/-/foods/log/favorite/'+param+'.json');
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

    $(document).on('keyup', '.select2-search__field', function () {  
        var input = $(".select2-search__field").val();
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        var param = encodeURI(input);
        console.log(param);
        query = "&query="+param;
        xhr.open('GET', 'https://api.fitbit.com/1/foods/search.json?'+query);
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
              
                
                console.log(data);
               

                for(var i = 0; i< data.foods.length; i++){

                    let food = data.foods[i];
                    let foodName = food.name;
                    let foodAccess = food.accessLevel;
                    let foodBrand = food.brand;
                    let foodItem = "";
                    if(foodBrand ===""){
                     foodItem = foodName+", Brand: N/A";
                    }
                    else{
                        foodItem = foodName+", Brand: "+foodBrand;

                    }
                    let foodUnits = food.units;
                    
                    let servingSize= "";
                    if(food.defaultServingSize !==1 ){
                    servingSize = "default size: "+food.defaultServingSize +" "+food.defaultUnit.plural;
                    }
                    else{
                        servingSize = "default size: "+food.defaultServingSize +" "+food.defaultUnit.name;
                    }
                    let cals = "Calories: "+food.calories;
                    foodUnitMap.set(foodItem+"  "+servingSize+ "  "+cals,foodUnits);
                    foodDefSizeMap.set(foodItem+"  "+servingSize+ "  "+cals,food.defaultServingSize);
                    foodDefUnitMap.set(foodItem+"  "+servingSize+ "  "+cals,food.defaultUnit.id);
                    foodAccessMap.set(foodItem+"  "+servingSize+ "  "+cals,foodAccess);
                    setTimeout(function(){
                    document.getElementById("logFood").append(new Option(foodItem+"  "+servingSize+ "  "+cals, food.foodId));
                    },1000);
                
                    
                }
                
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();
        
    });
    $("#logFood").on('select2:select', function (e) {  
        $("#logUnit").empty();
        $("#logFave").val($("#logFave option:first").val());
      
        var html =e.params.data.text;
        if(foodAccessMap.get(html) === "PRIVATE"){
            $('#logFave').prop('disabled', 'disabled');
        }
        else{
            $('#logFave').prop('disabled', false);
        }
        

        

        var fUnits = foodUnitMap.get(html);
        
        let foodDefSize = foodDefSizeMap.get(html);
        let foodDefUnit = foodDefUnitMap.get(html);
      //  console.log(foodUnitMap.keys().next().value );



        console.log(fUnits+foodDefSize+foodDefUnit);
        document.getElementById("logAmount").value = foodDefSize;
        let defUnit = units.get(foodDefUnit);
        $("#logUnit").append('<option value="'+ foodDefUnit+'">'+defUnit+'</option>');
        for(var j = 0; j< fUnits.length; j++){
            if(fUnits[j] !== foodDefUnit){
                let fdUnit = units.get(fUnits[j]);
                $("#logUnit").append('<option value="'+ fUnits[j]+'">'+fdUnit+'</option>');
            }
        }
        //console.log($("#logFood").val());
    
    });
    

    $("#saveFood").click(function(){
        var valid = $("#logForm").valid();
        if(valid === false){
           
        }
        else{
        let food = $("#logFood").val();
        let type = $("#logType").val();
        let amount = $("#logAmount").val();
        let unit = $("#logUnit").val();
        let isfave ="";
        if( $("#logFave").val() !=="N/A"){
         isfave = $("#logFave").val();
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
      
        var xhr = new XMLHttpRequest();
        xhr.responseType= 'json';
        var param  = 'foodId='+food+"&mealTypeId="+type+"&unitId="+unit+"&date="+baseDate+"&amount="+amount+"&favorite="+isfave;
           console.log("param:"+param);

        xhr.open('POST', 'https://api.fitbit.com/1/user/-/foods/log.json?'+param);
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
wasClicked++;
$("#logForm").find('#logFood , #logType , #logAmount , #logBrand , #logCals , #logUnit').val("");
$("#logUnit").empty();
$("#logFood").val( null).trigger('change');
$("#logFave").val($("#logFave option:first").val());
$('#logFave').prop('disabled', false);
totalCals= 0;
    totalCarbs =0;
    totalFats = 0;
    totalFibers = 0;
    totalProtein = 0;
setTimeout(function(){
    
    resetCanvas();
    getWeeklyCalsIn();
    getNutritionLogs();
},1500);
        }




});


$("#saveNewFood").click(function(){
    var valid = $("#createForm").valid();
    if(valid === false){
       
    }
    else{
    let food = $("#newName").val();
    let calories = $("#newCals").val();
    let amount = $("#newAmount").val();
    let unit = foodUnitMap.get($("#newUnit").val());
    console.log("unit"+ unit);
    let carb = $("#newCarbs").val();
    let fat = $("#newFats").val();
    let fiber = $("#newFiber").val();
    let protein = $("#newProtein").val();
    let bName ="";
    if( $("#newbName").val() !==""){
     bName = $("#newbName").val();
    }
  
    var xhr = new XMLHttpRequest();
    xhr.responseType= 'json';
    var param;

    if(bName !=""){
        param = "name="+food+"&brandName="+bName+"&defaultFoodMeasurementUnitId="+unit+"&defaultServingSize="+amount+"&calories="+calories+"&totalCarbohydrate(g)="+carb+"&totalFat(g)="+fat+"&dietaryFiber(g)="+fiber+"&protein(g)="+protein;

    }
    else{
        param = "name="+food+"&defaultFoodMeasurementUnitId="+unit+"&defaultServingSize="+amount+"&calories="+calories+"&totalCarbohydrate(g)="+carb+"&totalFat(g)="+fat+"&dietaryFiber(g)="+fiber+"&protein(g)="+protein;


    }
   
    xhr.open('POST', 'https://api.fitbit.com/1/user/-/foods.json?'+param);
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


getFoodGoals();
    getNutritionLogs();
    getUnits();
    getFavouriteFoods();
   
    setTimeout(function(){
        getWeeklyCalsIn();
        getBalance();
        getNutritionProgress();

    },1000);
    

});