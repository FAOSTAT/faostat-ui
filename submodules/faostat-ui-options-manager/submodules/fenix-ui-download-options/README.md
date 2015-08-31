FENIX UI Download Options
=========================

Generic component that presents the user with a modal window to collect preferences about the output format (e.g. file format, number of decimal places, etc.). By default the window allows to collect:

* Decimal separator
* Thousand separator
* Decimal places
* Show options
   * Codes
   * Flags
   * Units
   * Null Values

By default the user is presented with the following output format options:

* PDF
* CSV
* Excel
   

Example
-------

```javascript
/* Initiate download options. */
download_options.init({
  lang: 'E',
  prefix: prefix + 'download_',
  placeholder_id: 'download_options_placeholder'
});

/* Render the button that opens the modal window. */
download_options.show_as_modal_window();
```

Button Listeners
----------------

Each button publish an AmplifyJS event that collects and stores in an object the user selection. This object can be accessed by implementing the ```onDownload``` function of the component. This function accepts as arguments a callback and an object containing the data to be downloaded/exported. Such callback is invoked everytime the user hits one of the buttons at the bottom of the window.

```javascript
/* Data to be downloaded/exported. */
var my_data = [[1990, 'Potato', 215.00, 't']]

/* Callback function. */
var callback = function(user_selection, data) {
  switch (user_selection.output_format) {
    case 'csv':
      /* do something with my_data */
      break;
  }
};

/* Bind the callback to the window's buttons. */
download_options.onDownload(my_data, callback);
```

The ```user_selection``` object is structured as follows:

```javascript
{
  codes: true,
  decimal_numbers: '2',
  decimal_separator: ',',
  flags: true,
  null_values: false,
  output_format: 'xls',
  thousand_separator: ',',
  units: false
}
```

Available Configuration Options
-----------------

| Option Name | Description | Default | Allowed Values |Example |
|-------------|-------------|---------|----------------|--------|
| lang        | Language of the UI labels. | E | E<br>F<br>S|lang: 'E'|
| placeholder_id | ID where the component will be rendered. | placeholder_id | n.a. | placeholder_id: 'download_options_placeholder'| 
| prefix | Prefix to be added to all the ID's to avoid conflicts in the same page. | fenix_ | n.a. | prefix: 'download_' |
| excel_button | Flag to determine whether to display the Excel button or not. | true | true<br>false | excel_button: false |
| pdf_button | Flag to determine whether to display the PDF button or not. | true | true<br>false | pdf_button: false |
| ok_button | Flag to determine whether to display the OK button or not. | false | true<br>false | ok_button: false |
| csv_button | Flag to determine whether to display the CSV button or not. | true | true<br>false | csv_button: false |
| decimal_separators | Flag to determine whether to display the decimal separator settings button or not. | true |  true<br>false | decimal_separators: false |
| thousand_separators | Flag to determine whether to display the thousand separator settings button or not. | true |  true<br>false | thousand_separators: false |
| decimal_numbers | Flag to determine whether to display the decimal numbers settings button or not. | true |  true<br>false | decimal_numbers: false |
| show_options | Flag to determine whether to display the options (_e.g. codes, f;ags, etc._) settings button or not. | true |  true<br>false | show_options: false |
| pdf_button_id | String to be combined with the prefix to create the ID of the PDF button. | pdf_button_id | n.a. | pdf_button_id: 'my_id' |
| csv_button_id | String to be combined with the prefix to create the ID of the CSV button. | csv_button_id | n.a. | csv_button_id: 'my_id' |
| excel_button_id | String to be combined with the prefix to create the ID of the Excel button. | excel_button_id | n.a. | excel_button_id: 'my_id' |
| decimal_separator_id | String to be combined with the prefix to create the ID of the decimal separator field. | decimal_separator_id | n.a. | decimal_separator_id: 'my_id' |
| thousand_separator_id | String to be combined with the prefix to create the ID of the thousand separator field. | thousand_separator_id | n.a. | thousand_separator_id: 'my_id' |
| decimal_numbers_id | String to be combined with the prefix to create the ID of the decimal numbers field. | decimal_numbers_id | n.a. | decimal_numbers_id: 'my_id' |
| flags_id | String to be combined with the prefix to create the ID of the flags field. | flags_id | n.a. | flags_id: 'my_id' |
| codes_id | String to be combined with the prefix to create the ID of the codes field. | codes_id | n.a. | codes_id: 'my_id' |
| units_id | String to be combined with the prefix to create the ID of the codes field. | units_id | n.a. | units_id: 'my_id' |
| null_values_id | String to be combined with the prefix to create the ID of the null values field. | null_values_id | n.a. | null_values_id: 'my_id' |
| button_label | Label to be displayed on the button that opens the modal window. | Download as... | n.a. | button_label: 'Preview' |
| header_label | Label to be displayed on the header of the modal window. | Download Options | n.a. | button_label: 'Preview Options' |
