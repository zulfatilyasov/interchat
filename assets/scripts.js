var app;

app = angular.module("app", ['ngSanitize']);

app.factory('stub', [
  '$q', function($q) {
    var getFriends, getUser;
    getUser = function() {
      return [
        {
          first_name: 'Зульфат',
          last_name: 'Ильясов',
          photo_50: 'http://cs416831.vk.me/v416831144/86fe/iS1kFAazifc.jpg',
          uid: 54464144
        }
      ];
    };
    getFriends = function() {
      return [
        {
          id: 153796,
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'https://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          id: 10741,
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'https://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }
      ];
    };
    return {
      getUser: getUser,
      getFriends: getFriends
    };
  }
]);

app.controller('chatRoom', [
  '$http', 'vkapi', function($http, vkapi) {
    vkapi.getUser(window.params['viewer_id']).then(function(data) {
      return console.log(data);
    });
    vkapi.getFriends(window.params['viewer_id']).then(function(data) {
      return console.log(data);
    });
    this.room = {
      title: 'Кухня'
    };
  }
]);

app.value('params', window.params);

app.value('config', {
  production: true
});

app.factory('vkapi', [
  'params', '$q', 'config', 'stub', function(params, $q, config, stub) {
    var getFriends, getUser;
    getUser = function(userIds) {
      var defer;
      defer = $q.defer();
      if (config.production) {
        VK.api("users.get", {
          user_ids: userIds,
          fields: 'photo_50'
        }, function(data) {
          if (data.response) {
            defer.resolve(data.response);
          } else {
            defer.reject();
          }
        });
      } else {
        defer.resolve(stub.getUser());
      }
      return defer.promise;
    };
    getFriends = function(userId) {
      var defer;
      defer = $q.defer();
      if (config.production) {
        VK.api("friends.get", {
          user_id: userId,
          fields: 'photo_50'
        }, function(data) {
          if (data.response) {
            defer.resolve(data.response);
          } else {
            defer.reject();
          }
        });
      } else {
        defer.resolve(stub.getFriends());
      }
      return defer.promise;
    };
    return {
      getUser: getUser,
      getFriends: getFriends
    };
  }
]);

app.run(function() {});
