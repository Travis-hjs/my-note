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

class ChartAduioModule {
    /**
     * 音频图表组件
     * @param {HTMLCanvasElement} el canvas 节点
     */
    constructor(el) {
        this.canvas = el;
        this.init();
    }
    
    /**
     * @type {HTMLCanvasElement}
     */
    canvas = null;

    /**
     * @type {AnalyserNode}
     */
    analyser = null;

    /**
     * 设置音频数据
     * @param {AnalyserNode} res 
     */
    setAnalyser(res) {
        this.analyser = res;
    }

    init() {
        const THAT = this;
        const ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;

        function update() {
            if (THAT.analyser) {
                ctx.strokeStyle = '#00d0ff';
                ctx.lineWidth = 2;
                ctx.clearRect(0, 0, THAT.canvas.width, THAT.canvas.height);
                let dataArray = new Uint8Array(THAT.analyser.frequencyBinCount);
                THAT.analyser.getByteFrequencyData(dataArray);
                let step = Math.round(dataArray.length / 60);
    
                for (let i = 0; i < 40; i++) {
                    let energy = (dataArray[step * i] / 256.0) * 50;
                    for (let j = 0; j < energy; j++) {
                        ctx.beginPath();
                        ctx.moveTo(20 * i + 2, 200 + 4 * j);
                        ctx.lineTo(20 * (i + 1) - 2, 200 + 4 * j);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(20 * i + 2, 200 - 4 * j);
                        ctx.lineTo(20 * (i + 1) - 2, 200 - 4 * j);
                        ctx.stroke();
                    }
                    ctx.beginPath();
                    ctx.moveTo(20 * i + 2, 200);
                    ctx.lineTo(20 * (i + 1) - 2, 200);
                    ctx.stroke();
                }
            }
            window.requestAnimationFrame(update);
        }
        update();
    }
}

class AudioContextModule {
    /**
     * AudioContext 音频组件 解决在移动端网页上标签播放音频延迟的方案 貌似 H5 游戏引擎也是使用这个实现
     * 资料参考：https://www.cnblogs.com/Wayou/p/html5_audio_api_visualizer.html
     */
    constructor() {
        const AudioModule = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        this.context = new AudioModule();
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 256;
    }

    /** 是否加载完成 */
    loaded = false;

    /**
     * 音频上下文
     * @type {AudioContext}
     */
    context = null;

    /** 
     * @type {AnalyserNode} 
     */
    analyser = null;

    /**
     * @type {AudioBufferSourceNode}
     */
    bufferNode = null;

    /**
     * @type {AudioBuffer}
     */
    buffer = null;

    /**
     * 加载路径音频文件
     * @param {string} url 音频路径
     * @param {Function} callback 加载完成回调
     */
    loadPath(url, callback) {
        const XHR = new XMLHttpRequest(); 
        XHR.open('GET', url, true); 
        XHR.responseType = 'arraybuffer'; 
        // 先加载音频文件
        XHR.onload = () => {
            this.context.decodeAudioData(XHR.response, buffer => {
                // 最后缓存音频资源
                this.buffer = buffer;
                this.loaded = true;
                if (typeof callback === 'function') callback();
            });
        }
        XHR.send(null);
    }

    /** 
     * 加载 input 音频文件
     * @param {File} file 音频文件
     * @param {Function} callback 加载完成回调
     */
    loadFile(file, callback) {
        const FR = new FileReader();
        // 先加载音频文件
        FR.onload = e => {
            let res = e.target.result;
            // 然后解码
            this.context.decodeAudioData(res, buffer => {
                // 最后缓存音频资源
                this.buffer = buffer;
                this.loaded = true;
                if (typeof callback === 'function') callback();
            });
        }
        FR.readAsArrayBuffer(file);
    }

    /** 播放音频 */
    play() {
        if (!this.loaded) return console.warn('音频未加载完成 !!!');
        // 这里有个问题，就是创建的音频对象不能缓存下来然后多次执行 start , 所以每次都要创建然后 start()
        this.bufferNode = this.context.createBufferSource();
        this.bufferNode.connect(this.analyser);
        this.analyser.connect(this.context.destination);
        this.bufferNode.buffer = this.buffer;
        this.bufferNode.start(0);
    }

    /** 停止播放 */
    stop() {
        if (!this.bufferNode) return console.warn('音频未播放 !!!');
        this.bufferNode.stop();
    }
}

/**
 * 上传音频文件
 * @param {HTMLInputElement} el 
 */
function uploadAudio(el) {
    const AudioModule = new AudioContextModule();
    const box = el.parentNode;
    const item = document.createElement('div');
    AudioModule.loadFile(el.files[0], function () {
        let canvas = document.createElement('canvas');
        let btn = document.createElement('button');
        btn.innerHTML = '播放' + el.files[0].name;
        item.className = 'audio-item';
        item.appendChild(btn);
        item.appendChild(canvas);
        box.appendChild(item);
        const Chart = new ChartAduioModule(canvas);
        btn.onclick = function () {
            AudioModule.play();
            Chart.setAnalyser(AudioModule.analyser);
        }
        el.value = null;
    });
}

