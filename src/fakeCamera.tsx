import rawCameraPayload from './rawCameraPayload';

const cameraDetect = () => {
  return (
    document.contains(document.querySelector('.camera')) &&
    document.contains(document.querySelector('.photo-block__header'))
  );
};
const handlerCamera = () => {
  console.debug('Camera is found');

  const warningText = document.createElement('span');
  warningText.innerText = 'Capture is enable';
  warningText.style.color = 'red';

  document.querySelector('.camera').appendChild(warningText);

  const script = GM_addElement('script');
  script.textContent = rawCameraPayload;
  document.body.appendChild(script);

  unsafeWindow.requirejs('quizaccess_photo/init').verify =
    unsafeWindow.goodVerify;
};
const fakeCamera = () => {
  console.debug('Fake camera start');
  const intDetect = setInterval(() => {
    if (cameraDetect()) {
      handlerCamera();
      clearInterval(intDetect);
    }
  }, 100);
};

export default fakeCamera;
