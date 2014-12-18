app = angular.module("app", [
  'ngSanitize'
])

app.controller('chatRoom',['$http','$rootScope', 'vkapi', 'params','$timeout', ($http, $rootScope, vkapi, params, $timeout) ->
      vm = @
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

      vkapi.getFriends params.viewer_id
        .then (data) ->
          console.log data
          vm.friends = data


      socket = io(window.location.host)
      socket.on 'message', (msg) ->
        if msg.author.uid isnt params.uid
          $rootScope.$apply ->
            vm.chat.push msg
            scrollBottom()

      scrollBottom = ->
        $timeout(->
          chatDiv = document.getElementById "chat"
          chatDiv.scrollTop = chatDiv.scrollHeight + 100
          )

      $http.get('/api/messages?roomId=' + vm.roomId)
        .success((data)->
          if data and data.messages
            vm.chat = data.messages
            scrollBottom()
          )
        .error(->
          )

      now = ->
        new Date().getTime()

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
