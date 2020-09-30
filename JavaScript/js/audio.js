/** 音频文件路径 列表 */
const audios = ["audio/click.mp3", "audio/destroy.mp3", "audio/success.mp3"];

/**
 * 创建一个`html`音频
 * [see](http://www.w3school.com.cn/jsref/dom_obj_audio.asp)
 * @param {string} src 音频路径
 * @param {boolean} loop 是否需要循环
 */
function createAudioLabel(src, loop) {
    const label = new Audio();
    document.body.appendChild(label);
    // 设置或返回是否在就绪（加载完成）后随即播放音频
    label.autoplay = false;
    // 设置或返回音频是否应该显示控件（比如播放/暂停等）
    label.controls = false;
    // 设置或返回音频是否应在结束时再次播放。
    label.loop = loop;
    // 设置或返回音频中的当前播放位置（以秒计）
    label.currentTime = 0;
    // 设置路径
    label.src = src;
    return label;
}

const theAudio = createAudioLabel(audios[0]);

function playAudio() {
    if (theAudio.currentTime > 0) theAudio.currentTime = 0;
    theAudio.play();
}

function pauseAudio() {
    theAudio.pause();
}

/**
 * `AudioContext`音频组件 
 * [资料参考](https://www.cnblogs.com/Wayou/p/html5_audio_api_visualizer.html)
 * @description 解决在移动端网页上标签播放音频延迟的方案 貌似`H5`游戏引擎也是使用这个实现
 */
function audioContext() {
    /**
     * 音频上下文
     * @type {AudioContext}
     */
    const context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext)();
    /** 
     * @type {AnalyserNode} 
     */
    const analyser = context.createAnalyser();;
    /**
     * @type {AudioBufferSourceNode}
     */
    let bufferNode = null;
    /**
     * @type {AudioBuffer}
     */
    let buffer = null;
    /** 是否加载完成 */
    let loaded = false;

    analyser.fftSize = 256;

    return {
        /**
         * 加载路径音频文件
         * @param {string} url 音频路径
         * @param {(res: AnalyserNode) => void} callback 加载完成回调
         */
        loadPath(url, callback) {
            const XHR = new XMLHttpRequest(); 
            XHR.open("GET", url, true); 
            XHR.responseType = "arraybuffer"; 
            // 先加载音频文件
            XHR.onload = () => {
                context.decodeAudioData(XHR.response, audioBuffer => {
                    // 最后缓存音频资源
                    buffer = audioBuffer;
                    loaded = true;
                    typeof callback === "function" && callback(analyser);
                });
            }
            XHR.send(null);
        },

        /** 
         * 加载 input 音频文件
         * @param {File} file 音频文件
         * @param {(res: AnalyserNode) => void} callback 加载完成回调
         */
        loadFile(file, callback) {
            const FR = new FileReader();
            // 先加载音频文件
            FR.onload = e => {
                const res = e.target.result;
                // 然后解码
                context.decodeAudioData(res, audioBuffer => {
                    // 最后缓存音频资源
                    buffer = audioBuffer;
                    loaded = true;
                    typeof callback === "function" && callback(analyser);
                });
            }
            FR.readAsArrayBuffer(file);
        },

        /** 播放音频 */
        play() {
            if (!loaded) return console.warn("音频未加载完成 !!!");
            // 这里有个问题，就是创建的音频对象不能缓存下来然后多次执行 start , 所以每次都要创建然后 start()
            bufferNode = context.createBufferSource();
            bufferNode.connect(analyser);
            analyser.connect(context.destination);
            bufferNode.buffer = buffer;
            bufferNode.start(0);
        },

        /** 停止播放 */
        stop() {
            if (!bufferNode) return console.warn("音频未播放 !!!");
            bufferNode.stop();
        }
    }
}

/**
 * 音频图表组件
 * @param {HTMLCanvasElement} canvas canvas节点
 */
function audioChart(canvas) {
    const context = canvas.getContext("2d");
    /**
     * @type {AnalyserNode}
     */
    let analyser = null;

    canvas.width = 800;
    canvas.height = 400;

    function update() {
        if (analyser) {
            context.strokeStyle = "#00d0ff";
            context.lineWidth = 2;
            context.clearRect(0, 0, canvas.width, canvas.height);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            const step = Math.round(dataArray.length / 60);

            for (let i = 0; i < 40; i++) {
                const energy = (dataArray[step * i] / 256.0) * 50;
                for (let j = 0; j < energy; j++) {
                    context.beginPath();
                    context.moveTo(20 * i + 2, 200 + 4 * j);
                    context.lineTo(20 * (i + 1) - 2, 200 + 4 * j);
                    context.stroke();
                    context.beginPath();
                    context.moveTo(20 * i + 2, 200 - 4 * j);
                    context.lineTo(20 * (i + 1) - 2, 200 - 4 * j);
                    context.stroke();
                }
                context.beginPath();
                context.moveTo(20 * i + 2, 200);
                context.lineTo(20 * (i + 1) - 2, 200);
                context.stroke();
            }
        }
        window.requestAnimationFrame(update);
    }
    update();

    return {
        /**
         * 设置音频数据
         * @param {AnalyserNode} res 
         */
        setAnalyser(res) {
            analyser = res;
        }
    }
}

/**
 * 上传音频文件
 * @param {HTMLInputElement} el 
 */
function uploadAudio(el) {
    const audioComponent = audioContext();
    const box = el.parentNode;
    const item = document.createElement("div");

    audioComponent.loadFile(el.files[0], function(analyser) {
        const canvas = document.createElement("canvas");
        const btn = document.createElement("button");
        btn.innerHTML = "播放" + el.files[0].name;
        item.className = "audio-item";
        item.appendChild(btn);
        item.appendChild(canvas);
        box.appendChild(item);
        const chart = audioChart(canvas);
        btn.onclick = function () {
            audioComponent.play();
            chart.setAnalyser(analyser);
        }
        el.value = null;
    });
}

const webAudio = audioContext();

webAudio.loadPath("https://longgeniubi.oss-cn-shanghai.aliyuncs.com/audio/tip.mp3");

function playWebAudio() {
    webAudio.play();
}