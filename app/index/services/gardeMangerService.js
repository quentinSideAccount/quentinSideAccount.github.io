/**
 * Service permettant de stocker et récupérer le garde manger
 */
angular.module('nutrionixApp.index')
    .factory('gardeMangerService',['$localStorage', function($localStorage) {
        return {
            /**
             * Fonction permettant de stocker le garde manger dans le localStorage
             * @param val
             * @returns {gardeMangerService}
             */
            setData: function(val) {
                $localStorage.gardeManger = val;
                return this;
            },
            /**
             * Fonction permettant de récupérer les données stockées dans le localStorage
             * @returns {*}
             */
            getData: function() {
                return $localStorage.gardeManger;
            }
        };
    }]);
