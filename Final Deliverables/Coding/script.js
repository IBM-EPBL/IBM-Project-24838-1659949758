function Calculate(){
    var height = document.getElementById("h-input").value;
    var weight = document.getElementById("w-input").value;


    var result = parseFloat(weight) /(parseFloat(height)/100)**2;

    if(!isNaN(result)){
        document.getElementById("bmi-output").innerHTML = result;
        if(result < 18.5){
            document.getElementById("bmi-status").innerHTML = "Underweight,take more calories";
        }
        else if(result < 25){
            document.getElementById("bmi-status").innerHTML = "Healthy,take nutrition rich food";
        }
        else if(result < 30){
            document.getElementById("bmi-status").innerHTML = "Overweight,reduce calorie intake and do more exercise";
        }
        else{
            document.getElementById("bmi-status").innerHTML = "Obesity,avoid junk food and do more exercise ";
        }
    }
}
