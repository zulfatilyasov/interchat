var getRandomId;

window.params = window.location.search.split('&').map(function(i) {
  return i.split('=');
}).reduce(function(memo, i) {
  memo[i[0]] = i[1] === +i[1] ? parseFloat(i[1], 10) : decodeURIComponent(i[1]);
  return memo;
}, {});

console.log(window.params);

app.value('params', window.params || {
  "api_url": "https://api.vk.com/api.php",
  "api_id": 4683043,
  "api_settings": 2,
  "viewer_id": 54464144,
  "viewer_type": 2,
  "sid": "ed309a91a1d44f89ffbeacf2abd918a412f214429b5716061acc386819f449305421a55f9febafc4f8d97",
  "secret": "1ad8cec905",
  "access_token": "132b43b49985005c31f994ee7ad79f2e631fb724548d53bb14fc3b024950980a9523b2cb791afd80aaa2e",
  "user_id": 54464144,
  "group_id": 0,
  "is_app_user": 1,
  "auth_key": "e29f437cfe5e49da4500fa4af2766eee",
  "language": 0,
  "parent_language": 0,
  "ad_info": "ElsdCQRYRVNgBABfAwJSXHt5B0Q8HTJXUVBBJRVBNwoIFjI2HA8E",
  "is_secure": 1,
  "ads_app_id": "4683043_9443480f42c3b2953c",
  "referrer": "unknown",
  "lc_name": "c282b108",
  "hash": ""
});

app.value('config', {
  production: window.params && window.params.api_id ? true : false
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

angular.module("app").factory('authInterceptor', [
  'params', function(params) {
    var authKey;
    authKey = params.auth_key;
    return {
      request: function(config) {
        config.headers = config.headers || {};
        config.headers.AuthKey = authKey;
        console.log(config.url);
        return config;
      }
    };
  }
]);

getRandomId = function() {
  return Math.floor(Math.random() * 100);
};

app.factory('stub', [
  '$q', function($q) {
    var getFriends, getUser;
    getUser = function() {
      return [
        {
          first_name: 'Зульфат',
          last_name: 'Ильясов',
          photo_50: 'http://cs416831.vk.me/v416831144/86fe/iS1kFAazifc.jpg',
          uid: 33
        }
      ];
    };
    getFriends = function() {
      return [
        {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Москалюком',
          domain: 'alex.moskalyuk',
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg',
          online: 0
        }, {
          uid: getRandomId(),
          first_name: 'Александром',
          last_name: 'Мынзой',
          domain: 'alexminza',
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
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
