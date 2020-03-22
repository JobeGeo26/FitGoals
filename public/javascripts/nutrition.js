$(document).ready(function(){
    var highProteinArray =["Almond Milk","Almond Butter","Shrimp","Almond Butter","scallops","Canned Tuna","Flaxseed","Lobster","Chicken Breast","Egg","Vension","Tempeh","Halibut","Pistachios","Salmon",
    "Greek Yoghurt","Avocado","Seitan","Mozarella Cheese","Almonds","Turkey Meat","Chia seeds","Peanut Butter","Cottage Cheese","Tofu","Hemp seeds","Grass-fed Beef","Canned Sardines","Sunflower Seeds","Jerky","Lamb","Pork"];
    var highCarbsArray =["White bread","Whole-wheat Bread","Flour Tortilla","Bagel","Banana","Raisin","Dates","Mangoes","Corn","Potato","Sweet Potatoes","Betroot","Pasta","Cereal","Beer","Oats","Rice","Sweetened Yoghurts","Juice","Lentils","Peas","Black Beans","Pinto Beans","Chickpeas","Kidney Beans","Honey","White Sugar","Maple Syrup","Crisps","Chips","Crackers","Milk"];
    var lowCarbsArray = ["Eggs","Beef","Lamb","Chicken","Bacon","Jerky","Turkey","Bison","Salmon","Trouts","Shellfish","Sardines","Haddock","Catfish","Brocolli","Tomatoes","Onions","Brussel Sprouts","Cauliflower","Kale","Eggplant","Cucumber","Bell Peppers","Asparagus","Green Beans"
,"Mushrooms","Avocados","Strawberries","Olives","Grapefruit","Apricots","Kiwis","Oranges","Raspberries","Almonds","Walnuts","Peanuts","Cheese","Full-fat yoghurt","Coconut oil","Extra virgin olive oil","Dark Chocolate"];
    var highFiberArray = ["Pears","Strawberries","Avocado","Apples","Raspberries","Bananas","Carrots","Betroot","Broccoli","Artichoke","Brussels Sprouts","Lentils","Kidney Beans","Split Peas","Chickpeas","Sweet Potatoes","Dark Chocolate","Almonds","Chia Seeds","Oats","Quinoa"];
    var lowFatArray = ["Leafy Greens","Fruits-all","Beans and Legumes","Sweet Potatoes","Tart Cherry Juice","Brocolli","Cauliflower","Turnips","Cabbage","Brusels Sprouts","Mushroom","Garlic","Egg-whites","low-fat dairy","Chicken breast","Haddock","Cod","Pollock","Spelt","Quinoa","Farro","Bulgur"];
    var highFatArray = ["Avocados","Cheese","Dark Chocolate","Whole Eggs","Salmon","Trout","Mackerel","Sardines","Herring","Almonds","Walnuts","macadamia nuts","Full fat yoghurt","Extra virgin olive oil","Chia seeds","Coconut oil"];
    var access_token = getCookie("token");
    var userId = localStorage.getItem("userId");
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
    function getNutritionGoals(protein,carbs, fiber, fat){
        $("#cardbody").empty();
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', '/getNutritionGoals/'+userId);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log(xhr.response);
                let data = xhr.response;
                if(data.nutrition_val1 === "N/A" && data.nutrition_val2 === "N/A"){
                    $("#cardbody").append('<div class="row"><div class="col-sm-6"> <div class="card"><div class="card-body"><h5 class="card-title">N/A, Save Nutrition Goals in Goals page</h5></div></div></div></div>');
                
                }
                if(data.nutrition_val1 === "Protein"){
                    let progress = ((protein/data.nutrition_amount1)*100).toFixed(2);
                    if( progress >= 100){
                        Swal.fire({
                            icon: 'success',
                            title: 'You have reached your Protein Content Goal!',
                            timer: 1500
                          });
                     }
                    let array = getRandom(highProteinArray,12);
                    console.log(array);
                    $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Here are some high protein - low carb foods for your protein content goal:</h5>');
                    $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[0]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[1]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[2]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[3]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[4]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[5]+'</h5></div></div></div></div>');
                    $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[6]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[7]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[8]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[9]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[10]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[11]+'</h5></div></div></div></div><br>');
                    $("#nutrition1").html('Daily Protein Goal <i class="fas fa-egg" style="font-size:35px; color: yellow;"></i>');
                    getNutrition1Gauge(progress);
                    document.getElementById("nutrition1Status").textContent = protein+"/"+data.nutrition_amount1+ " grams consumed";
                }
                if(data.nutrition_val1 === "Carbohydrates"){
                    let progress = ((carbs/data.nutrition_amount1)*100).toFixed(2);
                    if( progress >= 100){
                        Swal.fire({
                            icon: 'success',
                            title: 'You have reached your Carbohydrates Content Goal!',
                            timer: 1500
                          });
                     }
                    
                    let array = getRandom(highCarbsArray,12);
                        console.log(array);
                        $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Here are some high carb foods for your carbohydrates content goal:</h5>');
                        $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[0]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[1]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[2]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[3]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[4]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[5]+'</h5></div></div></div></div>');
                        $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[6]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[7]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[8]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[9]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[10]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[11]+'</h5></div></div></div></div><br>');
                   
                        
                        let array1 = getRandom(lowCarbsArray,12);
                        console.log(array1);
                        $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Here are low carb foods to help control your carbs:</h5>');
                        $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[0]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[1]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[2]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[3]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[4]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[5]+'</h5></div></div></div></div>');
                        $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[6]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[7]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[8]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[9]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[10]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[11]+'</h5></div></div></div></div><br>');
                       
                    getNutrition1Gauge(progress);
                    $("#nutrition1").html('Daily Carbs Goal <i class="fas fa-bread-slice" style="font-size:35px; color: yellow;"></i>');
                    document.getElementById("nutrition1Status").textContent = carbs+"/"+data.nutrition_amount1+ " grams consumed";
              
                }
                if(data.nutrition_val1 === "Fiber"){
                    let progress = ((fiber/data.nutrition_amount1)*100).toFixed(2);
                    if( progress >= 100){
                        Swal.fire({
                            icon: 'success',
                            title: 'You have reached your Fiber Content Goal!',
                            timer: 1500
                          });
                     }
                    let array = getRandom(highFiberArray,12);
                    console.log(array);
                    $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Here are high Fiber foods for your fiber content goal:</h5>');
                    $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[0]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[1]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[2]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[3]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[4]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[5]+'</h5></div></div></div></div>');
                    $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[6]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[7]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[8]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[9]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[10]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[11]+'</h5></div></div></div></div><br>');
                  
                    getNutrition1Gauge(progress);
                    $("#nutrition1").html('Daily Fiber Goal <i class="fas fa-apple" style="font-size:35px; color: yellow;"></i> ');
                    document.getElementById("nutrition1Status").textContent = fiber+"/"+data.nutrition_amount1+ " grams consumed";
              
                }
                if(data.nutrition_val1 === "Fats"){
                    let progress = ((fat/data.nutrition_amount1)*100).toFixed(2);
                    if( progress >= 100){
                        Swal.fire({
                            icon: 'success',
                            title: 'You have reached your Fats Content Goal!',
                            timer: 1500
                          });
                     }
                    
                    if(data.nutrition_amount1 < 57){
                    let array = getRandom(lowFatArray,12);
                    console.log(array);
                    $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Here are low fat foods for your fats content goal:</h5>');
                    $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[0]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[1]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[2]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[3]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[4]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[5]+'</h5></div></div></div></div>');
                    $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[6]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[7]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[8]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[9]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[10]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[11]+'</h5></div></div></div></div><br>');
                   }
                    else{
                        let array = getRandom(highFatArray,12);
                        console.log(array);
                        $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Here are low fat foods for your fats goal:</h5>');
                        $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[0]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[1]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[2]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[3]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[4]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[5]+'</h5></div></div></div></div>');
                        $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[6]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[7]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[8]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[9]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[10]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[11]+'</h5></div></div></div></div><br>');
                      
                    }
                    getNutrition1Gauge(progress);
                    $("#nutrition1").html('Daily Fats Goal <i class="fas fa-cheese" style="font-size:35px; color: yellow;"></i>');
                    document.getElementById("nutrition1Status").textContent = fat+"/"+data.nutrition_amount1+ " grams consumed";
              
                }


                if(data.nutrition_val2 === "Protein"){
                    let progress = ((protein/data.nutrition_amount2)*100).toFixed(2);
                    if( progress >= 100){
                        Swal.fire({
                            icon: 'success',
                            title: 'You have reached your Protein Content Goal!',
                            timer: 1500
                          });
                     }
                    let array = getRandom(highProteinArray,12);
                    console.log(array);
                    $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Here are some high protein - low carb foods for your protein content goal:</h5>');
                    $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[0]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[1]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[2]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[3]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[4]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[5]+'</h5></div></div></div></div>');
                    $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[6]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[7]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[8]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[9]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[10]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[11]+'</h5></div></div></div></div><br>');
                  
                    getNutrition2Gauge(progress);
                    $("#nutrition2").html('Daily Protein Goal <i class="fas fa-egg" style="font-size:35px; color: #FF0000;"></i>');
                    document.getElementById("nutrition2Status").textContent = protein+"/"+data.nutrition_amount2+ " grams consumed";
              
                }
                if(data.nutrition_val2 === "Carbohydrates"){
                    let progress = ((carbs/data.nutrition_amount2)*100).toFixed(2);
                    if( progress >= 100){
                        Swal.fire({
                            icon: 'success',
                            title: 'You have reached your Carbohydrates Content Goal!',
                            timer: 1500
                          });
                     }
                    
                        let array = getRandom(highCarbsArray,12);
                        console.log(array);
                        $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Here are some high carb foods for your carbohydrates content goal:</h5>');
                        $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[0]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[1]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[2]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[3]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[4]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[5]+'</h5></div></div></div></div>');
                        $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[6]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[7]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[8]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[9]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[10]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[11]+'</h5></div></div></div></div><br>');
                   
                        
                        let array1 = getRandom(lowCarbsArray,12);
                        console.log(array1);
                        $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Here are low carb foods to help control your carbs:</h5>');
                        $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[0]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[1]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[2]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[3]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[4]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[5]+'</h5></div></div></div></div>');
                        $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[6]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[7]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[8]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[9]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[10]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array1[11]+'</h5></div></div></div></div><br>');
                      
                     
                    getNutrition2Gauge(progress);
                    $("#nutrition2").html('Daily Carbs Goal <i class="fas fa-bread" style="font-size:35px; color: #FF0000;"></i>');
                    document.getElementById("nutrition2Status").textContent = carbs+"/"+data.nutrition_amount2+ " grams consumed";
              
                }
                if(data.nutrition_val2 === "Fiber"){
                    let progress = ((fiber/data.nutrition_amount2)*100).toFixed(2);
                    if( progress >= 100){
                        Swal.fire({
                            icon: 'success',
                            title: 'You have reached your Fiber Content Goal!',
                            timer: 1500
                          });
                     }
                    let array = getRandom(highFiberArray,12);
                    console.log(array);
                    $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Here are high Fiber foods for your fiber content goal:</h5>');
                    $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[0]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[1]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[2]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[3]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[4]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[5]+'</h5></div></div></div></div>');
                    $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[6]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[7]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[8]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[9]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[10]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[11]+'</h5></div></div></div></div><br>');
                  
                    getNutrition2Gauge(progress);
                    $("#nutrition2").html('Daily Fiber Goal <i class="fab fa-apple" style="font-size:35px; color: #FF0000;"></i> ');
                    document.getElementById("nutrition2Status").textContent = fiber+"/"+data.nutrition_amount2+ " grams consumed";
              
                }
                if(data.nutrition_val2 === "Fats"){
                    let progress = ((fat/data.nutrition_amount2)*100).toFixed(2);
                    if( progress >= 100){
                        Swal.fire({
                            icon: 'success',
                            title: 'You have reached your Fat Content Goal!',
                            timer: 1500
                          });
                     }
                    if(data.nutrition_amount1 < 57){
                        let array = getRandom(lowFatArray,12);
                        console.log(array);
                        $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Here are low fat foods for your fat content goal:</h5>');
                        $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[0]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[1]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[2]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[3]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[4]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[5]+'</h5></div></div></div></div>');
                        $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[6]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[7]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[8]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[9]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[10]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[11]+'</h5></div></div></div></div><br>');
                       }
                        else{
                            let array = getRandom(highFatArray,12);
                            console.log(array);
                            $("#cardbody").append('<h5 style="font-family:Oswald,sans-serif;">Here are low fat foods for your fat content goal:</h5>');
                            $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[0]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[1]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[2]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[3]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[4]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[5]+'</h5></div></div></div></div>');
                            $("#cardbody").append('<div class="row"><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[6]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[7]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[8]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[9]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[10]+'</h5></div></div></div><div class="col-4 col-lg-2"> <div class="card h-100"><div class="card-body"><h5 class="card-title">'+array[11]+'</h5></div></div></div></div><br>');
                          
                        }
                    getNutrition2Gauge(progress);
                    $("#nutrition2").html('Daily Fats Goal <i class="fas fa-cheese" style="font-size:35px; color: #FF0000;"></i>');
                    document.getElementById("nutrition2Status").textContent = fat+"/"+data.nutrition_amount2+ " grams consumed";
              
                }
                  
            }
            else{
                console.log("Status:"+xhr.status);
            }
        };
    
        xhr.send();
    
      };

    function getNutrition1Gauge(value){
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
          var target = document.getElementById('nutrition1Gauge'); // your canvas element
          var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
          gauge.maxValue = 100; // set max gauge value
          gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
          gauge.animationSpeed = 32; // set animation speed (32 is default value)
          gauge.set(value); // set actual value
    }

    function getNutrition2Gauge(value){
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
          var target = document.getElementById('nutrition2Gauge'); // your canvas element
          var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
          gauge.maxValue = 100; // set max gauge value
          gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
          gauge.animationSpeed = 32; // set animation speed (32 is default value)
          gauge.set(value); // set actual value
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
        $('#graphContainer').append(' <canvas  id="caloriesIn" width="400" height="210" style="border: 2px white; border-radius: 20px"></canvas>');
       
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
                if(data.goals !== undefined){
                calsInGoal = data.goals.calories;
                }
                currIn = data.summary.calories;
                let prot = data.summary.protein;
                let carbs = data.summary.carbs;
                let fib = data.summary.fiber;
                let fats = data.summary.fat;
                getNutritionGoals(prot,carbs,fib,fats);

                
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
           analyseNutritionTrend();
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
      
            if( progress >= 100){
                Swal.fire({
                    icon: 'success',
                    title: 'You have reached your Calories In Goal!',
                    timer: 1500
                  });
             }
       
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

function getCalsBurned(){
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
            return new Promise(function(resolve, reject) {
var xhr = new XMLHttpRequest();      
xhr.responseType = 'json';
xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/calories/date/'+startDate+'/'+baseDate+'.json');
xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr.onload = function () {
    if (xhr.status === 200) {
        const data = xhr.response;
        console.log(data);
        let weekly = data["activities-calories"]
        const calsOut = weekly.map(entries => entries.value);
        console.log(calsOut);
        resolve(calsOut);
           
    }
    else {
        console.log("Status: " + xhr.status);
      }
};
xhr.send();
});
};

 async function analyseNutritionTrend(){
    var analyseMap = new Map();
    $("#trend").empty();
    let calsOut = await getCalsBurned();
    console.log(calsOut);
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
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/foods/log/caloriesIn/date/'+startDate+'/'+baseDate+'.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;  
            console.log(data);
            let weekly = data["foods-log-caloriesIn"];
            let counter = 0;
            for(var j =0; j < weekly.length; j++){
                console.log(weekly[j].value,weekly[j].dateTime);
                console.log(calsOut[j]);

                let deficit = weekly[j].value - calsOut[j];
                if(intensity === "MAINTENANCE" && deficit >=0){
                    analyseMap.set(weekly[j].dateTime,deficit);
                    counter++;

                }
                if(intensity ==="EASIER" && deficit <= -200 && deficit >= -300 ){
                    analyseMap.set(weekly[j].dateTime,deficit);
                    counter++;

                }
                if(intensity ==="MEDIUM" && deficit <= -450 && deficit >= -550){
                    analyseMap.set(weekly[j].dateTime,deficit);
                    counter++;

                }
                if(intensity ==="KINDAHARD" && deficit <= -700 && deficit >= -800){
                    analyseMap.set(weekly[j].dateTime,deficit);
                    counter++;

                }
                if(intensity ==="HARDER" && deficit <= -950 && deficit >= -1050){
                    analyseMap.set(weekly[j].dateTime,deficit);
                    counter++;

                }

               
              
            }
            $("#monthNum").text("You have achieved your Calories In/Out Balance* goal "+ counter+"/"+weekly.length+ " times this month so far.");
            $("#monthNum").append('<div style="float:right;">* counts values +/-50 from the actual balance goal</div>')
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
            let topDays = days.length;
            if(topDays === 0 || topDays ===1){
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
            console.log("topdays"+ topDays);
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
    getNutritionLogs();
    getUnits();
    getFavouriteFoods();
    setTimeout(function(){
        getWeeklyCalsIn();
        getBalance();
        getNutritionProgress();

    },1000);
    

});
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

  function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}