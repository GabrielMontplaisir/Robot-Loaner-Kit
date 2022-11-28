function sendEmail() {
  var date = new Date();
  var month = Utilities.formatDate(date, Session.getScriptTimeZone(), 'MMMM');
  // Logger.log(month);

  var ss = SpreadsheetApp.getActive();
  var sh = ss.getActiveSheet();
  var data = sh.getDataRange().getValues().filter(function(current) {
    // Logger.log(row)
    return current[13] === month
  });
  // Logger.log(data);

  for (var i = 0; i < data.length; i++) {
    const person = {
      email: data[i][1].toString(),
      school: data[i][3].toString(),
      bot: data[i][8].toString()
    };
    person.name = findName(person.email);
    Logger.log(person)


    var botCal = SpreadsheetApp.getActive().getSheetByName(person.bot);
    var row = botCal.createTextFinder(month).matchEntireCell(true).findNext().getRow();
    // Logger.log(row)
    var calData = botCal.getDataRange().getValues().filter(function(current) {
      return current[0] === month
    });
    // Logger.log(calData)
    for (var m = 1; m < calData[0].length; m++ ) {
      // Logger.log(calData[0][m]);
      if (calData[0][m] === person.name+' - '+person.school) {
        // Logger.log(calData[0][m]);
        var nextBooking = botCal.getRange(row+1,calData[0].indexOf(calData[0][m].toString())+1).getValue();
        if (nextBooking === '') {
          nextBooking = 'B&LT 133 Greenbank - 4th Floor - Attention Consultants';
        }
        Logger.log(calData[0][m]+' -> '+nextBooking)
      }
    }

    var superSheet = ss.getSheetByName('Superintendencies');
    var findSchool = superSheet.createTextFinder(person.school).matchEntireCell(true).findNext();
    var mailPickupDay = "on "+superSheet.getRange(findSchool.getRow(),findSchool.getColumn()+1).getValue();

    MailApp.sendEmail({
      to: person.email,
      subject: "Upcoming Robotics Loaner Kit Return Date",
      htmlBody: 
      
      "<p>Salut,</p>"+
      
      "<p>Your loan period is nearing its end and it is time to package and send the <b>"+person.bot+"</b> kit to the next educator. Please refer to the <a href='https://docs.google.com/document/d/1J84k7wRZSyYIYWOH2f0sZ8KRknphauHj0URiaXIor0I/edit#'>attached checklist</a> to ensure all of the parts of the kits are accounted for, in working order and packaged appropriately.</p>"+

      "<p>Ideally, each bot should be charged and wiped with a dry clean rag so that the next school can get started right away. Please also make sure that you clearly address the kit to the next educator by including their full name and school location. The kit needs to be sent to<b>: "+ nextBooking +"</b> within the next week. If you are using Board mail, your school’s mail gets picked up <b>"+ mailPickupDay +"</b> from your office. Otherwise, you can deliver the kit directly to the next school.</p>"+

      "<p>Don’t forget to complete the <a href='https://forms.gle/64XNzUYjUB4NbS2u5'>Robot Experience Form</a> and email us any pictures you would like to share. We would love to see celebrations of student learning. If your school is interested in purchasing their own set of robots, please contact Kathryn DeBodt at Kathryn.Debodt@ocdsb.ca</p>"+

      "<p>Looking forward to hearing your feedback,</p>"+

      "<p>#TeamAwesome</p>"
    })
  }
}