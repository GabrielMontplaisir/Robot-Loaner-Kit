function createTriggers() {
  var ss = SpreadsheetApp.getActive();
  var triggers = ScriptApp.getProjectTriggers();
  var formSubmitTriggerExists = false;
  var monthTriggerExists = false;

  triggers.forEach(function (trigger) {
    if(trigger.getEventType() === ScriptApp.EventType.ON_FORM_SUBMIT && trigger.getHandlerFunction() === "formSubmit") {
      formSubmitTriggerExists = true;
    }

    if(trigger.getEventType() === ScriptApp.EventType.CLOCK && trigger.getHandlerFunction() === "emailTeachers") {
      monthTriggerExists = true;
    }

  });

  if (!formSubmitTriggerExists) {
    ScriptApp.newTrigger('formSubmit')
      .forSpreadsheet(ss)
      .onFormSubmit()
      .create();
    Logger.log("Trigger Created")
  }

  if (!monthTriggerExists) {
    ScriptApp.newTrigger('emailTeachers')
      .timeBased()
      .atHour(8)
      .onMonthDay(20)
      .create();
    Logger.log("Trigger Created")
  }
}
