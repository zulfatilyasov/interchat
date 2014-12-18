app = angular.module("app", [
  'ngSanitize'
])

app.factory 'stub',
  ['$q', ($q) ->
    getUser = ->
      [{
        first_name:'Зульфат'
        last_name:'Ильясов'
        photo_50:'http://cs416831.vk.me/v416831144/86fe/iS1kFAazifc.jpg'
        uid: Math.floor Math.random()*100
      }]

    getFriends = ->
      [
        {
          id: 153796,
          first_name: 'Александром'
          last_name: 'Москалюком'
          domain: 'alex.moskalyuk'
          photo_50: 'http://pp.vk.me/...96/e_b0bdca6e.jpg'
          online: 0
        }
        {
          id: 10741
          first_name: 'Александром'
          last_name: 'Мынзой'
          domain: 'alexminza'
          photo_50: 'http://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }
      ]

    {
      getUser:getUser
      getFriends:getFriends
    }
     
  ]

app.controller('chatRoom',['$http','$rootScope', 'vkapi', 'params','$timeout', ($http, $rootScope, vkapi, params, $timeout) ->
      vm = @
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

      socket = io(window.location.host)
      socket.on 'message', (msg) ->
        if msg.author.uid isnt params.uid
          $rootScope.$apply ->
            vm.chat.push msg
            scrollBottom()

      vm.roomId = 'main'
      vm.message = ""
      vm.chat = []

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
              return
            )

      vm.room =
        title:'Кухня'

      return
    ])

window.params =
  window.location.search.split('&').map((i) ->
    i.split('=')
  ).reduce((memo, i) ->
    memo[i[0]] = if i[1] == +i[1] then parseFloat(i[1],10) else decodeURIComponent(i[1])
    memo
  , {})

console.log(window.params)

app.value('params',
  window.params or
  {
    "api_url":"https://api.vk.com/api.php"
    "api_id":4683043
    "api_settings":2
    "viewer_id":54464144
    "viewer_type":2
    "sid":"ed309a91a1d44f89ffbeacf2abd918a412f214429b5716061acc386819f449305421a55f9febafc4f8d97"
    "secret":"1ad8cec905"
    "access_token":"132b43b49985005c31f994ee7ad79f2e631fb724548d53bb14fc3b024950980a9523b2cb791afd80aaa2e"
    "user_id":54464144
    "group_id":0
    "is_app_user":1
    "auth_key":"e29f437cfe5e49da4500fa4af2766eee"
    "language":0
    "parent_language":0
    "ad_info":"ElsdCQRYRVNgBABfAwJSXHt5B0Q8HTJXUVBBJRVBNwoIFjI2HA8E"
    "is_secure":1
    "ads_app_id":"4683043_9443480f42c3b2953c"
    "referrer":"unknown"
    "lc_name":"c282b108"
    "hash":""
  })

if window.params and window.params.api_id
  console.log 'production'
else
  console.log 'dev'

app.value('config', production: if window.params and window.params.api_id then true else false)

app.factory 'vkapi',
  ['params','$q', 'config', 'stub', (params, $q, config, stub) ->

    getUser = (userIds) ->
      defer = $q.defer()
      if config.production
        VK.api("users.get", {user_ids:userIds, fields:'photo_50'}, (data) ->
          if data.response then defer.resolve data.response else defer.reject()
          return
          )
      else
        defer.resolve stub.getUser()

      defer.promise

    getFriends = (userId) ->
      defer = $q.defer()
      if config.production
        VK.api("friends.get", {user_id:userId, fields:'photo_50'}, (data) ->
          if data.response then defer.resolve data.response else defer.reject()
          return
        )
      else
        defer.resolve stub.getFriends()
      defer.promise

    {
      getUser:getUser
      getFriends:getFriends
    }
  ]

angular.module("app").factory 'authInterceptor',
  ['params', (params) ->
    authKey = params.auth_key
    request: (config) ->
      config.headers = config.headers or {}
      config.headers.AuthKey = authKey
      console.log config.url
      config
  ]

app.config ($httpProvider) ->
  $httpProvider.interceptors.push "authInterceptor"

app.run () ->
