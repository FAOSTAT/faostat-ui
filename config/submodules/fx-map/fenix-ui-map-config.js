define(function() {

	return window.FMCONFIG = {

		BASEURL_LANG: 'submodules/fenix-ui-map/dist/i18n/',
		//BASEURL_LANG: 'http://fenixrepo.fao.org/cdn/js/fenix-ui-map/0.1.4/i18n/',

		MAP_SERVICE_SHADED: 'http://fenixservices.fao.org/faostat/geo/mapclassify/join/',
		DEFAULT_WMS_SERVER: 'http://fenixservices.fao.org/faostat/geoserver',
		//DEFAULT_WMS_SERVER: 'http://fenix.fao.org:15100/geoserver/faostat/wms',
		MAP_SERVICE_GFI_JOIN: 'http://fenixservices.fao.org/faostat/geo/mapclassify/request/',
		MAP_SERVICE_GFI_STANDARD: 'http://fenixservices.fao.org/faostat/geo/mapclassify/request/',

		// ZOOM TO BBOX
		ZOOM_TO_BBOX: 'http://fenixservices.fao.org/faostat/geo/spatialquery/db/spatial/bbox/layer/',

		CSS_TO_SLD: 'http://fenixapps2.fao.org/geoservices/CSS2SLD',

		BASEURL_MAPS: 'http://fenixservices.fao.org/faostat/geoserver',
		MAP_SERVICE_ZOOM_TO_BOUNDARY: '/rest/service/bbox',
		MAP_SERVICE_WMS_GET_CAPABILITIES: '/rest/service/request',
		MAP_SERVICE_PROXY: '/rest/service/request'
    };
});
