angular.module('nutrionixApp.index')
    .factory('productsService',['$http', 'appId', 'appKey', function($http,appId,appKey){
        let productsService = {};
        productsService.results = [];
        productsService.getProducts =function (searchString, calMax) {
                 $http.get('https://api.nutritionix.com/v1_1/search/' + searchString + '?results=0%3A20&cal_min=0&cal_max=' + calMax + '&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id%2Cnf_calories%2Cnf_sodium%2Cnf_saturated_fat&appId=' + appId + '&appKey=' + appKey)
                    .then(
                        function (res) {
                            if (!!res.data.hits && res.data.total_hits > 0) {
                                productsService.results= res.data.hits;
                            }
                        }
                        , function (error) {
                            console.log(error);
                        }
                    );

                 return productsService.results;
        };
        return productsService;
    }]);