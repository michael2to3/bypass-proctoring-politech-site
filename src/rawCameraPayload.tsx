const rawCameraPayload = `
function good_start_record(stream) {
console.debug('wow');
      var app = this;
      var recordedBlobs = [];
      var slice = parseInt(connectdata.chunkslice);

      try {
        var mediaRecorder = new MediaRecorder(stream);
      } catch (e) {
        console.error("Exception while creating MediaRecorder: " + e);
        return;
      }

      // console.log('Created MediaRecorder', mediaRecorder);

      mediaRecorder.onstart = function (e) {
        setTimeout(function () {
          mediaRecorder.stop();
        }, slice);
      };

      mediaRecorder.onstop = function (e) {
        var type = app.choose_format();
        // var blob = new Blob(recordedBlobs, {type: 'video/webm'});
        // var blob = new Blob(recordedBlobs, {type: 'video/h264'});
        var blob = new Blob(recordedBlobs, { type: type });
        var video_blob_url = window.URL.createObjectURL(blob);

        var url =
          M.cfg.wwwroot + $(modal).attr("ajaxurl") + "?action=save_video_chunk";

        var ajaxdata = {
          cmid: quizdata.cmid,
          userid: quizdata.userid,
          userattempt: quizdata.userattempt,
          type: type,
        };
        for (var i in ajaxdata) {
          url += "&" + i + "=" + ajaxdata[i];
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        //Передает правильный заголовок в запросе
        xhr.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhr.onreadystatechange = function () {
          //Вызывает функцию при смене состояния.
          if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Запрос завершен. Здесь можно обрабатывать результат.
          }
        };
        xhr.send(blob);

        recordedBlobs = [];
        mediaRecorder.start(slice);
      };

      mediaRecorder.ondataavailable = function (event) {
        if (event.data && event.data.size > 0) {
          recordedBlobs.push(event.data);
        }
      };

      mediaRecorder.start(slice);
      // console.log('MediaRecorder started', mediaRecorder);
}
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
