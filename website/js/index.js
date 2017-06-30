
window.addEventListener('load', () => {
    document.getElementsByTagName('body')[0].style.display = 'block';
    setClass('bgScene');
    setClass('bgMan', 500);
    setClass('bgShadow', 400);
    setClass('download', 800, 'button show');
    setClass('github', 700, 'button show');
    setClass('logo', 800);
    setClass('logoText', 1000);
    setClass('text0', 1100);
    setClass('textSymbol', 1300);
    setClass('text1', 1200);


    document.getElementById('download')
        .addEventListener('click', function () {
            document.getElementById('downloads').className = 'show';
            document.getElementById('download').className = 'button hide';
        });
});


function setClass(id, timeOut=0, className='show') {
    setTimeout(() => document.getElementById(id).className = className, timeOut)
}