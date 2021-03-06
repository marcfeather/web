angular
    .module('bit.accounts')

    .controller('accountsRegisterController', function ($scope, $location, apiService, cryptoService, validationService, $analytics) {
        var params = $location.search();

        $scope.success = false;
        $scope.model = {
            email: params.email
        };

        $scope.registerPromise = null;
        $scope.register = function (form) {
            var error = false;

            if ($scope.model.masterPassword.length < 8 || !/[a-z]/i.test($scope.model.masterPassword) ||
                /^[a-zA-Z]*$/.test($scope.model.masterPassword)) {
                validationService.addError(form, 'MasterPassword',
                    'Master password must be at least 8 characters long and contain at least 1 letter and 1 number ' +
                    'or special character.', true);
                error = true;
            }
            if ($scope.model.masterPassword !== $scope.model.confirmMasterPassword) {
                validationService.addError(form, 'ConfirmMasterPassword', 'Master password confirmation does not match.', true);
                error = true;
            }

            if (error) {
                return;
            }

            var key = cryptoService.makeKey($scope.model.masterPassword, $scope.model.email);
            var request = {
                name: $scope.model.name,
                email: $scope.model.email,
                masterPasswordHash: cryptoService.hashPassword($scope.model.masterPassword, key),
                masterPasswordHint: $scope.model.masterPasswordHint
            };

            $scope.registerPromise = apiService.accounts.register(request, function () {
                $scope.success = true;
                $analytics.eventTrack('Registered');
            }).$promise;
        };
    });
