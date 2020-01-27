$(document).ready(function(){
    var access_token = getCookie("token");

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
            if(restHR === undefined || restHR ==="undefined"){
                document.getElementById("restHR").textContent = "N/A Please continue to wear your tracker!";
            }
            else{
            document.getElementById("restHR").textContent = data["activities-heart"][0].value.restingHeartRate+" bpm";
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
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: xlabels,
        datasets: [{
            label: 'heart rate per minute tracked',
            fill: false,
            data: ylabels,
            backgroundColor: ['rgb(204, 51, 51)',],
            borderColor: ['rgb(204, 51, 51)', ],
            borderWidth: 1
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
                display: false,
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



graphIntradayHeartRate();
 getRestingHeartRate();
   

    
});