export const rawSetLastActive = `
    function goodSet_last_active() {
      var app = this;
      setInterval(function () {
        var ajaxdata = {
          action: "set_last_active",
          cmid: quizdata.cmid,
          userid: quizdata.userid,
          userattempt: quizdata.userattempt,
        };
        app.send_to_ajax(ajaxdata);
      }, 10000);
    }
`;
export const rawCreateSession = `
function goodCreateSession() {
      var app = this;
        const ajaxurl = $(modal).attr("ajaxurl");
        // token = data.sessionToken;
        var ajaxdata = {
          action: "saveToken",
          cmid: quizdata.cmid,
          userid: quizdata.userid,
          userattempt: quizdata.userattempt,
          session_ttl: quizdata.tokenttl,
          // token: token
        };
        $.ajax({
          url: M.cfg.wwwroot + ajaxurl,
          type: "POST",
          data: ajaxdata,
        }).done(function (data) {
          if (data != 0) {
            token = data;
            app.set_last_active();
          } else {
            $(".js-btn-next")
              .attr("disabled", true)
              .css("cursor", "not-allowed");
            alert(
              "Не удалось создать сессию, обновите страницу и попробуйте еще раз"
            ); //TODO это верно
          }
        });
}
`;
export const rawInitFunction = `
function goodInit(quiz, connect, cfgbranch) {
console.debug("Work good init function!");
      var app = this;
      // app.wstest();
      branch = parseInt(cfgbranch);
      quizdata = quiz;
      quizdata.allowwithout = parseInt(quizdata.allowwithout);
      quizdata.continuewithout = parseInt(quizdata.continuewithout);
      if (!quizdata.continuewithout) {
        app.disableAll();
      }
      connectdata = connect;
      token = quizdata.token;
      fileid = Math.round(Math.random() * 100000);
      var template = "quizaccess_photo/photo";
      var tpldata = {
        id: fileid,
        allowwithout: quizdata.allowwithout,
        backurl: M.cfg.wwwroot + "/course/view.php?id=" + quizdata.courseid,
        starthref:
          M.cfg.wwwroot +
          "/mod/quiz/startattempt.php?cmid=" +
          quizdata.cmid +
          "&sesskey=" +
          quizdata.sesskey,
        timelimit: quizdata.timelimit,
      };
      tpldata[quizdata.lang] = true;
      if (pass) {
        tpldata.files = pass;
      }

require(['core/templates'], (tpl) => {
      tpl
        .render(template, tpldata)
        .then(function (html) {
          //Если попытка не начата или жмем "Продолжить последнюю попытку"
          if (!quizdata.attemptid || quizdata.continueattempt) {
            app.renderModal(html);
          } else {
            //допуск в тест, выводить сообщения по фото
            app.disable_all_elements();
            $(container).prepend(html);
            app.changeStep(3);
            app.hideModal();
            app.unfocus();
          }
        })
        .fail(function (ex) {});
})
    }
`;
export const rawInitVarible = `
  var step = 1;
  var branch;
  var container = "#region-main";
  var modal = "#photo-block";
  var sectionExam;
  var videoInModal = true;
  var fileid;
  var pass = false;
  var quizdata = {};
  var connectdata = {};
  var token = false;
  var now = 0;
  var is_focus = true;
`;
const rawCameraPayload = `
function goodStartPhoto() {
  var quizdata = {}; // safe quizdata
      var app = this;
      if (!quizdata.attemptid) {
        app.createSession();
      }
      const sectionTakePhoto = document.getElementById("take-photo");
      const sectionPhotoList = document.getElementById("photo-list");
      sectionExam = document.getElementById("exam");
      const photos = [];

      if (quizdata.attemptid) {
        startExam();
      } else {
        // *Taking photos
        sectionTakePhoto
          .querySelector(".js-btn-next")
          .addEventListener("click", (e) => {
            sectionTakePhoto.children[0].style.display = "none";
            sectionTakePhoto.children[1].style.display = "block";
            initPhotos();
          });
      }

      function initPhotos() {
        let phase = 0;
        photos.splice(0, photos.length);
        sectionPhotoList.innerHTML = "";

        const video = sectionTakePhoto.querySelector("#take-photo--video");
        const canvas = sectionTakePhoto.querySelector("#take-photo--canvas");

        video.setAttribute("autolay", "");
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");

        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            video.srcObject = stream;

            if (connectdata.save_video) {
              app.start_record(stream);
            }

            sectionExam.querySelector("li.js-camera-connect").innerHTML = "";
            // Need event because video doesn't have resolution before it. Loads almost instantly
            video.addEventListener("loadedmetadata", () => {
              const context = canvas.getContext("2d");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;

              // The following 2 lines flip image horizontally for ease of recognition
              context.translate(canvas.width, 0);
              context.scale(-1, 1);

              setTimeout(takePhoto, 3000);
            });
          })
          .catch(function (err) {
            if (err.name == "NotAllowedError") {
              alert("Необходимо разрешить использование камеры!");
            } else {
              alert("Что то пошло не так");
            }
          });

        async function takePhoto(incPhase = true) {
          const pointer = sectionTakePhoto.querySelector(".pointer");
          pointer.className = "pointer";
          if (incPhase) ++phase;
          var addclass = "";
          if (phase > 5) { 
            addclass = "hidden";
          } else {
            addclass = ["center", "right", "bottom", "left", "top"][phase]; 
          }
          pointer.classList.add(addclass);

          const context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(video, 0, 0);
          const photo = canvas.toDataURL("image/jpeg");
          const base64_video = photo.split(",")[1]

          var senddata = {
            image: base64_video,
            session_token: token,
          };
          // split because the format is data:image/jpeg;base64,%base64 of the image% and we just want to send the base64
          try {
            const { data } = await axios.post(
              connectdata.server + "/recognize",
              senddata
            );
            if (data.result) {
              photos.push({
                photo,
                vector: data.vector,
              });

              const img = document.createElement("img");
              img.setAttribute("src", photo);
              sectionPhotoList.appendChild(img);

              if (phase < 5) {
                // next phase
                setTimeout(takePhoto, 3000);
              } else {
                // finish taking photos
                sectionTakePhoto.style.display = "none";
                sectionPhotoList.style.display = "none";
                startExam();
              }
            } else {
              setTimeout(function () {
                takePhoto(false);
              }, 200);
              // alert('Что-то пошло не так. Пожалуйста, попробуйте снова.');
            }
          } catch (e) {
            setTimeout(function () {
              takePhoto(false);
            }, 500);
          }
        }
      }

      // *Exam logic=
      function startExam() {
        app.btnSetState(true);
        app.set_last_active();
        if (quizdata.continuewithout) {
          app.enableAll();
        } else {
          /*var db = [];*/
          const video = sectionExam.querySelector("#exam--video");
          const canvas = sectionExam.querySelector("#exam--canvas");
          const cover = sectionExam.querySelector("#exam--cover");
          sectionExam.style.display = "block";
          var noteblock = $(sectionExam)
            .find("ul")
            .find("li.js-notificaton-message");
          var enabled = false;

          video.setAttribute("autolay", "");
          video.setAttribute("muted", "");
          video.setAttribute("playsinline", "");

          navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => {
              video.srcObject = stream;
              if (connectdata.save_video) {
                app.start_record(stream);
              }
              sectionExam.querySelector("li.js-camera-connect").innerHTML = "";

              if (!enabled) {
                app.enableAll();
                enabled = true;
              }

              // Need event because video doesn't have resolution before it. Loads almost instantly
              video.addEventListener("loadedmetadata", () => {
                const context = canvas.getContext("2d");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // The following 2 lines flip image horizontally for ease of recognition
                context.translate(canvas.width, 0);
                context.scale(-1, 1);

                if (quizdata.attemptid) {
                  setTimeout(function () {
                    verify();
                    setInterval(verify, 1000);
                  }, 2000);
                } else {
                  verify();
                  setInterval(verify, 1000);
                }
              });
            })
            .catch(function (err) {
              if (err.name == "NotAllowedError") {
                alert("Необходимо разрешить использование камеры!");
                // window.location.reload(); //запоминает запрет на камеру при автоматической перезагрузке
              } else {
                alert("Что то пошло не так");
              }
            });

          /*setInterval(function () {
                        var toajax = {action: 'sendEvents', data: JSON.stringify(db)};
                        $.ajax({
                            url: ajaxurl,
                            type: "POST",
                            data: toajax
                        }).done(function (data) {

                        });
                        db = [];
                    }, 3000);*/
          async function verify() {
            const photo = takePhoto();

            cover.setAttribute("src", photo);
            var senddata = {
              image: photo.split(",")[1],
              vectors: photos.map((photo) => photo.vector),
              session_token: token,
            };

            const { data } = await axios
              .post(connectdata.server + "/verification", senddata)
              .catch(function (er) {
                if (Date.now() - now > 5000 && quizdata.attemptid) {
                  app.save_error_event();
                }
                var text = "Ошибка соединения";
                noteblock.html(text);
              });

            var text = "";
            var canTest = false;
            if (data.result) {
              text = data.notification_message;
              if (!text) {
                canTest = true;
                text = "Экзаменуемый идентифицирован";
              }
            } else {
              if (data.notification_message == "early_completion") {
                text = "Превышен лимит на нарушения";
                var ajaxdata = {
                  action: "close_attempt",
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
              noteblock.addClass("good");
            } else {
              noteblock.removeClass("good");
            }
            // if (!enabled) {
            //     app.enableAll();
            //     enabled = true;
            // }

            /*var text = '';
                        if (data.confidence >= 0.5) {
                            text = "Экзаменуемый идентифицирован";
                            sectionExam.querySelector('li.js-user-confidence').classList.add('good');
                        } else {
                            sectionExam.querySelector('li.js-user-confidence').classList.remove('good');
                            text = "Экзаменуемый не найден";
                        }
                        sectionExam.querySelector('li.js-user-confidence').innerHTML = text;
                        sectionExam.querySelector('li.js-cam-closed').innerHTML = data.cam_close ? 'Камера закрыта' : '';
                        sectionExam.querySelector('li.js-humans-count').innerHTML = data.humans_count ? '' : 'Не найдены люди в кадре';
                        sectionExam.querySelector('li.js-faces-count').innerHTML = data.faces_count ? '' : 'Не найдены лица в кадре';



                        // sectionExam.querySelector('span.js-user-confidence').innerHTML = data.confidence >= 0.5 ? 'Да' : 'Нет';
                        // sectionExam.querySelector('span.js-cam-closed').innerHTML = data.cam_close ? 'Да' : 'Нет';
                        // sectionExam.querySelector('span.js-humans-count').innerHTML = data.humans_count;
                        // sectionExam.querySelector('span.js-faces-count').innerHTML = data.faces_count;
                        // sectionExam.querySelector('span.js-head-direction').innerHTML = data.head_direction;

                        var canTest = true;
                        if (data.cam_close || !data.faces_count || !data.humans_count) {
                            canTest = false;
                        }
                        if (!canTest) {
                            // app.renderModal();
                        } else if (canTest && videoInModal) {
                            // app.hideModal();
                        }*/
          }

          function takePhoto() {
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(video, 0, 0);

            return canvas.toDataURL("image/jpeg");
          }
        }
      }
    }
`;
export default rawCameraPayload;
