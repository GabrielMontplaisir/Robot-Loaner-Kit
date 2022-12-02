function formSubmit(e) {
  var sh = e.range.getSheet();
  var itemResponses = e.values;
  Logger.log(itemResponses)
  const response = {
    email: itemResponses[1],
    school: itemResponses[3],
    bot: itemResponses[7],
    training: itemResponses[8],
    time: itemResponses[10].toString().split(', ')
  };
  response.name = findName(response.email);
  var row = e.range.rowStart;
  //Logger.log(response);
  
  // Superintendencies Sheet Info
  var {superintendent, bg} = findSuper(response.school);
  //Logger.log(superintendent)

  // Set Background to match the Superintendencies sheet, to identify SATE schools / Target Schools
  sh.getRange(row, itemResponses.indexOf(response.school)+1).setBackground(bg);

  // Input superintendency & Name automatically
  var data = sh.getDataRange().getValues();
  //Logger.log(data[0])
  var superCol = data[0].indexOf('Superintendency');
  sh.getRange(row, superCol+1).setValue(superintendent);

  var nameCol = data[0].indexOf('Full name:');
  sh.getRange(row, nameCol+1).setValue(response.name);

  // Check if teacher was coached for that specific bot
  var trainStatus = checkStatus(response.email, response.bot);
  //Logger.log(trainStatus);
  if (trainStatus) {
    trainStatus = 'Yes'
  } else {
    trainStatus = 'No'
  }

  // Highlight Green if the person has received training, Red if they "lied", and Yellow if needs training.
  if (response.training === trainStatus && response.training === "Yes") {
    sh.getRange(row, itemResponses.indexOf(response.training)+2).setBackground('#b6d7a8');
  } else if (response.training !== trainStatus && response.training === "Yes") {
    sh.getRange(row, itemResponses.indexOf(response.training)+2).setBackground('#ea9999');
  } else {
    sh.getRange(row, itemResponses.indexOf(response.training)+2).setBackground('#ffff00');
  }

  // Find available slot for the bot in question, and if slot is available, place in the appropriate calendar.
  // Then post the confirmed month on the response sheet. Lastly, link to the appropriate Calendar Tab for ease of access.
  var richTextMonth = SpreadsheetApp.newRichTextValue()
    .setText(confirmMonth(response.bot, response.time, response.name, response.school))
    .setLinkUrl('#gid='+SpreadsheetApp.getActive().getSheetByName(response.bot).getSheetId())
    .build()
  var monthCol = data[0].indexOf('Confirmed Month');
  sh.getRange(row,monthCol+1).setRichTextValue(richTextMonth);
  sh.getRange(row,monthCol+2).insertCheckboxes();


  SpreadsheetApp.flush();
}