define(['wds-client'], function (WDSClient) {

    var w = new WDSClient({
        datasource: 'faostat'
    });

    describe("Module WDSClient", function () {

        describe("should be configurable by the user", function () {
            it("with 'faostat' as custom datasource", function () {
                expect(w.opts.datasource).toEqual("faostat");
            });
            it("having 'http://fenixapps2.fao.org/wds_5.1/rest/crud' as default serviceUrl", function () {
                expect(w.opts.serviceUrl).toEqual("http://fenixapps2.fao.org/wds_5.1/rest/crud");
            })
        });

        describe("should be able to RETRIEVE data", function () {
            it("from SQL databases", function () {
                spyOn($, "ajax").and.callFake(function(e) {
                    e.success({});
                });
                var success_spy = jasmine.createSpy();
                var error_spy = jasmine.createSpy();
                w.retrieve({
                    payload: {
                        query: 'SELECT AreaCode, AreaNameE FROM Area '
                    },
                    success: success_spy,
                    error: error_spy
                });
                expect(success_spy).toHaveBeenCalled();
                expect(error_spy).not.toHaveBeenCalled();
            });
        });

    });

});