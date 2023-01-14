const rawCameraPayload = `
async function goodVerify() {
console.log("wow");
  const photo = takePhoto();

  cover.setAttribute('src', photo);
  var senddata = {
    image: photo.split(',')[1],
    vectors: photos.map((photo) => photo.vector),
    session_token: token,
  };

  const { data } = await axios
    .post(connectdata.server + '/verification', senddata)
    .catch(function (er) {
      if (Date.now() - now > 5000 && quizdata.attemptid) {
        app.save_error_event();
      }
      var text = 'Ошибка соединения';
      noteblock.html(text);
    });

  var text = '';
  var canTest = false;
  if (data.result) {
    text = data.notification_message;
    if (!text) {
      canTest = true;
      text = 'Экзаменуемый идентифицирован';
    }
  } else {
    if (data.notification_message == 'early_completion') {
      text = 'Превышен лимит на нарушения';
      var ajaxdata = {
        action: 'close_attempt',
        cmid: quizdata.cmid,
        userid: quizdata.userid,
        userattempt: quizdata.userattempt,
      };

      app.send_ajax(ajaxdata).then(
        function (response) {
          window.location.href = response;
        },
        function (error) {}
      );
    }
  }
  noteblock.html(text);
  if (canTest) {
    noteblock.addClass('good');
  } else {
    noteblock.removeClass('good');
  }
}`;

export default rawCameraPayload;
