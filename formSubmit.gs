function formSubmit(e) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getActiveSheet();
  var itemResponses = e.values;
  Logger.log(itemResponses) 
  var email = itemResponses[1];
  var fullName = teacherName(email);
  var schoolName = itemResponses[3];
  var bot = itemResponses[7];
  var training = itemResponses[8];
  var timeChoice = itemResponses[10].toString().split(', ');
  var row = e.range.rowStart;

  // Superintendencies Sheet Info
  var superSheet = ss.getSheetByName('Superintendencies');
  var getSchool = superSheet.createTextFinder(schoolName).matchEntireCell(true).findNext();
  var Superintendent = superSheet.getRange(1,getSchool.getColumn()-1).getValue();

  // Set Background to match the Superintendencies sheet, to identify SATE schools / Target Schools
  sh.getRange(row, itemResponses.indexOf(itemResponses[3])+1).setBackground(getSchool.getBackground());

  // Input superintendency automatically
  var data = sh.getDataRange().getValues();
  //Logger.log(data[0])
  var superCol = data[0].indexOf('Superintendency');
  sh.getRange(row, superCol+1).setValue(Superintendent);

  var nameCol = data[0].indexOf('Full Name:')
  sh.getRange(row, nameCol+1).setValue(fullName);

  // Check if teacher was coached for that specific bot
  var trainStatus = checkTeacherStatus(email, bot);
  //Logger.log(trainStatus);
  if (trainStatus) {
    trainStatus = 'Yes'
  } else {
    trainStatus = 'No'
  }

  // Highlight Green if the person has received training, Red if they "lied", and Yellow if needs training.
  if (training.toString() == trainStatus && training.toString() == "Yes") {
    sh.getRange(row, itemResponses.indexOf(training)+2).setBackground('#b6d7a8');
  } else if (training.toString() != trainStatus && training.toString() == "Yes") {
    sh.getRange(row, itemResponses.indexOf(training)+2).setBackground('#ea9999');
  } else {
    sh.getRange(row, itemResponses.indexOf(training)+2).setBackground('#ffff00');
  }

  // Find available slot for the bot in question, and if slot is available, place in the appropriate calendar.
  // Then post the confirmed month on the response sheet. Lastly, link to the appropriate Calendar Tab for ease of access.
  var richTextMonth = SpreadsheetApp.newRichTextValue()
    .setText(confirmMonth(bot, timeChoice, fullName, schoolName))
    .setLinkUrl('#gid='+SpreadsheetApp.getActive().getSheetByName(bot).getSheetId())
    .build()
  var monthCol = data[0].indexOf('Confirmed Month');
  sh.getRange(row,monthCol+1).setRichTextValue(richTextMonth);
  sh.getRange(row,monthCol+2).insertCheckboxes();


  SpreadsheetApp.flush();
}