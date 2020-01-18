$(document).ready(function(){
    var access_token = getCookie("token");
    var currentStepcount = 0;
    
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
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: xlabels,
        datasets: [{
            label: 'Step count last 7 days',
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

function getStepProgress(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/goals/daily.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            const stepgoals= data.goals.steps;
            let progress = (currentStepcount/stepgoals) *100;
            document.getElementById("progressStatus").textContent = "Daily Step Count Goal Progress: "+ progress+"%";
            document.getElementById("goal").textContent =  stepgoals+" steps";
           moveProgressBar(progress);
           
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


getStepCountData();
setTimeout(function(){

    getStepProgress();
},1000);


 });