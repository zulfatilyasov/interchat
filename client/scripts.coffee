app = angular.module("app", [
  'ngSanitize'
  'angularSpinner'
])

app.controller('chatRoom',['$http','$rootScope', 'vkapi', 'params','$timeout', ($http, $rootScope, vkapi, params, $timeout) ->
      vm = @
      vm.isLoading = true
      vm.roomId = 'main'
      vm.message = ""
      vm.chat = []
      vm.friends = []

      vkapi.getUser params.viewer_id
        .then (data) ->
          if data.length and data[0].uid
            params.uid = data[0].uid
            params.last_name = data[0].last_name
            params.first_name = data[0].first_name
            params.photo_50 = data[0].photo_50
            $http.get('/api/rooms?uid='+params.uid)
              .success((data)->
                vm.rooms = if data and data.rooms then data.rooms else []
                vm.isLoading = false
                )

      vkapi.getFriends params.viewer_id
        .then (data) ->
          console.log data
          vm.friends = data

      socket = io(window.location.host)

      socket.on 'message', (msg) ->
        console.log msg
        if msg.author.uid isnt params.uid
          $rootScope.$apply ->
            vm.chat.push msg
            scrollBottom()

      scrollBottom = ->
        $timeout(->
          chatDiv = document.getElementById "chat"
          chatDiv.scrollTop = chatDiv.scrollHeight + 100
          )

      getRoomMessages = ->
        $http.get('/api/messages?roomId=' + vm.roomId)
          .success((data)->
            if data and data.messages
              vm.chat = data.messages
              scrollBottom()
            )
          .error(->
            )

      getRoomMessages()

      now = ->
        new Date().getTime()

      vm.createRoom = ->
        if not vm.newRoomTitle
          alert('заполните название комнаты')
          return

        selectedFriends = (f for f in vm.friends when f.inRoom)

        if selectedFriends.length is 0
          alert('выберите собеседников')
          return

        selectedFriends = selectedFriends.map (friend) ->
          firstName:friend.first_name
          lastName:friend.last_name
          uid:friend.uid
          imgUrl:friend.photo_50

        selectedFriends.push
          firstName:params.first_name
          lastName:params.last_name
          uid:params.uid
          imgUrl:params.photo_50

        $http.post('/api/rooms',
          roomTitle:vm.newRoomTitle
          users:selectedFriends
         )
        .success((data)->
          vm.rooms.push data
          )

      vm.openRoom = (room) ->
        vm.roomId = room.id
        getRoomMessages()
        socket.emit('changeRoom', room.id)
        vm.showRoomForm = false

      vm.sendMessage = ->
        doc =
          roomId:vm.roomId
          message:
            text:vm.message
            timestamp:now()
            author:
              uid:params.uid
              firstName:params.first_name
              lastName:params.last_name
              imgUrl:params.photo_50

        $http
          .post('/api/messages', doc)
            .success(->
              vm.chat.push doc.message
              scrollBottom()
              vm.message = ""
              return
            )

      vm.room =
        title:'Кухня'

      return
    ])


app.config ($httpProvider) ->
  $httpProvider.interceptors.push "authInterceptor"

app.run () ->
