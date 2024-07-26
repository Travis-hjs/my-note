// 类型提示用（运行时不会引用）
/// <reference path="../../../utils/dom.js" />

(function () {
  const elInput = find(".upload-input");

  elInput.addEventListener("change", async function(e) {
    /**
     * @type {File}
     */
    const file = e.target.files[0];
    console.time("cut file time");
    const chunks = await cutFile(file);
    console.timeEnd("cut file time");
    console.log("文件分片列表", chunks);
  });

  /** 每个分片的大小，默认`1MB` */
  const chunkSize = 1024 * 1024 * 1;

  /**
   * 切片文件
   * @param {File} file 
   */
  async function cutFile(file) {
    const chunkTotal = Math.ceil(file.size / chunkSize);

    // /**
    //  * 获取每一个切片的信息
    //  * @param {number} index 
    //  * @returns {Promise<{ start: number, end: number, index: number, hash: string, blob: Blob }>}
    //  */
    // function getChunk(index) {
    //   return new Promise(function(resolve, reject) {
    //     const start = index * chunkSize;
    //     const end = start + chunkSize;
    //     const hash = `${index}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    //     const blob = file.slice(start, end);
    //     const fileReader = new FileReader();
    //     fileReader.onload = function(e) {
    //       console.log(e, index);
    //       resolve({
    //         start,
    //         end,
    //         index,
    //         hash,
    //         blob
    //       })
    //     }
    //     fileReader.onerror = function(error) {
    //       console.log(error);
    //       reject(error);
    //     };
    //     fileReader.readAsArrayBuffer(blob);
    //   });
    // }

    /**
     * 获取每一个切片的信息
     * @param {number} index 
     */
    function getChunk(index) {
      const start = index * chunkSize;
      const end = start + chunkSize;
      const hash = `${file.name}-${index}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const blob = file.slice(start, end);
      return {
        start,
        end,
        index,
        hash,
        blob
      }
    }

    const allChunks = [];

    for (let i = 0; i < chunkTotal; i++) {
      allChunks.push(getChunk(i));
    }

    return allChunks;
  }

})();
