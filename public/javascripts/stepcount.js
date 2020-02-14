$(document).ready(function(){
    var access_token = getCookie("token");
    var currentStepcount = 0;
    var stepgoals = 0;
    
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





    getStepProgress();




 });