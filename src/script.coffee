app = angular.module("app", [
  'ngSanitize'
])

app.controller('chatRoom',['$http','vkapi', ($http, vkapi) ->
      vkapi.getUser window.params['viewer_id']
        .then (data) ->
          console.log data

      vkapi.getFriends window.params['viewer_id']
        .then (data) ->
          console.log data

      @room = 
        title:'Кухня'

      return
    ])

angular.module('app').value('params',window.params)

angular.module('app').factory 'vkapi',
  ['params','$q', (params, $q) ->
    getUser = (userIds) ->
      defer = $q.defer()
      VK.api("users.get", {user_ids:userIds, fields:'photo_50'}, (data) -> 
        if data.response
          defer.resolve(data)
        else
          defer.reject()
        return
      )
      defer.promise

    getFriends = (userId) ->
      defer = $q.defer()
      VK.api("friends.get", {user_id:userId, fields:'photo_50'}, (data) -> 
        if data.response
          defer.resolve(data)
        else
          defer.reject()
        return
      )
      defer.promise

    {
      getUser:getUser
      getFriends:getFriends
    }
  ]

app.run () ->
