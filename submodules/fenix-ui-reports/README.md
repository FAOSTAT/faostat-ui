
You can use this tool to validate the payload and make an ajax request to the fenix export server side

How to use it
-----------------------------------

Steps to use it:

 1. Create an instance of FenixExport module
 2. Call the ```init``` method on that instance, specifying the plugin that you want to call (for now, it's possible to call only ```tableExport``` and ```metadataExport``` )
 3. Call the  ```exportData(*** *payload*, *URL*, *successCallback** , *errorCallback** )``` method passing as parameters (the parameters with * are facultative)

```javascript
var fenixExport = new FenixExport;
var payload = {
	"input":{
		"config":{
			"uid":#UID_CHOSEN
		}
	}
};
	
var URL = "localhost:8080"		 
fenixExport.init("metadataExport");
     
fenixExport.exportData(payload,URL);
```     


Init function
-----------------------------------

You can pass one of these two parameters:

 - *metadataExport* , for export metadata in a PDF file.
 - *tableExport*, for export table in  an EXCEL file (.xlsx).

Metadata export
-----------------------------------

**Options ( you can mix them )**:

 1. Change payload to set the language: 

```javascript
var payload =  {  
   "input":{  
      "config":{  
         "uid":"#UID_CHOSEN"
      }
   },
   "output":{  
      "config":{  
         "lang":"ES"
      }
   }
};
```

 2. Change name of the file:

```javascript
var payload =  {
	"input":  {
		"config":{
			"uid": #UID_CHOSEN
		} 
	},
	"output": {
		"config": {
			"fileName": #fileName.pdf
		}
	}
};
```

Table export
-----------------------------------
TBD
				 
				 


 
