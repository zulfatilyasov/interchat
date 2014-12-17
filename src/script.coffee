app = angular.module("app", [
  'ngSanitize'
])

app.controller('chatRoom',['$http', ($http) ->
      url = window.params['?api_url']+'/method/users.get?user_id='+window.params['viewer_id']+'&access_token='+window.params['access_token'];
      console.log url

      $http.get(url)
      .success((data, status, headers, config)->
          console.log data
        )
      .error(->
        console.log(arguments)
        )

      @room = 
        title:'Кухня'

      return
    ])

app.run () ->
