'use strict';

/**
 * Controller pour la page index
 */

angular.module('nutrionixApp.index', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/index/index.html',
            controller: 'IndexCtrl'
        });
    }])
    .controller('IndexCtrl', ['$scope','$http', 'appId', 'appKey','profileService','productsService','localStorageService' ,function($scope, $http,appId,appKey,profileService,productsService,localStorageService) {
        $scope.searchString = "";
        $scope.totalCaloriesForEverything = 0;
        $scope.totalSelForEverything = 0;
        $scope.totalSaturedFatForEverything = 0;
        $scope.gardeManger = [];
        $scope.calMax = 50000;
        $scope.profiles = null;
        $scope.choiceProfile = null;
        $scope.calRemaining = null;

        /**
         * Fonction de récupération des produits stockés en localStorage
         * et initialisation des variables de contenant les données du garde manger
         */

        $scope.init = function(){
          $scope.gardeManger = localStorageService.getData();
          $scope.selectedProfile = localStorageService.getProfile();
          if($scope.gardeManger != null) {
              $scope.getTotalKcal();
          }else{
              $scope.gardeManger = [];
          }
          if($scope.selectedProfile != null){
              $scope.choiceProfile = $scope.selectedProfile.name;
          }
        };

        /**
         * Fonction faisant appel à l'API Nutrionix et retournant un tableau de résultats
         * @returns {Promise.<TResult>|*}
         */
        $scope.getProducts = function(){
           $scope.calMax = isNaN(parseInt($scope.calMax,10)) ?  50000 : $scope.calMax;
           return productsService.getProducts($scope.searchString,$scope.calMax)
                .then(
                    function (res) {
                        return res.data.hits;
                    }
                );

        };


        /**
         * Fonction de récupération des profiles
         */

        $scope.getProfiles = function(){
          $scope.profiles = profileService.getProfiles();
        };

        /**
         * Ajout d'un produit au garde manger
         * Et initialisation de sa quantité
         * @param item (produit)
         */
        $scope.addToGardeManger = function(item){
          item.quantite = 1;
          $scope.getKcalValueForItem(item);
          $scope.gardeManger.push(item);
          localStorageService.setData($scope.gardeManger);
          $scope.getTotalKcal();
          $scope.searchString = "";

        };

        /**
         * Fonction d'ajout d'une quantité
         * Et appel à des fonctions pour tenir à jour les valeurs
         * @param item (produit)
         */

        $scope.addQuantite = function(item){
          item.quantite++;
          $scope.getKcalValueForItem(item);
          $scope.getTotalKcal();
          localStorageService.setData($scope.gardeManger);

        };

        /**
         * Fonction du retrait d'une quantité
         * Et appel à des fonctions pour tenir à jour les valeurs
         * @param item (produit)
         */

        $scope.removeQuantite = function(item){
            item.quantite--;
            $scope.getKcalValueForItem(item);
            $scope.getTotalKcal();
            localStorageService.setData($scope.gardeManger);

        };


        /**
         * Fonction pour retirer un produit du garde manger
         * et appel de la fonction pour tenir à jour les valeurs
         * @param item (produit)
         */
        $scope.removeItem = function(item){
          $scope.gardeManger.splice(item,1);
          $scope.getTotalKcal();
          localStorageService.setData($scope.gardeManger);

        };


        /**
         * Calcule le nombre de calories, sel et graisses saturées pour un item
         * @param item (produit)
         */
        $scope.getKcalValueForItem = function(item){
            //Math.round(value * 100) / 100

            item.totalCalories = Math.round((item.quantite * item.fields.nf_calories) *100)/100;
            item.totalSel = (typeof(item.fields.nf_sodium) === undefined ) ? null : Math.round((item.quantite * item.fields.nf_sodium/1000)*100)/100;
            item.totalSaturedFat = (typeof(item.fields.nf_saturated_fat) === undefined ) ? null : Math.round((item.quantite * item.fields.nf_saturated_fat)*100)/100;

        };

        /**
         * Calcule le nombre de calories, sel et graisses saturées pour tout le garde manger
         */
        $scope.getTotalKcal = function(){
            $scope.calRemaining = 0;
            $scope.totalCaloriesForEverything = 0;
            $scope.totalSelForEverything = 0;
            $scope.totalSaturedFatForEverything = 0;
            angular.forEach($scope.gardeManger,function(obj){
                $scope.totalCaloriesForEverything += obj.totalCalories;
                if(obj.totalSel != null) $scope.totalSelForEverything += obj.totalSel;
                if(obj.totalSaturedFat != null) $scope.totalSaturedFatForEverything += obj.totalSaturedFat;
            });
            $scope.totalCaloriesForEverything = Math.round($scope.totalCaloriesForEverything*100)/100;
            $scope.totalSelForEverything = Math.round($scope.totalSelForEverything*100)/100;
            $scope.totalSaturedFatForEverything = Math.round($scope.totalSaturedFatForEverything*100)/100;
            if($scope.selectedProfile != undefined) $scope.calRemaining = $scope.selectedProfile.calMax - $scope.totalCaloriesForEverything;
        };


        /**
         * Fonction mettant à jour le profile choisi par l'utilisateur
         */
        $scope.update = function(){
            $scope.selectedProfile  = $scope.profiles.filter(function (obj) {
                return obj.name == $scope.choiceProfile;
            });
            $scope.selectedProfile = $scope.selectedProfile[0];
            localStorageService.setProfile($scope.selectedProfile);
            $scope.calRemaining = $scope.selectedProfile.calMax - $scope.totalCaloriesForEverything;
        };

        $scope.getProfiles();
        $scope.init();
    }]);