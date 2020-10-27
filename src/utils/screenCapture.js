import html2canvas from 'html2canvas';

const container = document.body;

export default () => {
  html2canvas(container).then(canvas => {
    const dataURL = canvas.toDataURL('image/png');

    // 下载图片
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = dataURL;
    // 设置下载标题
    a.download = '截屏';
    a.click();
    document.body.removeChild(a);
  });
};
