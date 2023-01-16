const dummy = () => {
  return true;
};

function disableMouseEvent() {
  console.debug('Bypass click event script is start');
  setInterval(() => {
    try {
      unsafeWindow.require(['quizaccess_photo/init']).save_error_event = dummy;
      unsafeWindow.require('quizaccess_photo/init').unfocus = dummy;
    } catch (e) {
      console.debug(e);
    }
  }, 100);
}

export default disableMouseEvent;
