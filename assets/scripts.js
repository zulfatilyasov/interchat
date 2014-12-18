var app;

app = angular.module("app", ['ngSanitize']);

app.controller('chatRoom', [
  '$http', '$rootScope', 'vkapi', 'params', '$timeout', function($http, $rootScope, vkapi, params, $timeout) {
    var now, scrollBottom, socket, vm;
    vm = this;
    vm.roomId = 'main';
    vm.message = "";
    vm.chat = [];
    vm.friends = [];
    vkapi.getUser(params.viewer_id).then(function(data) {
      if (data.length && data[0].uid) {
        params.uid = data[0].uid;
        params.last_name = data[0].last_name;
        params.first_name = data[0].first_name;
        return params.photo_50 = data[0].photo_50;
      }
    });
    vkapi.getFriends(params.viewer_id).then(function(data) {
      console.log(data);
      return vm.friends = data;
    });
    socket = io(window.location.host);
    socket.on('message', function(msg) {
      if (msg.author.uid !== params.uid) {
        return $rootScope.$apply(function() {
          vm.chat.push(msg);
          return scrollBottom();
        });
      }
    });
    scrollBottom = function() {
      return $timeout(function() {
        var chatDiv;
        chatDiv = document.getElementById("chat");
        return chatDiv.scrollTop = chatDiv.scrollHeight + 100;
      });
    };
    $http.get('/api/messages?roomId=' + vm.roomId).success(function(data) {
      if (data && data.messages) {
        vm.chat = data.messages;
        return scrollBottom();
      }
    }).error(function() {});
    now = function() {
      return new Date().getTime();
    };
    vm.sendMessage = function() {
      var doc;
      doc = {
        roomId: vm.roomId,
        message: {
          text: vm.message,
          timestamp: now(),
          author: {
            uid: params.uid,
            firstName: params.first_name,
            lastName: params.last_name,
            imgUrl: params.photo_50
          }
        }
      };
      return $http.post('/api/messages', doc).success(function() {
        vm.chat.push(doc.message);
        scrollBottom();
        vm.message = "";
      });
    };
    vm.room = {
      title: 'Кухня'
    };
  }
]);

app.config(function($httpProvider) {
  return $httpProvider.interceptors.push("authInterceptor");
});

app.run(function() {});
