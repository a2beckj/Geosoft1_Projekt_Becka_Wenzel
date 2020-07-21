/**
 * @desc This function takes timestamp of ride in MongoDB and timestamp of the known ride of risk. 
 * Then it determines whether the risk of the ride in MongoDB has to be changed to risk or not.
 * @param {time} checkTimestamp - timestamp of ride in MongoDB
 * @param {time} riskTimestamp - timestamp of given risk-ride
 */
function checkTimestamp(checkTimestamp, riskTimestamp){
    
    var dateRisk = riskTimestamp.substring(0,10);
    var timeRiskHour = riskTimestamp.substring(11,13);
  
    var dateCheck = checkTimestamp.substring(0,10);
    var timeCheckHour = parseInt(checkTimestamp.substring(11,13));
    // if date is the same
    if (dateCheck == dateRisk){
        // if ride is within 1 hour before or 1 hour after risk-ride
        if(timeCheckHour == timeRiskHour || (timeCheckHour + 1) == timeRiskHour || (timeCheckHour - 1) == timeRiskHour){
        return true
        }
        else {return false}
    }
    else {return false}
}


// Timestamp tests
  QUnit.test( "Timestamp check", function( assert ) {
    assert.equal((checkTimestamp('2020-07-21T11:10:00+02:00', '2020-07-21T11:10:00+02:00')), true, 'true - Timestamps sind identisch');
    assert.equal((checkTimestamp('2020-07-21T11:10:00+02:00', '2020-07-21T12:10:00+02:00')), true, 'true - Timestamp mit einer Stunde Abweichung');
    assert.equal((checkTimestamp('2020-07-21T11:10:00+02:00', '2020-07-20T12:10:00+02:00')), false, 'false - Timestamp an unterschiedlichen Tagen');
    assert.equal((checkTimestamp('2020-07-21T11:10:00+02:00', '2020-07-21T14:10:00+02:00')), false, 'false - Timestamp mit 3 Stunden Unterschied');
  });

/* //API test
QUnit.test( "Timestamp check", function( assert ) {
    assert.ok((getStations([7.669398486614227, 51.90171957830009])), true, 'API Aufruf erfolgreich');
}); */