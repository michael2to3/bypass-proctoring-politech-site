const dummy = () => {
  return true;
};

function disableMouseEvent() {
  console.debug('Bypass click event script is start');
  unsafeWindow.require(['quizaccess_photo/init'], (module) => {
    module.save_error_event = dummy;
    module.unfocus = dummy;
  });
}

export default disableMouseEvent;
