(function () {
  /**
   * 查找单个元素
   * @param {string} name 
   * @returns {HTMLElement}
   */
  const $ = name => document.querySelector(name);

  /**
   * 输出`iframe`到指定节点中
   * @param {HTMLElement} parent 输出的节点
   * @param {object} size 尺寸（可选）
   * @param {number} size.width 宽度
   * @param {number} size.height 高度
   */
  function createViewFrame(parent, size) {
    const scriptId = "the-iframe-script";
    const frame = document.createElement("iframe");
    frame.width = size ? size.width : parent.clientWidth;
    frame.height = size ? size.height : parent.clientHeight;
    frame.frameBorder = "0";
    parent.appendChild(frame);

    /**
     * 输出脚本
     * @param {string} value 脚本代码
     */
    function outputScript(value) {
      const script = frame.contentDocument.createElement("script");
      script.id = scriptId;
      script.innerHTML = value;
      frame.contentDocument.body.appendChild(script);
    }

    /**
     * 提取页面内容
     * @param {string} code 页面内容
     */
    function getHTML(code) {
      let head = "";
      let body = "";
      let script = "";

      // 一个页面可能有多个`script`标签，所以递归把所有的抽出来
      function getScript() {
        const result = code.match(/<script>([\s\S]*?)<\/script>/);
        if (result) {
          const value = result[1];
          script += value.charAt(value.length - 1) === ";" ? value : `;${value}`;
          code = code.replace(result[0], "");
          getScript();
        }
      }

      getScript();

      const headResult = code.match(/<head>([\s\S]*?)<\/head>/);

      if (headResult) {
        head = headResult[1];
        code = code.replace(headResult[0], "");
      }

      const bodyResult = code.match(/<body>([\s\S]*?)<\/body>/);

      if (bodyResult) {
        body = bodyResult[1];
      } else {
        body = code;
      }

      return {
        /** <head>内容</head> */
        head,
        /** <body>内容</body> */
        body,
        /** <script>内容</script> */
        script
      }
    }

    return {
      /**
       * 更新内容
       * @param {string} code 
       */
      updateContent(code) {
        const html = getHTML(code);
        frame.contentDocument.body.innerHTML = html.body;
        frame.contentDocument.head.innerHTML = html.head;

        // 判断脚本是否需要更新
        const frameScript = frame.contentDocument.getElementById(scriptId)
        if (frameScript) {
          if (frameScript.innerHTML != html.script) {
            // frame.contentDocument.location.reload();
            frameScript.innerHTML = html.script;
          }
        } else {
          outputScript(html.script);
        }
      }
    }
  }
  const codeBox = $(".code-box");
  const viewBox = $(".view-box");
  const viewFrame = createViewFrame(viewBox);

  /** 
   * 节流定时器
   * @type {number}
   */
  let timer;

  codeBox.oninput = function () {
    // console.log(this.value);
    clearTimeout(timer);
    timer = setTimeout(function () {
      viewFrame.updateContent(codeBox.value);
    }, 300);
  }

  let template = `<html>
  <body>
    <div style="color: orange; font-size: 15px;">内容</div>
    <button onclick="alert1()">提示n1</button>
    <button onclick="alert2()">提示n2</button>
    <script>var n1= 15;</script>
  </body>
  <script>
    var n2= 16;
    function alert1() { alert(n1); }
    function alert2() { alert(n2); }
  </script>
  </html>`;

})();