var app;

app = angular.module("app", ['ngSanitize', 'angularSpinner']);

app.controller('chatRoom', [
  '$http', '$rootScope', 'vkapi', 'params', '$timeout', function($http, $rootScope, vkapi, params, $timeout) {
    var getRoomMessages, now, scrollBottom, socket, vm;
    vm = this;
    vm.isLoading = true;
    vm.roomId = 'main';
    vm.message = "";
    vm.chat = [];
    vm.friends = [];
    vkapi.getUser(params.viewer_id).then(function(data) {
      if (data.length && data[0].uid) {
        params.uid = data[0].uid;
        params.last_name = data[0].last_name;
        params.first_name = data[0].first_name;
        params.photo_50 = data[0].photo_50;
        return $http.get('/api/rooms?uid=' + params.uid).success(function(data) {
          vm.rooms = data && data.rooms ? data.rooms : [];
          return vm.isLoading = false;
        });
      }
    });
    vkapi.getFriends(params.viewer_id).then(function(data) {
      console.log(data);
      return vm.friends = data;
    });
    socket = io(window.location.host);
    socket.on('message', function(msg) {
      console.log(msg);
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
    getRoomMessages = function() {
      return $http.get('/api/messages?roomId=' + vm.roomId).success(function(data) {
        if (data && data.messages) {
          vm.chat = data.messages;
          return scrollBottom();
        }
      }).error(function() {});
    };
    getRoomMessages();
    now = function() {
      return new Date().getTime();
    };
    vm.createRoom = function() {
      var f, selectedFriends;
      if (!vm.newRoomTitle) {
        alert('заполните название комнаты');
        return;
      }
      selectedFriends = (function() {
        var _i, _len, _ref, _results;
        _ref = vm.friends;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          f = _ref[_i];
          if (f.inRoom) {
            _results.push(f);
          }
        }
        return _results;
      })();
      if (selectedFriends.length === 0) {
        alert('выберите собеседников');
        return;
      }
      selectedFriends = selectedFriends.map(function(friend) {
        return {
          firstName: friend.first_name,
          lastName: friend.last_name,
          uid: friend.uid,
          imgUrl: friend.photo_50
        };
      });
      selectedFriends.push({
        firstName: params.first_name,
        lastName: params.last_name,
        uid: params.uid,
        imgUrl: params.photo_50
      });
      return $http.post('/api/rooms', {
        roomTitle: vm.newRoomTitle,
        users: selectedFriends
      }).success(function(data) {
        return vm.rooms.push(data);
      });
    };
    vm.openRoom = function(room) {
      vm.roomId = room.id;
      getRoomMessages();
      socket.emit('changeRoom', room.id);
      return vm.showRoomForm = false;
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
