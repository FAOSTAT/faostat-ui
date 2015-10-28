<%
response.reset();
response.setHeader("Content-type","application/csv");
response.setHeader("Content-disposition","inline; filename=export.csv");
String nomvar=(String)request.getParameter("data");
%><%=nomvar%>