<%
//response.reset();

String sql=(String)request.getParameter("sql");
String json=(String)request.getParameter("json");
String option=(String)request.getParameter("option");

%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <script type='text/javascript' src='http://fenixapps.fao.org/repository/js/jquery/1.9.1/jquery-1.9.1.min.js'></script>
        <script type='text/javascript' src='http://fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min.js'></script>
        <script type='text/javascript' src='http://fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min.js'></script>
        <!--script src="/faostat-download-js/js/I18N.js"></script-->
        <script type='text/javascript' src='http://fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min.js'></script>
        <script type='text/javascript' src='/faostat-download-js/pivotAgg/countriesAgg.js'></script>
        <script type='text/javascript' src="/faostat-download-js/pivotAgg/configuration.js"> </script>


        <script type='text/javascript' src='/faostat-download-js/js/F3DWLD.js'></script>
        <script type='text/javascript' src='/faostat-download-js/pivotAgg/pivot.js'></script>




        <script>
            FAOSTATNEWOLAP.limitPivotPreview = 10;
            //  FAOSTATNEWOLAP.limitPivotPreview = 50000;
            var opt =<%=option%>;
            FAOSTATNEWOLAP.decimal = opt.decimal;
            FAOSTATNEWOLAP.thousandSeparator = opt.thousandSeparator;
            FAOSTATNEWOLAP.decimalSeparator = opt.decimalSeparator;
            FAOSTATNEWOLAP.showUnits = opt.showUnits;
            F3DWLD.CONFIG.wdsPayload.showCodes = opt.showCodes;
            FAOSTATNEWOLAP.showFlags = opt.showFlags;
            var mesOptionsPivotSend = <%=json%>;
             $.i18n.properties({
                            name: 'I18N',
                            path: F3DWLD.CONFIG.prefix + 'I18N/',
                            mode: 'both',
                            language: mesOptionsPivotSend.lang
                        });
                        
                        
                                       
                        
            function init()
            {
                var test2 = {
                    datasource:F3DWLD.CONFIG.datasource ,
                    thousandSeparator: ',',
                    decimalSeparator: '.',
                    decimalNumbers: '2',
                    json: JSON.stringify(
                            {"limit": null,
                                "query": "<%=sql%>",
                                "frequency": "NONE"}),
                    cssFilename: '',
                    valueIndex: 5};


                $.ajax({
                    type: 'POST',
                    url: F3DWLD.CONFIG.data_url + "/table/json",
                    data: test2,
                    success: function(response_1) {
               
var t=retConfig(mesOptionsPivotSend.domain,mesOptionsPivotSend.lang);
                              
          response2_2=t[0];
          mesOptionsPivot=t[1];
          
            response_1 = response2_2.concat(response_1);
            
             FAOSTATNEWOLAP.firstCall = 0;
            
       //    for(i in mesOptionsPivotSend){mesOptionsPivot[i]=mesOptionsPivotSend[i]}
                        if (mesOptionsPivotSend.rows) {
                            mesOptionsPivot.rows = mesOptionsPivotSend.rows;
                        }
                        if (mesOptionsPivotSend.cols) {
                            mesOptionsPivot.cols = mesOptionsPivotSend.cols;
                        }
                     

               mesOptionsPivot.vals = ["Value"];
            if (FAOSTATNEWOLAP.showUnits)
            {
                mesOptionsPivot.vals.push("Unit");
            }
            if (FAOSTATNEWOLAP.showFlags)
            {
                mesOptionsPivot.vals.push("Flag");
            }        
                    /*  if(opt.fileFormat == "csv")
                     { */
                         
                         /*console.log(mesOptionsPivot);
                         console.log(response_1);*/
                        $("#fx-olap-ui").pivotUI(response_1, mesOptionsPivot, true);
                         FAOSTATNEWOLAP.originalData=response_1;
                    /*}else{
                        FAOSTATNEWOLAP.limitPivotPreview=500;
                        $("#testinline").pivotUICSV(response_1, mesOptionsPivot, true);
                    }*/

                        $("#options_menu_box").css("display", "block");
                        /*var header = $(".pvtAxisLabel");
                        for (var i = 0; i < header.length; i++) {
                            header[i].innerHTML = header[i].innerHTML.replace("_", "");
                        }
*/
                        var newFlag = "";
                        var flagExcel="{\"data\":[";
                        for (var i in FAOSTATNEWOLAP.flags) {
                            if (newFlag != "") {   newFlag += ":";}
                            newFlag += "'" + i + "'";
                        }
                        if (newFlag == "") {  newFlag = "''";     }
                        //$(".pvtAxisLabel")[$(".pvtAxisLabel").length - 1].setAttribute("colspan", 2);
                        $.get("http://faostat3.fao.org/faostat.olap.ws/rest/GetFlags/" + F3DWLD.CONFIG.lang + "/" + newFlag, function(data) {
                            data = data.replace("localhost:8080/", "faostat3.fao.org/");
                          
                            $("#fx-olap-ui").append(data);
                            //console.log(document.getElementById('hor-minimalist-b').getElementsByTagName("tbody")[0].getElementsByTagName("tr").length);
                            var flagtr=document.getElementById('hor-minimalist-b').getElementsByTagName("tbody")[0].getElementsByTagName("tr")
                         for (var ij=0;ij<flagtr.length;ij++)
                             {
                                
                                 var myTr=flagtr[ij];
                                if(ij>0){flagExcel+=",";}
                               
                                flagExcel+="{\"title\":\""+myTr.getElementsByTagName("td")[0].innerHTML+"\",\"label\":\""+myTr.getElementsByTagName("td")[1].innerHTML+"\"}";
                             }
                             flagExcel+="]}"
                            document.getElementById('myFlags').value=flagExcel;

                        }).always(function() {
                          
                            if (opt.fileFormat == "csv"){decolrowspanNEW(); }
                            else {  my_exportNew()}
                            
                     setTimeout(function(){window.close()}, 15000);
                        });


                    }
                });
            }

        </script>
        <title>export Page</title>
    </head>
    <body onload="init();">
    <center><img src="/faostat-download-js/pivotAgg/Preload.gif" /></center>
    <div id="fx-olap-ui" style="display:none"></div>
    <form id="csvDataForm" action="/faostat-download-js/pivotAgg/json.jsp" method="POST">
        <input id="csvData" type="hidden" name="data" value="" />
    </form>
    <form id="xlsDataForm" action="/faostat-gateway/go/ExportPOI" method="POST" >
        <!--textarea id="myJson"  name="myJson" ></textarea-->
        <input id="myJson"  name="myJson" type="hidden" value="" />
        <input id="myFlags"  name="myFlags" type="hidden" value="" />
    </form>
    
    <!--form id="formExcel" method="post" action="http://faostat3.fao.org/faostat.olap.ws/rest/ExcelCreator">

        <input id="excelData" type="hidden" value="" name="data" />
        <input type="hidden" value="xls" name="type" />

    </form-->
    

</body>
</html>
