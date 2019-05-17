/** 音频文件路径 列表 */
let audios = ['audio/click.mp3', 'audio/destroy.mp3', 'audio/success.mp3'];

/**
 * 创建一个音频
 * learn: http://www.w3school.com.cn/jsref/dom_obj_audio.asp
 * @param {string} src 音频路径
 * @param {boolean} loop 是否需要循环
 */
function createAudio(src, loop) {
    let label = new Audio();
    document.body.appendChild(label);
    // 设置或返回是否在就绪（加载完成）后随即播放音频。
    label.autoplay = false;
    // 设置或返回音频是否应该显示控件（比如播放/暂停等）。
    label.controls = false;
    // 设置或返回音频是否应在结束时再次播放。
    label.loop = loop;
    // 设置或返回音频中的当前播放位置（以秒计）。
    label.currentTime = 0;
    // 设置路径
    label.src = src;
    return label;
}

let myAudio = createAudio(audios[0]);

function playAudio() {
    if (myAudio.currentTime > 0) myAudio.currentTime = 0; 
    myAudio.play();
}

function pauseAudio() {
    myAudio.pause();
}