const dummy = () => {
  return true;
};
function disableMouseEvent() {
  console.debug('Bypass click event script is start');
  setInterval(() => {
    unsafeWindow.requirejs('quizaccess_photo/init').save_error_event = dummy;
    unsafeWindow.requirejs('quizaccess_photo/init').unfocus = dummy;
  }, 100);
}
export default disableMouseEvent;
