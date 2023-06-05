function createTriggers() {
  let ss = SpreadsheetApp.getActive();
  let triggers = ScriptApp.getProjectTriggers();

  const formSubmitTriggerExists = triggers.find(trigger => {
    return trigger.getEventType() === ScriptApp.EventType.ON_FORM_SUBMIT && trigger.getHandlerFunction() === "formSubmit"});

  const monthTriggerExists = triggers.find(trigger => { 
    return trigger.getEventType() === ScriptApp.EventType.CLOCK && trigger.getHandlerFunction() === "sendEmail"});

  if (!formSubmitTriggerExists) {
    ScriptApp.newTrigger('formSubmit')
      .forSpreadsheet(ss)
      .onFormSubmit()
      .create();
    Logger.log("Trigger Created")
  }

  if (!monthTriggerExists) {
    ScriptApp.newTrigger('sendEmail')
      .timeBased()
      .atHour(8)
      .onMonthDay(20)
      .create();
    Logger.log("Trigger Created")
  }
}
