/**
 * Service permettant de récupérer les différents profils utilisateurs
 * Basés sur les données fournies dans l'énoncés
 * Récupérés à l'aide d'un fichier JSON
 *
 */

angular.module('nutrionixApp.index')
    .factory('profileService', function(){
        let profileService = {

            /**
             * Méthode permettant de récupérer les profils définis dans le fichier profiles.json de manière synchrone
             * @returns {Array}
             */
            getProfiles: function() {
                let profiles = [];
                $.ajax({
                    url: "app/index/services/json/profiles.json",
                    async: false,
                    success: function (response) {
                        profiles = response.profiles;
                    }
                });
                return profiles;
            }
        };
        return profileService;
    });