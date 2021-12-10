var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes();

today = yyyy+'-'+mm+'-'+dd+'T'+time;
document.getElementById("datum").setAttribute("min", today);