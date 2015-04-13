# FAOSTAT4
New architecture for FAOSTAT dissemination system.

# Structure
```
faostat4-ui
|─── config
|   |─── faostat.json
|─── css
|   |─── ...
|─── html
|   |─── templates.html
|─── images
|   |─── ...
|─── js
|   |─── application.js
|   |─── main.js
|─── node_modules
|   |─── ...
|─── submodules
|   |─── faostat-ui-analysis
|   |─── faostat-ui-browse
|   |─── faostat-ui-commons
|   |─── faostat-ui-download
|   |   |─── css
|   |   |─── html
|   |   |─── js
|   |   |─── nls
|   |   |─── submodules
|   |       |─── faostat-ui-bulk-downloads
|   |       |─── faostat-ui-download-selectors-manager
|   |       |   |─── html
|   |       |   |─── js
|   |       |   |─── nls
|   |       |   |─── submodules
|   |       |       |─── faostat-ui-download-selector
|   |       |           |─── css
|   |       |           |─── html
|   |       |           |─── js
|   |       |           |─── nls
|   |       |─── fenix-ui-download-options
|   |       |─── fenix-ui-metadata-viewer
|   |─── faostat-ui-home
|   |─── faostat-ui-menu
|   |─── faostat-ui-tree
|   |─── fenix-ui-common
|─── index.html
```

# Installation
Run ```npm install``` and ```grunt``` to generate the ```config/faostat.json``` configuration file.

# Developed with 
![IntelliJ](http://www.jetbrains.com/idea/docs/logo_intellij_idea.png)
