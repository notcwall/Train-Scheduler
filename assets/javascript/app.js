var trainData = new Firebase("https://train-sched.firebaseio.com/");
var trainName = "";
var destination = "";
var firstTime = "";
var frequency = 0;

function Train(name, destination, firstTime, frequency){
	this.name = name;
	this.destination = destination;
	this.firstTime = firstTime;
	this.frequency = frequency;
}

$('#addTrainForm').on('submit', function(){
	trainName = $('#trainName').val().trim();
	destination = $('#destination').val().trim();
	firstTime = $('#firstTrainTime').val().trim();
	frequency = $('#frequency').val().trim();
	train = new Train(trainName, destination, firstTime, frequency);

	trainData.push({
		train: train
	})

	return false;
});

trainData.on("child_added", function(childSnapshot){
	var trainStart = childSnapshot.val().train.firstTime;
	var trainStartConverted = moment(trainStart, "hh:mm").subtract(1, "years");
	var currentTime = moment();
	var diffTime = moment().diff(moment(trainStartConverted), "minutes");
	var timeRemainder = diffTime % childSnapshot.val().train.frequency;
	var timeTillNextTrain = childSnapshot.val().train.frequency - timeRemainder;
	var nextTrain = moment().add(timeTillNextTrain, "minutes");

	$('#trainTable').append('<tr><td>' + childSnapshot.val().train.name + '</td><td>' + 
		childSnapshot.val().train.destination + '</td><td>' + 
		childSnapshot.val().train.frequency + '</td><td>' + 
		moment(nextTrain).format("hh:mm") + '</td><td>' + 
		timeTillNextTrain + '</td>')
});