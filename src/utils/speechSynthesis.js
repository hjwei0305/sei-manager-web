export default msg => {
  if (SpeechSynthesisUtterance) {
    const msgObj = new SpeechSynthesisUtterance(msg);
    Object.assign(msgObj, {
      lang: 'zh-cn',
      volume: 100,
      rate: 1,
      pitch: 1.5,
    });
    window.speechSynthesis.speak(msgObj);
  }
};
