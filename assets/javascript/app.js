var database = firebase.database();

$(document).ready(function () {

    $('#saveTrain').click(function () {
        var train = {
            name: $('#name').val().trim(),
            destination: $('#destination').val().trim(),
            firstTrain: $('#firstTrain').val().trim(),
            frequency: $('#frequency').val().trim()
        };
        console.log(train);
        database.ref('times/').push(train);
    });
});

database.ref("times/").on("child_added", function (snapshot) {
    var data = snapshot.val();
    console.log(data);

    var nextArrival = calculateNextArrival(data);
    var minutesAway = Math.abs(moment().diff(moment(nextArrival), "minutes"));
    var tr = $('<TR>');
    tr.append($('<TD>').text(data.name));
    tr.append($('<TD>').text(data.destination));
    tr.append($('<TD>').text(data.frequency));
    tr.append($('<TD>').text(moment(nextArrival).format("h:mm A")));
    tr.append($('<TD>').text(minutesAway));
    $('#trains').append(tr);


});

function calculateNextArrival(data) {
    var tFrequency = data.frequency;
    var firstTime = data.firstTrain;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    return nextTrain;
}