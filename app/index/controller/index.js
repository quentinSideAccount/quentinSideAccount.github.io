'use strict';

/**
 * Controller pour la page index
 * Gére les actions sur le profil, le garde-manger ainsi que les produits de l'utilisateur
 */

angular.module('nutrionixApp.index', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/index/index.html',
            controller: 'IndexCtrl'
        });
    }])
    .controller('IndexCtrl', ['$scope','$http', 'appId', 'appKey','profileService','productsService','localStorageService' ,function($scope, $http,appId,appKey,profileService,productsService,localStorageService) {

        /**
         * Chaine utilisée pour la recherche de produit
         */
        $scope.searchString = "";

        /**
         * Indicateurs globaux utilisés pour le garde-manger
         */
        $scope.totalCaloriesForEverything = 0;
        $scope.totalSelForEverything = 0;
        $scope.totalSaturedFatForEverything = 0;

        /**
         * Initialisation du garde-manger
         */
        $scope.gardeManger = [];

        /**
         * Initialisation du nombre de calories maximum utilisé pour la recherche
         */
        $scope.calMax = 50000;

        /**
         * Variable contenant les profils récupérés par le ProfileService
         */
        $scope.profiles = null;

        /**
         * Valeur du champ select de l'interface utilisateur utilisé pour affecter le profil plus tard
         */
        $scope.choiceProfile = null;

        /**
         * Valeur indiquant le nombre de calories restantes en fonction du profil choisi
         */
        $scope.calRemaining = null;

        /**
         * Fonction de récupération des produits et du profil stockés en localStorage
         * et initialisation des variables de contenant les données du garde manger
         * Cette fonction récupére aussi les différents profils pour qu'ils soient injectés dans la vue
         */

        $scope.init = function(){
          $scope.getProfiles();
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
         * Fonction faisant appel à l'API Nutrionix à l'aide du productsService et retournant un tableau de résultats
         * Elle permet aussi de vérifier si la saisie par l'utilisateur du champ des calories max est véritablement un nombre ou non
         * Sinon on set 50000 le nombre par défaut
         *
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
         * Et ajout et l'initialisation de l'attribut quantité de chaque produit
         * Appel aux fonctions de : - calcul des indicateurs du produit
         *                          - Actualisation de l'état du garde-manger dans le localStorage
         *                          - Calcul des indicateurs globaux du garde-manger
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
         * Fonction d'ajout d'une unité de quantité au produit passé en paramètre
         * Appel aux fonctions de : - calcul des indicateurs du produit
         *                          - Actualisation de l'état du garde-manger dans le localStorage
         *                          - Calcul des indicateurs globaux du garde-manger
         * @param item (produit)
         */

        $scope.addQuantite = function(item){
          item.quantite++;
          $scope.getKcalValueForItem(item);
          $scope.getTotalKcal();
          localStorageService.setData($scope.gardeManger);

        };

        /**
         * Fonction du retrait d'une unité de quantité au produit passé en paramètre
         * Appel aux fonctions de : - calcul des indicateurs du produit
         *                          - Actualisation de l'état du garde-manger dans le localStorage
         *                          - Calcul des indicateurs globaux du garde-manger
         * @param item (produit)
         */

        $scope.removeQuantite = function(item){
            item.quantite--;
            $scope.getKcalValueForItem(item);
            $scope.getTotalKcal();
            localStorageService.setData($scope.gardeManger);

        };


        /**
         * Fonction pour retirer le produit passé en paramètre au garde manger
         * Appel aux fonctions de : - Actualisation de l'état du garde-manger dans le localStorage
         *                          - Calcul des indicateurs globaux du garde-manger
         * @param item (produit)
         */
        $scope.removeItem = function(item){
          $scope.gardeManger.splice(item,1);
          $scope.getTotalKcal();
          localStorageService.setData($scope.gardeManger);

        };


        /**
         * Calcule le nombre de calories, sel et graisses saturées pour un produit passé en paramètre
         *
         * Ajoute aussi les attributs totalCalories, totalSel et totalSaturedFat s'il ne sont pas présent pour l'item
         * et permte de connaître la quantité de l'élément indiqué par la variable
         * en fonction de la quantité du produit dans le garde-manger
         *
         * Comme tous les produits n'ont pas de sel ou de graisses saturées, les valeurs totalSel et totalSaturedFat sont placées à zero
         *
         * Le Math.round(valeur * 100)/100 permet de limiter valeur à seulement 2 chiffres
         * après la virgule pour que soit plus propre à lire pour l'utiisateur
         *
         * @param item (produit)
         */
        $scope.getKcalValueForItem = function(item){

            item.totalCalories = Math.round((item.quantite * item.fields.nf_calories) *100)/100;
            item.totalSel = (typeof(item.fields.nf_sodium) === undefined ) ? null : Math.round((item.quantite * item.fields.nf_sodium/1000)*100)/100;
            item.totalSaturedFat = (typeof(item.fields.nf_saturated_fat) === undefined ) ? null : Math.round((item.quantite * item.fields.nf_saturated_fat)*100)/100;

        };

        /**
         * Calcule le nombre de calories, sel et graisses saturées pour tout le garde manger
         *
         * La fonction réinitialise chaque indicateur du garde-manger puis itère sur chaque produit pour recalculer
         * les nouvelles valeurs
         *
         * Elle met aussi à jour le nombre de calories restantes par rapport au profil défini
         *
         * Le Math.round(valeur * 100)/100 permet de limiter valeur à seulement 2 chiffres
         * après la virgule pour que soit plus propre à lire pour l'utiisateur
         *
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
         * Fonction mettant à jour le profile choisi par l'utilisateur dans la variable $scope.selectedProfile
         * Elle met à jour le profil dans le localStorage
         * et elle met aussi à jour le nombre de calories restantes par rapport au profil choisi
         */
        $scope.update = function(){
            $scope.selectedProfile  = $scope.profiles.filter(function (obj) {
                return obj.name == $scope.choiceProfile;
            });
            $scope.selectedProfile = $scope.selectedProfile[0];
            localStorageService.setProfile($scope.selectedProfile);
            $scope.calRemaining = $scope.selectedProfile.calMax - $scope.totalCaloriesForEverything;
        };


        /**
         * Appel à la fonction initialisant l'application
         */
        $scope.init();
    }]);