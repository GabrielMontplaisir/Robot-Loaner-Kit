function emailTeachers() {
  var schoolMonths = ['January', 'February', 'March', 'April', 'May', 'June', , , 'September', 'October', 'November', 'December']
  var currentMonth = new Date().getMonth();
  // Logger.log(currentMonth);

  var ss = SpreadsheetApp.getActive();
  var sh = ss.getActiveSheet();
  var data = sh.getDataRange().getValues();
  // Logger.log(data);

  for (var i = 0; i < data.length; i++) {
    // Logger.log(monthCol[i])
    if (data[i][13] == schoolMonths[currentMonth]) {
      var emailAddress = data[i][1].toString();
      var fullName = teacherName(emailAddress);
      var schoolName = data[i][3].toString();
      var bot = data[i][8].toString();
      // Logger.log(emailAddress+' - '+bookedMonth)


      var botCalendar = SpreadsheetApp.getActive().getSheetByName(bot);
      var calendarData = botCalendar.getDataRange().getValues();
      for (var m = 0; m < calendarData.length; m++ ) {
        if (calendarData[m][0] == schoolMonths[currentMonth]) {
        // Logger.log(calendarData[m]);
          for (var d = 0; d < calendarData[m].length; d++) {
            if (calendarData[m][d] === fullName+' - '+schoolName) {
              if (calendarData[m+1][d] != '') {
                var nextBooking = calendarData[m+1][d].toString();
              } else {
                var nextBooking = 'B&LT 133 Greenbank - 4th Floor - Attention Consultants';
              }
            }
          }
        }
      }

      var superSheet = ss.getSheetByName('Superintendencies');
      var getSchool = superSheet.createTextFinder(schoolName).matchEntireCell(true).findNext();
      var mailPickupDay = "on "+superSheet.getRange(getSchool.getRow(),getSchool.getColumn()+1).getValue();

      MailApp.sendEmail({
        to: emailAddress,
        subject: "Upcoming Robotics Loaner Kit Return Date",
        htmlBody: 
        
        "<p>Salut,</p>"+
        
        "<p>Your loan period is nearing its end and it is time to package and send the robot loaner kit to the next educator. Please refer to the <a href='https://docs.google.com/document/d/1J84k7wRZSyYIYWOH2f0sZ8KRknphauHj0URiaXIor0I/edit#'>attached checklist</a> to ensure all of the parts of the kits are accounted for, in working order and packaged appropriately.</p>"+

"<p>Ideally, each bot should be charged and wiped with a dry clean rag so that the next school can get started right away. Please also make sure that you clearly address the kit to the next educator by including their full name and school location. The kit needs to be sent to<b>: "+ nextBooking +"</b> within the next week. If you are using Board mail, your school’s mail gets picked up <b>"+ mailPickupDay +"</b> from your office. Otherwise, you can deliver the kit directly to the next school.</p>"+

"<p>Don’t forget to complete the <a href='https://forms.gle/64XNzUYjUB4NbS2u5'>Robot Experience Form</a> and email us any pictures you would like to share. We would love to see celebrations of student learning. If your school is interested in purchasing their own set of robots, please contact Kathryn DeBodt at Kathryn.Debodt@ocdsb.ca</p>"+

"<p>Looking forward to hearing your feedback,</p>"+

"<p>#TeamAwesome</p>"
      })
    }
  }
}