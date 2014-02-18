/*global angular:false */

(function () {
    "use strict";
    describe('LoginController', function () {
        var loginCtrl,
            scope,
            location,
            userService,
            httpBackend,
            successCredentials,
            unsuccessCredentials,
            authHeader;

        beforeEach(module('credModule'));

        beforeEach(inject(function ($injector) {

            var $controller = $injector.get('$controller');
            scope = $injector.get('$rootScope').$new();
            location = $injector.get('$location');
            userService = $injector.get('userService');
            httpBackend = $injector.get('$httpBackend');
            loginCtrl = $controller('loginCtrl',
                {
                    $scope: scope,
                    uService: userService,
                    l: location
                }
            );

            scope.data = {};

            successCredentials = {credentials: {id: 'username', sec: 'password'}};
            unsuccessCredentials = {credentials: {id: 'asasas', sec: 'njfdnfj'}};

            httpBackend.when('POST', 'https://api.github.com/user', successCredentials).respond({userId: 'userX'});
            httpBackend.when('POST', 'https://api.github.com/user', unsuccessCredentials).respond({userId: 'userX'});
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('successful login', function () {
            scope.data.credentials = successCredentials;
            authHeader = {'Authorization': 'Basic' + btoa(successCredentials.id + ':' + successCredentials.sec)};

            httpBackend.expectPOST('https://api.github.com/user').respond(200, {
                    "login": "username",
                    "id": 2345678,
                    "avatar_url": "https://gravatar.com/avatar/182f9d321fdaf1134a92b7a9c37fc076?d=https%3A%2F%2Fidenticons.github.com%2Fa70c644bb0079b14454f92e01b00501f.png&r=x",
                    "gravatar_id": "182f9d321fdaf1134a92b7a9c37fc076",
                    "url": "https://api.github.com/users/username",
                    "html_url": "https://github.com/username",
                    "followers_url": "https://api.github.com/users/username/followers",
                    "following_url": "https://api.github.com/users/username/following{/other_user}",
                    "gists_url": "https://api.github.com/users/username/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/username/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/username/subscriptions",
                    "organizations_url": "https://api.github.com/users/username/orgs",
                    "repos_url": "https://api.github.com/users/username/repos",
                    "events_url": "https://api.github.com/users/username/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/username/received_events",
                    "type": "User",
                    "site_admin": false,
                    "name": "User name",
                    "created_at": "2012-09-05T14:56:00Z",
                    "updated_at": "2014-01-07T14:17:57Z",
                    "private_gists": 1,
                    "disk_usage": 296,
                    "plan": {
                        "name": "free",
                        "space": 307200,
                        "collaborators": 0,
                        "private_repos": 0
                    }
                }
            );
            scope.auth();
            httpBackend.flush();

            expect(userService.getAuthHeader()).not.toBe(undefined);
            expect(userService.userLoggedIn()).toBe(true);
            expect(location.path()).toEqual('/gists');
        });

        it('unsuccessful login', function () {
            scope.data.credentials = unsuccessCredentials;
            authHeader = {'Authorization': 'Basic' + btoa(unsuccessCredentials.id + ':' + unsuccessCredentials.sec)};

            httpBackend.expectPOST('https://api.github.com/user').respond(401, {
                "message": "Bad credentials",
                "documentation_url": "http://developer.github.com/v3"
            });
            scope.auth();
            httpBackend.flush();

            expect(userService.getAuthHeader()).toBe(undefined);
            expect(userService.userLoggedIn()).toBe(false);
            expect(location.path()).toEqual('');
        });

    });
})();