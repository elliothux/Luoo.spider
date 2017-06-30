
window.addEventListener('load', () => {
    document.getElementsByTagName('body')[0].style.display = 'block';
    setClass('bgScene');
    setClass('bgMan', 800);
    setClass('bgShadow', 700);
    setClass('logo', 1300);
    setClass('logoText', 1500);
    setClass('download', 1700, 'button show');
    setClass('github', 1900, 'button show');
    setClass('text0', 2300);
    setClass('textSymbol', 2500);
    setClass('text1', 2300);

    document.getElementById('download').addEventListener('click', () => {
        document.getElementById('downloads').className = 'show';
        document.getElementById('download').className = 'button hide';
    });
    document.getElementById('github').addEventListener('click', () => {
        window.open('https://github.com/HuQingyang/Luoo.qy', '_black')
    });
    const buttons = document.getElementById('downloads').children;
    for (let i=0; i<buttons.length; i++)
        buttons[i].addEventListener('click', () => {
            window.open(`http://l.page.中国/download/${i}`)
        })
});


function setClass(id, timeOut=0, className='show') {
    setTimeout(() => document.getElementById(id).className = className, timeOut)
}