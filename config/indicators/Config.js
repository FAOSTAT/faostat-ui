    /*global define*/
define([
],function () {

    'use strict';

    return {

        data: [

            {
                topic: "Demography",
                description: "",
                indicators: [
                    {
                        text: "Population",
                        description: "",
                        filter: {
                            domain_codes: ["OA"],
                            List1Codes: ['_1'],
                            List2Codes: [511],
                            List3Codes: [3010],
                            List4Codes: ['_1']
                        }
                    },
                    {
                        text: "Rural",
                        description: "",
                        filter: {
                            domain_codes: ["OA"],
                            List1Codes: ['_1'],
                            List2Codes: [551],
                            List3Codes: [3010],
                            List4Codes: ['_1']
                        }
                    },
                    {
                        text: "Urban",
                        description: "",
                        filter: {
                            domain_codes: ["OA"],
                            List1Codes: ['_1'],
                            List2Codes: [561],
                            List3Codes: [3010],
                            List4Codes: ['_1']
                        }
                    }
                ]
            }
        ]
    };
});
