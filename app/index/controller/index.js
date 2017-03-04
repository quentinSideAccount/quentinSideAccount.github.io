'use strict';

angular.module('nutrionixApp.index', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'index/index.html',
            controller: 'IndexCtrl'
        });
    }])
    .controller('IndexCtrl', ['$scope','$http', 'appId', 'appKey','profileService','productsService' ,function($scope, $http,appId,appKey,profileService,productsService) {
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

        $scope.getProducts = function(){
            $scope.searchResults = productsService.getProducts($scope.searchString,$scope.calMax);
        };


        $scope.getProfiles = function(){
          $scope.profiles = profileService.getProfiles();
        };

        $scope.addToGardeManger = function(item){
          item.quantite = 1;
          $scope.getKcalValueForItem(item);
          $scope.gardeManger.push(item);
          $scope.getTotalKcal();
          $scope.searchString = "";

        };

        $scope.addQuantite = function(item){
          item.quantite++;
          $scope.getKcalValueForItem(item);
          $scope.getTotalKcal();

        };

        $scope.removeQuantite = function(item){
            item.quantite--;
            $scope.getKcalValueForItem(item);
            $scope.getTotalKcal();
        };

        $scope.removeItem = function(i){
          $scope.gardeManger.splice(i,1);
          $scope.getTotalKcal();
        };

        $scope.getKcalValueForItem = function(item){
            item.totalCalories = item.quantite * item.fields.nf_calories;
            item.totalSel = (typeof(item.fields.nf_sodium) === undefined ) ? null : item.quantite * item.fields.nf_sodium;
            item.totalSaturedFat = (typeof(item.fields.nf_saturated_fat) === undefined ) ? null : item.quantite * item.fields.nf_saturated_fat;

        };

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


        $scope.update = function(){
            $scope.calRemaining = $scope.calMaxProfile - $scope.totalCaloriesForEverything;
        };

        $scope.getProfiles();
    }]);