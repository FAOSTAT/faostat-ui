define({
    "rows": [
        ["Element","Element Code"],
        ["Country", "Country Code"],
        ["Item", "Item Code"]
    ],
    "cols": ["Year"],
    "vals": [
        "Value",
        "Flag","Unit"
    ],
    "hiddenAttributes": [
        "NoRecords","RecordOrder","Domain Code","Domain","Year Code","Unit","Value","Flag","Flag Description","Var1Order","Var2Order","Var3Order","Var4Order"
    ],
    linkedAttributes:[["Element","Element Code"],["Country","Country Code"],["Item","Item Code"]],

    "InstanceRenderers": [
        {label: "Grid", func: "Table"}
    ],
    "InstanceAggregators": [
        {label: "SOMME", func: "Sum2"},
        {label: "Sum", func: "Sum"},
        {label: "Average", func: "Average"}
    ],
    "showAgg": false,
    "showRender": false,
    "showUnit":true,
    "showCode":true,
    "showFlags":true
});		
//"NoRecords","RecordOrder","Domain Code","Domain","Country Code","Country","Element Code","Element","Item Code","Item","Year Code","Year","Unit","Value","Flag","Flag Description","Var1Order","Var2Order","Var3Order","Var4Order"