function sendEmail() {

  // Get current month
  let month = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM');
  // let month = 'April';
  // Logger.log(month);

  let ss = SpreadsheetApp.getActive();
  let sh = ss.getActiveSheet();
  let data = sh.getDataRange().getValues().filter(current => current[13] === month);
  // Logger.log(data);
  for (let i = 0; i < data.length; i++) {
    const person = {
      email: data[i][1],
      school: data[i][3],
      bot: data[i][8].split(' ')[0]
    };
    person.name = findName(person.email).trim();
    // Logger.log(person);


    let botCal = SpreadsheetApp.getActive().getSheetByName(person.bot);
    let row = botCal.createTextFinder(month).matchEntireCell(true).findNext().getRow();
    // Logger.log(row)
    let calData = botCal.getDataRange().getValues().filter(current => current[0] === month);
    // Logger.log(calData)

    if (calData[0].find(booking => booking === person.name+' - '+person.school)) {
      // Logger.log(calData[0][m]);
      let bookingIndex = calData[0].indexOf(person.name+' - '+person.school);
      var nextBooking = botCal.getRange(row+1,bookingIndex+1).getValue();
      if (nextBooking === '') {
        nextBooking = 'B&LT 133 Greenbank - 4th Floor - Attention Consultants';
      }
      Logger.log(calData[0][bookingIndex]+' -> '+nextBooking)
    }

    let superSheet = ss.getSheetByName('Superintendencies');
    let findSchool = superSheet.createTextFinder(person.school).matchEntireCell(true).findNext();
    let mailPickupDay = "on "+superSheet.getRange(findSchool.getRow(),findSchool.getColumn()+1).getValue();

    let checklistDoc = "https://docs.google.com/document/d/1J84k7wRZSyYIYWOH2f0sZ8KRknphauHj0URiaXIor0I/edit#";
    let feedbackForm = "https://forms.gle/64XNzUYjUB4NbS2u5";

    MailApp.sendEmail({
      to: person.email,
      subject: `Upcoming ${person.bot} Loaner Kit Return Date`,
      htmlBody: 

      `<p>Salut,</p>
    
     <p>Your loan period is nearing its end and it is time to package and send the <b>${person.bot}</b> kit to the next educator. Please refer to the <a href='${checklistDoc}'>attached checklist</a> to ensure all of the parts of the kits are accounted for, in working order and packaged appropriately.</p>

     <p>Ideally, each bot should be charged and wiped with a dry clean rag so that the next school can get started right away. Please also make sure that you clearly address the kit to the next educator by including their full name and school location. The kit needs to be sent to<b>: ${nextBooking}</b> within the next week. If you are using Board mail, your school’s mail gets picked up <b>${mailPickupDay}</b> from your office. Otherwise, you can deliver the kit directly to the next school.</p>

     <p>Don’t forget to complete the <a href='${feedbackForm}'>Robot Experience Form</a> and email us any pictures you would like to share. We would love to see celebrations of student learning. If your school is interested in purchasing their own set of robots, please contact Kathryn DeBodt at Kathryn.Debodt@ocdsb.ca</p>

    <p>Looking forward to hearing your feedback,</p>

     <p>#TeamAwesome</p>`
    })
  }
}