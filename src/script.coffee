app = angular.module("app", [
  'ngSanitize'
])

app.controller('chatRoom',['$http', ($http) ->
      VK.api("users.get", {user_ids:window.params['viewer_id'],fields:'photo_50'}, (data) -> 
        console.log data
      )

      VK.api("friends.get", {user_id:window.params['viewer_id'],fields:'photo_50'}, (data) -> 
        console.log data
      )
      @room = 
        title:'Кухня'

      return
    ])

app.run () ->
