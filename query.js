/**
 * Created by Administrator on 2016/9/28.
 */
window.onload = function query() {
    function loadXML(xmlFile) {
        var xmlFile;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var xml;
        xmlhttp.open("GET", xmlFile, false);
        xmlhttp.send();
        xmlDoc = xmlhttp.responseXML;
        return xmlDoc;
    }

    function queryByAutoId() {
        var autoNum = $("#AutoNum").val();
        var xmlFile = "/webstorm_files/groupPack/xml/cgi-bin/index.xml";
        var xmlDoc = loadXML(xmlFile);
        a = xmlDoc.getElementsByTagName("m_project");
        b = "";
        for (i = 0; i < a.length; i++) {
            if (autoNum == a[i].getAttribute("AutoNum")) {
                b = a[i].getAttribute("pNode");
                break;
            } else {
                if (i == a.length - 1) {
                    alert("您输入的自动识别号不正确，请重新输入！");
                } else {
                    $("#AutoNum").focus();//自动识别号输入不正确时光标重新定位到输入框。
                }
            }
        }
        return b;
    }

    function queryChmCmd(paraId) {
        grandpaNode = xmlDoc.getElementsByTagName(paraId)[0].parentNode.parentNode.nodeName;
        chmCmd = xmlDoc.getElementsByTagName(grandpaNode)[0].getAttribute("ChmCmd");
        return chmCmd;
    }

    function queryAddress(module) {
        switch (module) {
            case "工程": {
                address = xmlDoc.getElementsByTagName("m_project")[0].getAttribute("address");
                break;
            }
            case "MCU参数": {
                address = xmlDoc.getElementsByTagName("m_cpu")[0].getAttribute("address");
                break;
            }
            case "数字模块": {
                address = xmlDoc.getElementsByTagName("m_digital")[0].getAttribute("address");
                break;
            }
            case "小信号模块" || "小信号板" || "小信号板参数": {
                address = xmlDoc.getElementsByTagName("m_rf")[0].getAttribute("address");
                break;
            }
            case "功放板" || "功放板1" || "功放板2" || "功放板3": {
                address = xmlDoc.getElementsByTagName("m_pa")[0].getAttribute("address");
                break;
            }
            case "低噪放板": {
                //address=
                break;
            }
                return address;
        }
        var address = xmlDoc.getElementsByTagName("m_project")[0].getAttribute("address");
    }

    function queryAddressById(paraId) {
        grandNode = xmlDoc.getElementsByTagName(paraId)[0].parentNode.parentNode.parentNode.nodeName;
        address = xmlDoc.getElementsByTagName(grandNode)[0].getAttribute("address");
        return address;
    }

    function queryLength(paraId) {
        length = xmlDoc.getElementsByTagName(paraId)[0].getAttribute("len");
        return length;
    }

    function queryDatatypeNew(paraId) {
        datatype = xmlDoc.getElementsByTagName(paraId)[0].getAttribute("datatype");
        var datatypeNew = dataTypeConvert(datatype);
        return datatypeNew;
    }

    function queryEdittypeNew(paraId) {
        edittype = xmlDoc.getElementsByTagName(paraId)[0].getAttribute("edittype");
        var edittypeNew = editTypeConvert(edittype);
        return edittypeNew;
    }

    function queryRate(paraId) {
        rate = xmlDoc.getElementsByTagName(paraId)[0].getAttribute("rate");
        return rate;
    }

    function queryByparaId(paraId) {

    }

    function groupPackById(paraId) {
        protocolType = "04";//固定位移动协议
        var chmCmd = queryChmCmd(paraId);
        var address = queryAddressById(paraId);
        var length = queryLength(paraId);
        var datatypeNew = queryDatatypeNew(paraId);
        var edittypeNew = queryEdittypeNew(paraId);
        var rate = queryRate(paraId);
        var packArr = new Array(protocolType, chmCmd, address, paraId, length, datatypeNew, edittypeNew, rate);
        document.getElementById("note").innerHTML = packArr.join(",");
    }

    function groupPack(paraId) {
        protocolType = "04";//固定位移动协议
        var chmCmd = queryChmCmd(paraId);
        var address = queryAddress(module);
        var length = queryLength(paraId);
        var datatypeNew = queryDatatypeNew(paraId);
        var edittypeNew = queryEdittypeNew(paraId);
        var rate = queryRate(paraId);
        var packArr = new Array(protocolType, chmCmd, address, paraId, length, datatypeNew, edittypeNew, rate);
        document.getElementById("note").innerHTML = packArr.join(",");
    }

    function dataTypeConvert(datatype) {
        var datatypeNew = "";
        switch (datatype) {
            case "00":
                datatypeNew = "02";
                break;
            case "01":
                datatypeNew = "01";
                break;
            case "02":
                datatypeNew = "03";
                break;
            case "03":
                datatypeNew = "04";
                break;
        }
        return datatypeNew;
    }

    function editTypeConvert(edittype) {
        var edittypeNew = "";
        switch (edittype) {
            case "00":
                edittypeNew = "01";
                break;
            case "01"://转换方式待确定
                edittypeNew = "02";
                break;
            case "02":
                edittypeNew = "03";
                break;
            case "03":
                edittypeNew = "03";
                break;
        }
        return edittypeNew;
    }

    $("#query").click(function () {
        var bb = queryByAutoId();
        var url = "/webstorm_files/groupPack/xml/cgi-bin/" + bb;
        xmlDoc = loadXML(url);
        var module = $("#module").val();
        var moduleQuery = "";
        var paraId = $("#ParaId").val();
        var node = xmlDoc.getElementsByTagName(paraId)[0];
        var hasParaNode = node ? true : false;
        alert("参数是否含有标号节点:" + hasParaNode);
        if (hasParaNode) {
            alert("直接用参数标号查询");
            groupPackById(paraId);
        } else {
            alert("使用全部信息查询");
            var m = xmlDoc.getElementsByTagName("matchineroot")[0].childNodes;
            for (i = 0; i < m.length; i++) {
                //alert("Nodename: " + m[i].nodeName);
            }
            // document.write("Nodename: " + y[i].nodeName);
            // document.write(" (nodetype: " + y[i].nodeType + ")<br />");
            var xx = xmlDoc.getElementsByTagName("matchineroot")[0].firstChild.nodeValue;
            alert(xx);
            for (x in xx) {
                if (module == xx[x].getAttribute("name")) {
                    alert("找到节点" + xx[x].getAttribute("name"));
                    break;
                } else {
                    if (x == xx.length - 1) {
                        alert("不存在节点" + module);
                    } else {
                        alert("继续查找")
                    }
                }
            }
            var nodeChild = xmlDoc.getElementsByTagName("matchineroot")[0].childNodes[0].nodeName();
            alert(node);
            moduleQuery = xmlDoc.getElementsByTagName(nodeChild)[0].getAttribute("pNode");
            url1 = "/webstorm_files/groupPack/xml/cgi-bin/" + moduleQuery;
            xmlDoc = loadXML(url1);
            var paraId = $("#ParaId").val();
            groupPack(paraId);
        }
    })
}
