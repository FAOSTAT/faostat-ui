/*global define*/
define(function ( ) {

    'use strict';

    return {

        EXAMPLE_QUERY : "select  'Indicator' as Indicator, 'Indicator_label' as Indicator_label, 'Source'  as Source,'Source_label' as Source_label,'Country' as Country,'Country_label' as Country_label,'Year' as Year,'Year_label' as Year_label,'Qualifier' as Qualifier,'Qualifier_label' as Qualifier_label,'Value' as Value,'Unit' as Unit,'Flag' as Flag union all select Indicator,Indicator_label,Source,Source_label,Country,Country_label,Year,Year_label,Qualifier,Qualifier_label,Value,Unit,Flag from masterDataSelection( string_to_array('{indicator}',','), string_to_array('{country}',','), string_to_array('{year}',','), string_to_array('{qualifier}',',') )"

    };
});