$(document).ready(function(){
    var access_token = getCookie("token");
    var currentStepcount = 0;
    var stepgoals = 0;
    var currentDistance =0;
    
 function getStepCountData(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/steps/date/today/1w.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            let weekly = data["activities-steps"];
                if(weekly.length === 0){
                    createLineChart(null,null,"Not Available, Please wear your tracker and sync data!");

                }
                else{
                const stepcount = weekly.map(entries => entries.value);
            
                const day = weekly.map(entries => entries.dateTime);
            
                let title = "7 day Step Count Comparison graph"
                createLineChart(day,stepcount,title);
                currentStepcount = stepcount[stepcount.length-1];
                document.getElementById("stepcounter").textContent = currentStepcount + " steps";
                document.getElementById("todaySteps").textContent = "Steps: "+currentStepcount;

                
                }
        }
        else {
            console.log("Status: " + xhr.status);
          }
    };
    xhr.send();
};


function getFloorCountData(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/floors/date/today/1w.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            console.log(data);
            let weekly = data["activities-floors"];
               
                const floors = weekly.map(entries => entries.value);
            
                let currentFloorcount = floors[floors.length-1];
                document.getElementById("todayFloors").textContent = "Floors: "+currentFloorcount;

                
                
        }
        else {
            console.log("Status: " + xhr.status);
          }
    };
    xhr.send();
};
function getDistanceData(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/distance/date/today/1w.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            console.log(data);
            let weekly = data["activities-distance"];
               
                const distance = weekly.map(entries => entries.value);
            
               
                currentDistance = distance[distance.length-1];
                
                currentDistance =((currentDistance/100)*100).toFixed(2);
                document.getElementById("todayDistance").textContent = "Distance: "+currentDistance+" km";

                
                
        }
        else {
            console.log("Status: " + xhr.status);
          }
    };
    xhr.send();
};

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
                   document.getElementById("bestDist").textContent =  "Distance: "+(best.distance.value).toFixed(2)+" km";
                   document.getElementById("bestFloors").textContent = "Floors: "+(best.floors.value).toFixed(0);
                   document.getElementById("bestSteps").textContent =  "Steps: "+(best.steps.value).toFixed(0);
                  if(life.length === 0){
                  }
                  if(life.length !== 0){
                   document.getElementById("lifeDist").textContent = "Distance: "+ (life.distance).toFixed(2)+" km";
                   document.getElementById("lifeFloors").textContent =  "Floors: "+(life.floors).toFixed(0);
                   document.getElementById("lifeSteps").textContent = "Steps: "+ (life.steps).toFixed(0);
                  }
}
}
else{
    console.log("Status:"+xhr.status);
}
};
xhr.send();
}




function getFloorCountData(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/floors/date/today/1w.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            console.log(data);
            let weekly = data["activities-floors"];
               
                const floors = weekly.map(entries => entries.value);
            
                currentFloorcount = floors[floors.length-1];
                document.getElementById("todayFloors").textContent = "Floors: "+currentFloorcount;

                
                
        }
        else {
            console.log("Status: " + xhr.status);
          }
    };
    xhr.send();
};
function getStepCountData(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/steps/date/today/1w.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            let weekly = data["activities-steps"];
                if(weekly.length === 0){
                    createLineChart(null,null,"Not Available, Please wear your tracker and sync data!");

                }
                else{
                const stepcount = weekly.map(entries => entries.value);
            
                const day = weekly.map(entries => entries.dateTime);
            
                let title = "7 day Step Count Comparison graph"
                createLineChart(day,stepcount,title);
                currentStepcount = stepcount[stepcount.length-1];
                document.getElementById("stepcounter").textContent = currentStepcount + " steps";
                document.getElementById("todaySteps").textContent = "Steps: "+currentStepcount;

                
                }
        }
        else {
            console.log("Status: " + xhr.status);
          }
    };
    xhr.send();
};

async function createLineChart( xlabels, ylabels,title ){
    await xlabels;
    await ylabels;
    var ctx = document.getElementById('stepcount').getContext('2d');
    $('#stepcount').css({'background-image': 'linear-gradient(to bottom,  #93FB9D 0%, #09C7FB 100%)'});
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: xlabels,
        
        datasets: [{
            label: 'Step Count in last 7 days',
           
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
              value:stepgoals ,
              borderColor: 'white',
              borderWidth: 4,
              label: {
                enabled: true,
                content: 'Step count Goal: '+stepgoals
                
              }
            }]
        }
    }
    
    
});
}
function getStepProgress(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/goals/daily.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
             stepgoals= data.goals.steps;
             getStepCountData();
             setTimeout(function(){
            console.log(currentStepcount);
            let progress = ((currentStepcount/stepgoals) *100).toFixed(2);
            document.getElementById("progressStatus").textContent = "Daily Step Count Goal Progress: "+ progress+"%";
            if(progress >= 100){
                document.getElementById("progressStatus").textContent = "Daily Step Count Goal Progress: 100%";
                Swal.fire({
                    icon: 'success',
                    title: 'You have reached your step count goal!',
                    timer: 1500
                  });
            }
            document.getElementById("goal").textContent =  stepgoals+" steps";
           moveProgressBar(progress);
              },1000 );
           
        }
        else{
            console.log("Status:"+xhr.status);
        }
    };
    xhr.send();


}

async function moveProgressBar(progress){
    await progress;
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
        else{
        document.getElementById("red").setAttribute("style","width:34%");
        document.getElementById("yellow").setAttribute("style","width:41%");
        document.getElementById("green").setAttribute("style","width:25%");
        }


    }


}




getFloorCountData();
getDistanceData();
getLifeTimeStats();
    getStepProgress();




 });