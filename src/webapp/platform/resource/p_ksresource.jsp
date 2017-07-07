<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
    String basePath = request.getContextPath();
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

    window.basePath = window.webRoot = "${basePath}";
    window.serverName = '<%=request.getContextPath()%>';
    window.webRoot = window.rootPath = '<%=request.getContextPath()%>';

    window.version = "${version}";
</script>
<%--less.js 需要在所有less文件引用之前引入--%>

<link rel="icon" href="<%=request.getContextPath()%>/favicon.ico" href="<%=request.getContextPath()%>/favicon.ico" type="image/x-icon">
<link rel="shortcut icon" href="<%=request.getContextPath()%>/favicon.ico" href="<%=request.getContextPath()%>/favicon.ico" type="image/x-icon">

<title>${DEFAULT_TITLE}</title>
