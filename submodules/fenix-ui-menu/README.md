FENIX menu creator
==================

FENIX menu component, based on Twitter Bootstrap.

#Configuration
It is possible to configure the component passing the URL of the configuration or passing the configuration itself.

##Passing the URL

 ```
 require([
        'js/fenix-menu'
    ], function (Menu) {

        var menu = new Menu({
            url: 'config/my_menu_configuration.json'
        });

        ...

    });
  ```

##Passing the configuration

```
require([
       'js/fenix-menu'
   ], function (Menu) {

       var menu = new Menu({
           config: {... see below ... }
       });

       ...

   });
 ```

#Initialization params

+ active: the ID of the item to activate. To use this param the item has to have an id defined within 'attrs' item param (see below Configuration structure).
+ breadcrumb : configuration for breadcrumb
    + active : boolean, activate or deactivate the breadcrumb rendering
    + container : where the breadcrumb has to be displayed
    + showHome: if breadcrumb is shown, always show 'Home' as first item
+ callback: JS function invoked after the menu rendering.
+ className: CSS class of the menu.
+ config: explicit configuration.
+ container: where the menu has to be displayed. It is optional and default is 'body'. Use it only with type='static-top'.
+ css: URL of the style sheet.
+ eventPrefix: On click on any menu item an AmplifyJS event is risen. The event topic is formed by this parameter concatenated to the item id if present, or in substitution the suffix 'item'. The item is sent as event payload.
+ footer : configuration for footer menu
    + active : boolean, activate or deactivate the footer menu rendering
    + container : where the footer menu has to be displayed
+ importCss: set to 'true' to import the Css style sheet specified in the 'css' params.
+ lang: language of the labels to display.
+ url: URL of the configuration file.

#Configuration structure

+ items: the menu items array
+ type: menu type. Possible values are: 'fixed-top', 'fixed-bottom', 'static-top'. Default: 'static-top'.
+ languages: languages to display in the right side of the menu.
+ brand: object that have two optionals attributes. 'target': href of the link on the brand. 'url': URL of the brand background image.
+ rightItems: the menu items array to display in the right side

 Every item accepts the following params:
 + attrs: hash map of attributes of the final HTML element.
 + breadcrumbLabel: multilingual labels of the breadcrumb item. If it is not specified and breadcrumb is displayed 'label' will be displayed
 + target: in case the item type is 'item' this is the href value of the 'a' HTML element.
 + label: multilingual labels of the item.
 + children: in case the item type is 'dropdown', it is used to defined the dropdown children items.

** Configuration Example: **

```
{
  "items": [
    {
      "attrs": {
        "id": "home"
      },
      "target": "index.html",
      "label": {
        "EN": "Home",
        "FR": "PI"
      }
    },
    {
      "type": "dropdown",
      "attrs": {
        "id": "dropdown"
      },
      "children": [
        {
          "type": "dropdown",
          "attrs": {
            "id": "sub-dropdown"
          },
          "children": [
            {
              "type": "item",
              "attrs": {
                "id": "item1"
              },
              "target": "item.html",
              "label": {
                "EN": "Item 1",
                "FR": "PI"
              }
            },
            {
              "type": "item",
              "attrs": {
                "id": "item2"
              },
              "target": "item.html",
              "label": {
                "EN": "Item 2",
                "FR": "PI"
              }
            },
            {
              "type":"divider"
            },
            {
              "type": "item",
              "attrs": {
                "id": "item 3"
              },
              "target": "item.html",
              "label": {
                "EN": "Item 3",
                "FR": "PI"
              }
            }
          ],
          "label": {
            "EN": "Level 2",
            "FR": "PI"
          }
        }
      ],
      "label": {
        "EN": "Level 1",
        "FR": "PI"
      }
    },
     {
          "attrs": {
            "id": "login"
          },
          "label": {
            "EN": "Login",
            "FR": ""
          }
        }
  ],

  "type" : "fixed-top",

  "languages": [
    {
      "lang": "EN",
      "label": "En"
    },
    {
      "lang": "FR",
      "label": "Fr"
    }
  ]
}
```