window.__setupCom = function (root) {
        var root = root || document.body;
        var doms = root.querySelectorAll("[data-com]");
        var collections = [];
        var coms = [];
        for (var i = 0; i < doms.length; i++) {
            var comNames = doms[i].attributes["data-com"].value.split('|');
            for (var j = 0; j < comNames.length; j++) {
                var comName = ("com/" + comNames[j] + ".js");
                //防止二次执行
                doms[i].coms = doms[i].coms || [];
                if (doms[i].coms && doms[i].coms[comName]) {
                    continue;
                }
                doms[i].coms[comName] = "loading";
                //找到模块构造函数与打包加载的对应关系
                var index = coms.indexOf(comName);
                if (index == -1) {
                    index = coms.length;
                    coms.push(comName);
                }
                collections.push({name: name, dom: doms[i], index: index});
            }
        }
        //加载所有所需模块，并且初始化这些模块
        require(coms, function () {
            for (var i = 0; i < collections.length; i++) {
                collections[i].dom.coms[collections[i].name] = new arguments[collections[i].index](collections[i].dom);
            }
        });
    }
    if ("require" in window) {
        __setupCom(document)
    }
