/**
 * Service permettant de réaliser des appels à l'API Nutritionix
 */

angular.module('nutrionixApp.index')
    .factory('productsService',['$http', 'appId', 'appKey' ,function($http,appId,appKey){
        let productsService = {};
        productsService.results = [];
        /**
         *
         * @param searchString (String de recherche)
         * @param calMax (Calories maximum)
         * @returns {*|Array}
         */
        productsService.getProducts =function (searchString, calMax) {
              return $http.get('https://api.nutritionix.com/v1_1/search/' + searchString + '?results=0%3A20&cal_min=0&cal_max=' + calMax + '&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id%2Cnf_calories%2Cnf_sodium%2Cnf_saturated_fat&appId=' + appId + '&appKey=' + appKey)
        };
        return productsService;
    }]);