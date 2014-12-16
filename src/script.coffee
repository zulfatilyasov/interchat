app = angular.module("app", [
  'ngSanitize'
])

app.controller('chatRoom',[() ->
      @room = 
        title:'Кухня'

      return
    ])

app.run () ->
