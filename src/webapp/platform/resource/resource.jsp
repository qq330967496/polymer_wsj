<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
	String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
    request.setAttribute("basePath", basePath);
    request.setAttribute("DEFAULT_TITLE", "运营系统");

    String version = com.kuaisu.platform.ResourceVersion.getVersion();
    request.setAttribute("version", version);
%>
<script>
    if(window.attachEvent){
        window.console={
            log:function(){

            }
        }
    }

    window.basePath = "${basePath}";
    window.version = "${version}";

</script>


<link rel="icon" href="<%=request.getContextPath()%>/favicon.ico" href="<%=request.getContextPath()%>/favicon.ico" type="image/x-icon">
<link rel="shortcut icon" href="<%=request.getContextPath()%>/favicon.ico" href="<%=request.getContextPath()%>/favicon.ico" type="image/x-icon">

<%--bui--%>
<link href="${basePath}/platform/resource/bui/css/dpl.css" rel="stylesheet">
<link href="${basePath}/platform/resource/bui/css/bui.css" rel="stylesheet">
<%--字体图标--%>
<link href="${basePath}/platform/resource/fa430/css/font-awesome.min.css" rel="stylesheet">

<%--uc--%>
<link rel="stylesheet" type="text/css" href="${basePath}/platform/resource/uc/uc.css">
<link rel="stylesheet" type="text/css" href="${basePath}/platform/resource/uc/uc-bui.css">
<link rel="stylesheet" type="text/css" href="${basePath}/platform/resource/uc/uc-tabbar/css/uc-tabbar.css">

<%--jquery--%>
<%--<script type="text/javascript" src="<%=request.getContextPath() %>/platform/resource/jquery/jquery-1.8.1.min.js"></script>--%>
<script type="text/javascript" src="<%=request.getContextPath() %>/platform/resource/jquery/jquery-1.8.1.js"></script>


<script type="text/javascript" src="${basePath}/platform/resource/layer/layer.min.js"></script>

<%--uc组件库--%>
<script type="text/javascript" src="${basePath}/platform/resource/uc/uc-core.js"></script>
<script type="text/javascript" src="${basePath}/platform/resource/uc/uc-tabbar/uc-tabbar.js"></script>
<script type="text/javascript" src="${basePath}/platform/resource/uc/uc-operationbar/uc-operationbar.js"></script>
<script type="text/javascript" src="${basePath}/platform/resource/uc/uc-radios/uc-statusradios.js"></script>
<script type="text/javascript" src="${basePath}/platform/resource/uc/uc-radios/uc-radios.js"></script>
<script type="text/javascript" src="${basePath}/platform/resource/uc/uc-module.js"></script>
<script type="text/javascript" src="${basePath}/platform/resource/uc/uc-helper.js"></script>
<script type="text/javascript" src="${basePath}/platform/resource/uc/uc-enum.js"></script>
<script type="text/javascript" src="${basePath}/platform/resource/uc/uc-dict.js"></script>
<script type="text/javascript" src="${basePath}/platform/resource/uc/uc-biz.js"></script>
<script type="text/javascript" src="${basePath}/platform/resource/uc/uc-autocomplete.js"></script>

<%--uc-bui扩展库--%>
<script type="text/javascript" src="${basePath}/platform/resource/uc/bui-helper/bui-helper.js"></script>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

<%--bui脚本--%>
<script src="<%=request.getContextPath()%>/platform/resource/bui/js/bui-min.js"></script>
<script src="<%=request.getContextPath()%>/platform/resource/bui/extensions/search-min.js"></script>
<script src="<%=request.getContextPath()%>/platform/resource/bui/extensions/treegrid-min.js"></script>
<script src="<%=request.getContextPath()%>/platform/resource/bui/extensions/multiselect-min.js"></script>
<script src="<%=request.getContextPath()%>/platform/resource/bui/extensions/treepicker-min.js"></script>
<script src="<%=request.getContextPath()%>/platform/resource/bui/js/bui-min.js"></script>
<script type="text/javascript" src="${basePath}/platform/resource/jquery/jquery-form.js"></script>
<title>${DEFAULT_TITLE}</title>
