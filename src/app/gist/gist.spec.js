/*global angular:false */


(function () {
    "use strict";

    describe('GistController', function () {
        var gistCtrl,
            scope,
            rootScope,
            httpBackend,
            gService,
            uService,
            location,
            gistIds = [
                {"id": "081b084e13fd0318c097", "user": {"id" : 765676}},
                {"id": "8140072", "user": {"id" : 765676}},
                {"id": "8138254", "user": {"id" : 765676}}
            ],
            privateGist = {
                id: "081b084e13fd0318c097",
                "files": {"file1": {"filename": "file1", "type": "text/plain", "language": null, "size": 31, "content": "Some interesting content maybe?"}
                }, "description": "Private", "user": {"id" : 765676}
            },
            publicGist_1 = {id: "8140072", "files": {
                "readme.txt": {"filename": "readme.txt", "type": "text/plain", "language": null, "size": 20, "content": "Read me - \n\n\n\n\nagain"
                },
                "lorem.txt": {"filename": "lorem.txt", "type": "text/plain", "language": null, "size": 19, "content": "No more lorem ipsum"
                },
                "module.js": {"filename": "module.js", "type": "application/javascript", "language": "JavaScript", "size": 495, "content": "angular.module('isAModule', [])\n.controller('imACtrl', ['$scope', '$http', function(scope, http){\n    scope.data = {};\n    scope.functions = {};\n    \n    scope.functions.getValues = function() {\n      http.get('http://example.com')\n        .success(function(vals) {\n          scope.data.values = vals;\n      }); \n    };\n}])\n.directive('imADirective', [function(){\n    return {\n        link: function(scope, elem, attrs) {\n            elem.css('background-color', '#7a7a7a');\n        }\n    }\n}]);"
                },
                "template.html": {"filename": "template.html", "type": "text/html", "language": "HTML", "size": 54, "content": "  <html>\n    <head></head>\n    <body></body>\n  </html>"
                }
            }, "description": "Some files ...", "user": {"id" : 765676}
            },
            publicGist_2 = {id: "8138254",
                "files": {"module.js": {"filename": "module.js", "type": "application/javascript", "language": "JavaScript", "size": 94, "content": "(function(){\n  var f12 = function() {\n    //do stuff\n  }\n  return {\n    doStuff: f12\n  }\n})();"
                }
                }, "description": "First test gist", "user": {"id" : 765676}
            };


        beforeEach(module('credModule'));
        beforeEach(angular.mock.module("restangular"));
        beforeEach(angular.mock.module('gistModule'));

        beforeEach(inject(function ($injector) {
            var $controller = $injector.get('$controller');
            rootScope = $injector.get('$rootScope');

            scope = rootScope.$new();
            location = $injector.get('$location');
            uService = $injector.get('userService');
            httpBackend = $injector.get('$httpBackend');
            gService = $injector.get('gistService');

            scope.data = {};
            gistCtrl = $controller('gistCtrl', {
                $scope: scope,
                $rootScope: rootScope,
                userService: uService,
                $location: location,
                gists: [],
                gistService: gService
            });
            httpBackend.when('POST', 'https://api.github.com/user').respond(200, {"login": "username", "id": 765676});
            httpBackend.when('GET', '/users/username/gists').respond(gistIds);
            httpBackend.when('GET', '/gists/081b084e13fd0318c097').respond(privateGist);
            httpBackend.when('GET', '/gists/8140072').respond(publicGist_1);
            httpBackend.when('GET', '/gists/8138254').respond(publicGist_2);
            httpBackend.when('GET', '/users/userTwo/gists').respond([
                {"id": "123456789"}
            ]);
            httpBackend.when('GET', '/gists/123456789').respond(publicGist_2 = {id: "123456789",
                "files": {"otherUser.js": {"filename": "otherUser.js", "type": "application/javascript", "language": "JavaScript", "size": 94, "content": "console.log('Hello other user');"
                }
                }, "description": "Other users gist", "user": {"id" : 2345678}
            });
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        function fakeLogin() {
            httpBackend.expectPOST('https://api.github.com/user').respond(200, {"login": "username", "id": 765676});
            uService.login({id: 'username', sec: 'password'});
            httpBackend.flush();
            setOtherUsername('username');
        }

        function setOtherUsername(name) {
            scope.$apply(function () {
                scope.data.username = name;
            });
        }

        function expectDefaultUserGets() {
            httpBackend.expectGET('/users/username/gists');
            httpBackend.expectGET('/gists/081b084e13fd0318c097');
            httpBackend.expectGET('/gists/8140072');
            httpBackend.expectGET('/gists/8138254');

        }

        describe('is setup with correct functions', function() {
            it('has the correct setup', function() {
               expect(scope.logout).toBeDefined();
               expect(scope.create).toBeDefined();
               expect(scope.star).toBeDefined();
               expect(scope.unstar).toBeDefined();
               expect(scope.deleteGist).toBeDefined();
               expect(scope.browse).toBeDefined();
               expect(scope.update).toBeDefined();
            });
        });

        describe('fetch gists', function () {
            it('can get user gists from api', function () {
                fakeLogin();
                expectDefaultUserGets();

                expect(scope.data.gists).toEqual([]);

                scope.browse();
                httpBackend.flush();

                expect(scope.data.gists.length).toEqual(3);
            });

            it('no call to api is made when data.username is not set', function () {
                spyOn(gService, 'gists');
                fakeLogin();
                setOtherUsername(undefined);

                scope.browse();

                expect(gService.gists).not.toHaveBeenCalled();
            });

            it('can get gist for a different user', function () {
                fakeLogin();
                setOtherUsername('userTwo');

                httpBackend.expectGET('/users/userTwo/gists');
                httpBackend.expectGET('/gists/123456789');
                scope.browse();
                httpBackend.flush();
                expect(scope.data.ownGists).toBeFalsy();

                expect(scope.data.gists.length).toEqual(1);
            });

            it('returns error when username is not matching github user', function () {
                fakeLogin();
                setOtherUsername('NotACorrectUsername');
                httpBackend.expectGET('/users/NotACorrectUsername/gists').respond(401, {
                    "message": "Not found",
                    "documentation_url": "http://developer.github.com/v3"
                });
                scope.browse();
                httpBackend.flush();

                expect(scope.data.error).not.toBe(undefined);
                expect(scope.data.error).toEqual('Gists Not found for NotACorrectUsername');
            });
        });

        describe('interactions with a gist', function () {
            it('can NOT update other users gists', function () {
                spyOn(gService, 'update');

                fakeLogin();
                setOtherUsername('userTwo');

                httpBackend.expectGET('/users/userTwo/gists');
                httpBackend.expectGET('/gists/123456789');
                scope.browse();
                httpBackend.flush();

                scope.update(scope.data.gists[0]);
                expect(gService.update).not.toHaveBeenCalled();
            });

            it('can update own gists', function () {
                fakeLogin();
                setOtherUsername('username');
                expectDefaultUserGets();

                scope.browse();
                httpBackend.flush();

                scope.data.gists[0].files['file1'].content = 'New content before update';

                var transformedGist = gService.transformForUpdate(scope.data.gists[0]);

                httpBackend.expectPATCH('/gists/' + scope.data.gists[0].id, transformedGist).respond(200, scope.data.gists[0]);

                scope.update(scope.data.gists[0]);
                httpBackend.flush();
                expect(scope.data.gists[0].files['file1'].content).toEqual('New content before update');
            });

            it('can create a new gist', function () {
                fakeLogin();

                scope.$apply(function () {
                    scope.data.gists = [];
                    scope.data.newGist.description = "New Gist";
                    scope.data.newGist.public = false;
                    scope.data.newGist.filename = "newFile.js";
                });

                var gist = {
                    description: "New Gist",
                    public: false,
                    files: {
                        'newFile.js': {
                            content: '//Created by username'
                        }
                    }
                };

                var createdGist = {
                    "url": "https://api.github.com/gists/123456789",
                    "forks_url": "https://api.github.com/gists/123456789/forks",
                    "commits_url": "https://api.github.com/gists/123456789/commits",
                    "id": "1",
                    "description": "description of gist",
                    "public": true,
                    "user": {
                        "login": "username",
                        "id": 109876543,
                        "avatar_url": "https://github.com/images/error/username.gif",
                        "gravatar_id": "somehexcode",
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
                        "site_admin": false
                    },
                    "files": {
                        "size": 932,
                        "filename": "newFile.js",
                        "raw_url": "https://gist.github.com/raw/365370/8c4d2d43d178df44f4c03a7f2ac0ff512853564e/newFile.js",
                        "type": "text/javascript",
                        "language": "JavaScript",
                        "content": "contents of gist"
                    }
                };

                httpBackend.expect('POST', '/gists', gist).respond(201, createdGist);
                scope.create();
                httpBackend.flush();
                expect(scope.data.newGist).toEqual({'public': true});
                expect(scope.data.gists.length).toEqual(1);
                expect(scope.data.gists[0].id).toEqual(createdGist.id);
            });


            it('can star a gist', function () {
                fakeLogin();

                httpBackend.expectPUT('/gists/8140072/star').respond(204);
                scope.star(8140072);
                httpBackend.flush();
            });

            it('can remove a star from a gist', function () {
                fakeLogin();

                httpBackend.expectDELETE('/gists/8140072/star').respond(204);
                scope.unstar(8140072);
                httpBackend.flush();
            });

            it('should remove gist from array when deleted', function() {
                fakeLogin();
                expectDefaultUserGets();

                scope.browse();
                httpBackend.flush();
                httpBackend.expectDELETE('/gists/8140072').respond(204);
                expect(scope.data.gists.length).toBe(3);

                scope.deleteGist(scope.data.gists[1].id);
                httpBackend.flush();

                expect(scope.data.gists.length).toBe(2);
                expect(scope.data.gists[0].id).not.toBe('8140072');
                expect(scope.data.gists[1].id).not.toBe('8140072');
            });

            it('should not remove gist from array when tried to delete, with error response', function() {
                fakeLogin();
                expectDefaultUserGets();

                scope.browse();
                httpBackend.flush();
                httpBackend.expectDELETE('/gists/8140072').respond(403);
                expect(scope.data.gists.length).toBe(3);

                scope.deleteGist(scope.data.gists[1].id);
                httpBackend.flush();

                expect(scope.data.gists.length).toBe(3);
                expect(scope.data.gists[1].id).toBe('8140072');

                expect(scope.data.error).toBe('Could not delete gist');
            });
        });


        //TODO: Should be moved to a different spec for gistService
        it('can transform a gist before update', function () {
            var expectedResult = {
                description: privateGist.description,
                files: {'file1': {'content': 'New content'}}
            };

            privateGist.files['file1'].content = 'New content';
            var result = gService.transformForUpdate(privateGist);

            expect(expectedResult).toEqual(result);
        });
    });
})();
