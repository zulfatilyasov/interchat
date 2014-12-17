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

app.value('params',window.params)

app.factory 'stub',
  ['$q', ($q) ->
    getUser = ->
      [{
        first_name:'Зульфат',
        last_name:'Ильясов'
        photo_50:'http://cs416831.vk.me/v416831144/86fe/iS1kFAazifc.jpg'
        uid: 54464144
      }]

    getFriends = ->
      [
        {
          id: 153796,
          first_name: 'Александром'
          last_name: 'Москалюком'
          domain: 'alex.moskalyuk'
          photo_50: 'https://pp.vk.me/...96/e_b0bdca6e.jpg'
          online: 0
        } 
        {
          id: 10741
          first_name: 'Александром'
          last_name: 'Мынзой'
          domain: 'alexminza'
          photo_50: 'https://pp.vk.me/...41/e_62a98b6e.jpg',
          online: 0
        }
      ]

    {
      getUser:getUser
      getFriends:getFriends
    }
     
  ]

app.factory 'vkapi',
  ['params','$q', 'stub', (params, $q, stub) ->
    prod = window.location.host.indexOf('vk.com') isnt -1

    getUser = (userIds) ->
      defer = $q.defer()
      if prod
        VK.api("users.get", {user_ids:userIds, fields:'photo_50'}, (data) -> 
          if data.response then defer.resolve data.response else defer.reject()
          return
          )
      else
        defer.resolve stub.getUser()

      defer.promise

    getFriends = (userId) ->
      defer = $q.defer()
      if prod
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

app.run () ->
