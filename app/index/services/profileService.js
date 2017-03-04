angular.module('nutrionixApp.index')
    .factory('profileService', function(){
        let profileService = {
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