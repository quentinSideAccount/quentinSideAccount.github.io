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
    .controller('IndexCtrl', ['$scope','$http', 'appId', 'appKey','profileService','productsService','$q' ,function($scope, $http,appId,appKey,profileService,productsService,$q) {
        $scope.searchString = "";
        $scope.searchResults = {};
        $scope.totalCaloriesForEverything = 0;
        $scope.totalSelForEverything = 0;
        $scope.totalSaturedFatForEverything = 0;
        $scope.gardeManger = [];
        $scope.calMax = 50000;
        $scope.profiles = null;
        $scope.calMaxProfile = null;
        $scope.calRemaining = null;

        /**
         * Fonction de récupération des produits
         */

        $scope.getProducts = function(){
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
         * @param item
         */
        $scope.addToGardeManger = function(item){
          console.log(item);
          item.quantite = 1;
          $scope.getKcalValueForItem(item);
          $scope.gardeManger.push(item);
          $scope.getTotalKcal();
          $scope.searchString = "";

        };

        /**
         * Fonction d'ajout d'une quantité
         * Et appel à des fonctions pour tenir à jour les valeurs
         * @param item
         */

        $scope.addQuantite = function(item){
          item.quantite++;
          $scope.getKcalValueForItem(item);
          $scope.getTotalKcal();

        };

        /**
         * Fonction du retrait d'une quantité
         * Et appel à des fonctions pour tenir à jour les valeurs
         * @param item
         */

        $scope.removeQuantite = function(item){
            item.quantite--;
            $scope.getKcalValueForItem(item);
            $scope.getTotalKcal();
        };


        /**
         * Fonction pour retirer un produit du garde manger
         * et appel de la fonction pour tenir à jour les valeurs
         * @param i
         */
        $scope.removeItem = function(i){
          $scope.gardeManger.splice(i,1);
          $scope.getTotalKcal();
        };


        /**
         * Calcule le nombre de calories, sel et graisses saturées pour un item
         * @param item
         */
        $scope.getKcalValueForItem = function(item){
            item.totalCalories = item.quantite * item.fields.nf_calories;
            item.totalSel = (typeof(item.fields.nf_sodium) === undefined ) ? null : item.quantite * item.fields.nf_sodium/1000;
            item.totalSaturedFat = (typeof(item.fields.nf_saturated_fat) === undefined ) ? null : item.quantite * item.fields.nf_saturated_fat;

        };

        /**
         * Calcule le nombre de calories, sel et graisses saturées pour tout le garde manger
         * @param item
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
            $scope.calRemaining = $scope.calMaxProfile - $scope.totalCaloriesForEverything;
        };


        /**
         * Fonction mettant à jour le profile choisi par l'utilisateur
         */
        $scope.update = function(){
            $scope.calRemaining = $scope.calMaxProfile - $scope.totalCaloriesForEverything;
        };

        $scope.getProfiles();
    }]);