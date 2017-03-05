/**
 * Service permettant de stocker et récupérer le garde manger
 */
angular.module('nutrionixApp.index')
    .factory('localStorageService',['$localStorage', function($localStorage) {
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
            },

            /**
             * Fonction permettant de stocker le profil de l'utilisateur dans le localStorage
             * @param val
             * @returns {gardeMangerService}
             */
            setProfile: function(val){
                $localStorage.profile = val;
                return this;
            },

            /**
             * Fonction permettant de récupéré le profil dans le localStorage
             * @returns {*}
             */
            getProfile: function(){
               return $localStorage.profile;
            }
        };
    }]);
