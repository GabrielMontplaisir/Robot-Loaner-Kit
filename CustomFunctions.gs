function checkTeacherStatus(email, bot) {
  var ss = SpreadsheetApp.getActive().getSheetByName('Teacher Status');
  var data = ss.getDataRange().getValues();
  // Logger.log(email+bot);

  for (var e = 0; e < data.length; e++) {
    // Logger.log(data[e][0]);
    if (data[e][0].toString() == email) {
      // Logger.log (data[e][0])
      for (var b = 0; b < data[0].length; b++) {
        // Logger.log(bot+data[0][b])
        if (data[0][b] == bot) {
          // Logger.log(data[e][b])
          return data[e][b]
        }
      }
    }
  }
}

function confirmMonth(bot, timeChoice, Teacher, schoolName) {
  try {
    var ss = SpreadsheetApp.getActive().getSheetByName(bot);
    var data = ss.getDataRange().getValues();
    for (var t = 0; t < timeChoice.length; t++) {
        // Logger.log(timeChoice[t])
      for (var m = 0; m < data.length; m++) {
        if (timeChoice[t].toString() == data[m][0].toString()) {
          // Logger.log('Found month of '+data[m][0]);
          for (var s = 0; s < data[m].length; s++) {
            if (data[m][s].toString() === '') {
              ss.getRange(m+1,s+1).setValue(Teacher+' - '+schoolName)
              return timeChoice[t]
            }
          }
        }
      }
    }
    return "No slot available"

  } catch (e) {
    return "No bot needed"
  }
}
