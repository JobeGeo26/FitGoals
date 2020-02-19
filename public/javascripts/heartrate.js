$(document).ready(function(){
    var access_token = getCookie("token");
    $("nav").css({'background-image': 'linear-gradient(to right,  #FF0000 0%, #FF7878 100%)'})

    function graphIntradayHeartRate(){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
                let intradayArray = data["activities-heart-intraday"].dataset;
                console.log(intradayArray);

                if(intradayArray.length === 0){
                    createLineChart(null,null,"Not Available, Please wear your tracker and sync data!");

                }
                else{
                const hrValues = intradayArray.map(entries => entries.value);
            
                const timeValues = intradayArray.map(entries => entries.time);
            
                let title = "Intraday Heart rate graph"
                createLineChart(timeValues,hrValues,title);
                }
                
               
                
            }
            else {
                console.log("Status: " + xhr.status);
              }
        };
        xhr.send();
    
    
     };


  function getRestingHeartRate(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            let restHR =data["activities-heart"][0].value.restingHeartRate;
            let zoneTimes = data["activities-heart"][0].value.heartRateZones[0].minutes;
            let zones = data["activities-heart"][0].value.heartRateZones;
            if(restHR === undefined || restHR ==="undefined"){
                document.getElementById("restHR").textContent = "N/A Please continue to wear your tracker!";
            }
            else{
            document.getElementById("restHR").textContent = data["activities-heart"][0].value.restingHeartRate+" bpm";
            }
            if(zoneTimes !== undefined){  
                document.getElementById("fatburn").textContent = "Minutes: "+zones[1].minutes;
                document.getElementById("fatburnCals").textContent = "Calories: "+(zones[1].caloriesOut).toFixed(2);
                document.getElementById("cardio").textContent = "Minutes: "+zones[2].minutes;
                document.getElementById("cardioCals").textContent = "Calories: "+(zones[2].caloriesOut).toFixed(2);
                document.getElementById("peak").textContent = "Minutes: "+zones[3].minutes;
                document.getElementById("peakCals").textContent = "Minutes: "+(zones[3].caloriesOut).toFixed(2);

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
    var ctx = document.getElementById('heartRate').getContext('2d');
    $('#heartRate').css({'background-image': 'linear-gradient(to bottom,  #FF0000 0%, #FF7878 100%)'});
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: xlabels,
        
        datasets: [{
            label: 'Heart rate per minute tracked',
           
            fill: false,
            data: ylabels,
            backgroundColor: "rgba(255, 255, 255,0.1)",
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
                
                display: false,
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
        annotation: {
            annotations: [{
              type: 'line',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: 99,
              borderColor: 'white',
              borderWidth: 4,
              label: {
                enabled: true,
                content: 'Fat Burn: 99 bpm'
                
              }
            }]
        }
       
    }
    
    
});

}



graphIntradayHeartRate();
 getRestingHeartRate();
   

    
});