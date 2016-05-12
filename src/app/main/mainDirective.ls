(angular.module 'app.directives').directive 'wall', wall
wall.$inject =
  * \WallService
  * \UserService
  * \TastingService
wall = (WallService, UserService, TastingService) ->
  directive = {
    link: link
    restrict: 'E'
    templateUrl: 'app/wall/wallView.html'
  }
  link = (scope, element, attrs) ->
    scope.TastingService = TastingService
    scope.UserService = UserService
    TastingService.getUserTastings ((err, res) ->
      TastingService.tastings = res if not err
      return )
    return
  directive

