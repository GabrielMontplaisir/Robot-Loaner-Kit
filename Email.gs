function emailTeachers() {
  var date = new Date();
  //var currentMonth = Utilities.formatDate(date, Session.getScriptTimeZone(), 'MMMM');
  var currentMonth = 'December';
  // Logger.log(currentMonth);

  var ss = SpreadsheetApp.getActive();
  var sh = ss.getActiveSheet();
  var data = sh.getDataRange().getValues().filter(function(confirmedMonth) {
    // Logger.log(row)
    return confirmedMonth[13] === currentMonth
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


    var botCalendar = SpreadsheetApp.getActive().getSheetByName(person.bot);
    var row = botCalendar.createTextFinder(currentMonth).matchEntireCell(true).findNext().getRow();
    // Logger.log(row)
    var calendarData = botCalendar.getDataRange().getValues().filter(function(month) {
      return month[0] === currentMonth
    });
    // Logger.log(calendarData)
    for (var m = 1; m < calendarData[0].length; m++ ) {
      // Logger.log(calendarData[0][m]);
      if (calendarData[0][m] === person.name+' - '+person.school) {
        // Logger.log(calendarData[0][m]);
        var nextBooking = botCalendar.getRange(row+1,calendarData[0].indexOf(calendarData[0][m].toString())+1).getValue();
        if (nextBooking === '') {
          nextBooking = 'B&LT 133 Greenbank - 4th Floor - Attention Consultants';
        }
        Logger.log(calendarData[0][m]+' -> '+nextBooking)
      }
    }

    var superSheet = ss.getSheetByName('Superintendencies');
    var getSchool = superSheet.createTextFinder(person.school).matchEntireCell(true).findNext();
    var mailPickupDay = "on "+superSheet.getRange(getSchool.getRow(),getSchool.getColumn()+1).getValue();

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