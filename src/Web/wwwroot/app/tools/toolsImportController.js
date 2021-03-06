﻿angular
    .module('bit.tools')

    .controller('toolsImportController', function ($scope, $state, apiService, $uibModalInstance, cryptoService, cipherService, toastr, importService, $analytics) {
        $analytics.eventTrack('toolsImportController', { category: 'Modal' });
        $scope.model = { source: 'local' };

        $scope.import = function (model) {
            $scope.processing = true;
            var file = document.getElementById('file').files[0];
            importService.import(model.source, file, importSuccess, importError);
        };

        function importSuccess(folders, sites, folderRelationships) {
            apiService.ciphers.import({
                folders: cipherService.encryptFolders(folders, cryptoService.getKey()),
                sites: cipherService.encryptSites(sites, cryptoService.getKey()),
                folderRelationships: folderRelationships
            }, function () {
                $uibModalInstance.dismiss('cancel');
                $state.go('backend.vault').then(function () {
                    $analytics.eventTrack('Imported Data', { label: model.source });
                    toastr.success('Data has been successfully imported into your vault.', 'Import Success');
                });
            }, importError);
        }

        function importError() {
            $uibModalInstance.dismiss('cancel');
            toastr.error('Something went wrong. Try again.', 'Oh No!');
        }

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
