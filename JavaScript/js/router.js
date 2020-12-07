(function () {
    
    // /**
    //  * 获取处理过后的路劲名
    //  */
    // function getPathname() {
    //     let result = location.pathname;
    //     if (result && result.length > 1 && result[result.length - 1] == "/") {
    //         result = result.slice(0, result.length - 1);
    //     }
    //     return result;
    // }

    // /**
    //  * 获取`url?`后面参数（JSON对象）
    //  * @param {string} name 获取指定参数名
    //  * @param {string} target 目标字段，默认`location.search`
    //  * @returns {object|string}
    //  */
    // function getQueryParam(name = null, target = null) {
    //     const code = target || location.href.split("?")[1] || "";
    //     const list = code.split("&");
    //     const params = {};
    //     for (let i = 0; i < list.length; i++) {
    //         const item = list[i];
    //         const items = item.split("=");
    //         if (items.length > 1) {
    //             params[items[0]] = item.replace(`${items[0]}=`, "");
    //         }
    //     }
    //     if (name) {
    //         return params[name] || "";
    //     } else {
    //         return params;
    //     }
    //     // const matcher = new RegExp("(\\\\?|#|&)" + name + "=(.*?)(#|&|$)");
    //     // const result = (target || location.href).match(matcher);
    //     // return result ? result[2] : "";
    // }

    /**
     * 类型提示用，类似`TS`中的`interface`
     */
    const RouterChangeOptions = {
        /** 路由标题 */
        title: "",
        /** 路由路径 */
        path: "",
        /** 路由传参对象 */
        data: {},
        /** 路由传参`?`后面的参数对象 */
        params: {}
    }

    /**
     * 路由组件
     * @description `hash`模式，`history`模式使用的方式比较特殊，需要写多很多代码处理，所以没有写到同一个方法里面
     */
    function routerComponent() {
        const routeInfo = {};
        /** 当前路径传参对象 */
        let currentPathParams = {};
        /** 当前路由路径 */
        let currentPath = getHashPath();
        
        /**
         * 格式化传参字段
         * @param {object} parmas 传参对象
         */
        function formatParams(parmas) {
            let result = "";
            for (const key in parmas) {
                result += `&${key}=${parmas[key]}`;
            }
            return result ? `?${result.slice(1)}` : "";
        }

        /** 获取`hash`模式下的路由路径，并设置当前路由参数 */
        function getHashPath() {
            const values = location.href.split("#");
            if (values.length > 1) {
                const list = values[1].split("?");
                currentPathParams = list.length > 1 ? formatSearch(list[1]) : {};
                return list[0];
            } else {
                return "";
            }
        }

        /**
         * 获取处理过后的路径信息
         * @param {string} value 
         */
        function getPathInfo(value) {
            const list = value.split("?");
            return {
                path: list[0],
                params: list.length > 1 ? formatSearch(list[1]) : {}
            }
        }

        /**
         * 格式化`?`后面的参数成对象
         * @param {string} value `key=value`
         */
        function formatSearch(value) {
            const result = {};
            const values = value.split("&");
            for (let i = 0; i < values.length; i++) {
                const item = values[i];
                const items = item.split("=");
                if (items.length > 1) {
                    result[items[0]] = item.replace(`${items[0]}=`, "");
                }
            }
            return result;
        }

        /**
         * 设置路由变动
         * @param {RouterChangeOptions} options 路由传参
         * @param {"replaceState"|"pushState"} type 变动类型
         */
        function setRoute(options, type) {
            const data = options.data || {};
            const title = options.title || "";
            let path = typeof options === "string" ? options : options.path;
            let params = options.params || {};
            // 判断处理一下路径带参数和
            const pathInfo = getPathInfo(path);
            path = pathInfo.path;
            params = {...params, ...pathInfo.params};
            if (currentPath == path && JSON.stringify(currentPathParams) == JSON.stringify(params)) return console.warn("重复的路由路径和参数，不作任何处理");
            params = formatParams(params);
            history[type](data, title, "#" + path + params);
            routeChange();
        }

        /** 路由变动 */
        function routeChange() {
            currentPath = getHashPath();
            const callback = routeInfo[currentPath];
            if (typeof callback === "function") callback();
        }
        
        // 注意这里外部设置到 window.addEventListener("popstate") 的话会影响到路由跳转，好像修复了
        window.addEventListener("load", routeChange, false);
        window.addEventListener("hashchange", routeChange, false);
        window.addEventListener("popstate", routeChange, false);

        return {
            /** 路由传参对象 */
            get data() {
                return history.state;
            },
            /** 路由参数，url?后面的参数 */
            get params() {
                return currentPathParams;
            },
            /**
             * 路由重定向
             * @param {RouterChangeOptions} options 可以传字符串：`/home`
             */
            replace(options) {
                setRoute(options, "replaceState");
            },
            /**
             * 路由跳转
             * @param {RouterChangeOptions} options 可以传字符串：`/home`
             */
            push(options) {
                setRoute(options, "pushState");
            },
            /**
             * 监听路由变动
             * @param {string} path 路由路径
             * @param {Function} callback 路由回调
             */
            onchange(path, callback = null) {
                routeInfo[path] = callback;
            }
        }
    }

    const router = routerComponent();

    router.onchange("/a", function () {
        setHtml("首页", "首页内容");
    });

    router.onchange("/b", function () {
        setHtml("子页面", "第二个页面内容");
    });

    router.onchange("/c", function () {
        setHtml("最后的页面", "嘿嘿");
    });
    
    const content = document.querySelector(".content");

    function setHtml(title, text) {
        const template = `<ul class="ul">
            <li>${ title }</li>
            <li>${ text }</li>
            <li>${ text }</li>
            <li>${ text }</li>
        </ul>
        <strong>${ new Date().toString() }</strong>`;
        content.innerHTML = template;
    }

    window.addEventListener("load", function () {
        const hash = location.hash.slice(1);
        // console.log(hash);
        // 初始化路由重定向
        if (!hash || hash == "/") {
            router.push({
                path: "/a",
                params: {
                    time: Date.now()
                },
                // data: {
                //     msg: "路由重定向"
                // }
            });
            // console.log(router.data, router.params);
        };
    })

    /**
     * 路由跳转
     * @param {string} path 
     */
    function openRoute(path) {
        router.push(path);
        // router.push({
        //     path,
        //     data: {
        //         time: Date.now()
        //     }
        // });
        console.log(router.data, router.params);
    }
    window.openRoute = openRoute;
})();

