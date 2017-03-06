/**
 * Service permettant de stocker et récupérer le garde manger
 * ainsi que le profil courant de l'utilisateur
 */
angular.module('nutrionixApp.index')
    .factory('localStorageService',['$localStorage', function($localStorage) {
        return {
            /**
             * Fonction permettant de stocker le garde manger dans le localStorage
             * @param val (le dernier état du garde-manger utilisateur)
             *
             */
            setData: function(val) {
                $localStorage.gardeManger = val;
                return this;
            },
            /**
             * Fonction permettant de récupérer les données stockées dans le localStorage
             * @returns {*} (le dernier état du garde-manger utilisateur)
             */
            getData: function() {
                return $localStorage.gardeManger;
            },

            /**
             * Fonction permettant de stocker le profil de l'utilisateur dans le localStorage
             * @param val (profil de l'utilisateur)
             *
             */
            setProfile: function(val){
                $localStorage.profile = val;
                return this;
            },

            /**
             * Fonction permettant de récupéré le profil dans le localStorage
             * @returns {*} (le dernier profil de l'utilsateur)
             */
            getProfile: function(){
               return $localStorage.profile;
            }
        };
    }]);
