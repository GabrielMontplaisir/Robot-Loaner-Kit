function checkStatus(email, bot) {
  const ss = SpreadsheetApp.getActive().getSheetByName('Trained Status');
  const data = ss.getDataRange().getValues();
  // Logger.log(email+bot);
  const botIndex = data[0].indexOf(bot);

  const trained = data.find(teacher => teacher[0] === email);
  return trained[botIndex]
}

function confirmMonth(bot, time, name, school) {
  try {
    const ss = SpreadsheetApp.getActive().getSheetByName(bot);
    const data = ss.getDataRange().getValues();
    for (let t = 0; t < time.length; t++) {
      // Logger.log(time[t])
      for (let m = 0; m < data.length; m++) {
        // Logger.log(data[m][0]);
        if (time[t].toString() === data[m][0].toString()) {
          // Logger.log('Found month of '+data[m][0]);
          for (let s = 0; s < data[m].length; s++) {
            if (data[m][s].toString() === '') {
              ss.getRange(m+1,s+1).setValue(name+' - '+school)
              return time[t]
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

function findName(email) {
  // Get person's name. Requires the Admin SDK API.
  let name = AdminDirectory.Users.get(email, {viewType:'domain_public', fields:'name'});
  return name.name.fullName;
  // Logger.log(fullName);
}

function findSuper(school) {
  // Superintendencies Sheet Info
  // Logger.log(school);
  const ss = SpreadsheetApp.getActive().getSheetByName('Superintendencies');
  let findSchool = ss.createTextFinder(school).matchEntireCell(true).findNext();
  let superintendent = ss.getRange(1,findSchool.getColumn()-1).getValue();
  let bg = findSchool.getBackground();
  // Logger.log(superintendent+bg);
  return {superintendent, bg}
}