var app = angular.module('todoApp', ['ngRoute']);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl:'home.html',
        })
        .when('/Completed', {
            templateUrl:'completed.html',
        })
        .when('/Active', {
            templateUrl:'active.html',
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
app.controller('todoController', ["$scope", "$filter", function ($scope, $filter) {
    $scope.newTodo = '';
    $scope.todos = [];
    $scope.edited = 0;//当前编辑元素
    //$scope.allChecked = false;
    /*
    $scope. $watch(watchFn,watchAction,deepWatch);
    解释：    watchFn：表示一个，angular表达式或者函数的字符串。    
              watchAction：watchFn发生变化的时候触发此函数，参数为一个function。    
              deepWatch：可选的布尔值命令，检查被监控的每个属性是否发证变化，只对监听对象时有用，如果第三个参数为true则被监听对象的每一个属性变更都会触发第二个参数function，
              如果为false则只检查监听对象的对象引用地址，如果属性变了，但是引用地址没变，不会触发，除非你改为了其他对象。
              监听数组的某个元素或者对象的属性时设置为true;
     例：
             $scope.data = {
                    name :'李四',
                    count:20
             }
        此时data里的name和count都要监听，那么可以这么写：
            $scope.$watch('data',function(){

            },true)
        如果不加第三个参数，那么只会监听data，只有当data引用改变时才会触发。
        因此当需要监听一些引用对象需要把第三个参数设置成true。
     */
    $scope.$watch('todos', function () {
        //var todos = $scope.todos;注：一般不可在controller中将$scope变量赋给一个变量，因为后台并不能双向绑定。
        $scope.remainingCount = $filter('filter')($scope.todos, {completed: false}).length;
        $scope.completedCount = $scope.todos.length - $scope.remainingCount;
        $scope.allChecked = !$scope.remainingCount;
    }, true);
    $scope.addTodo = function () {
        if(!$scope.newTodo){
            return;
        };
        $scope.todos = _.concat($scope.todos, [{
            id: $scope.generateID(4, 16),
            text: $scope.newTodo,
            completed: false
        }]);
        console.log($scope.todos);
        $scope.newTodo = '';
    };
    $scope.deleteTodo = function (id) {
        $scope.todos = _.remove($scope.todos, function (value) {
            return id !== value.id;
            console.log(value);
        });
    };
    $scope.clearCompletedTodos = function () {
        $scope.todos = _.remove($scope.todos, function (value) {
            return value.completed !== true;
        });
    };
    $scope.editing = function (id) {
        $scope.edited = id;
    };
    $scope.save = function () {
        $scope.edited = -1;
    };
    $scope.markAll = function (completed) {
        $scope.todos.forEach(function (todo) {
            if (todo.completed !== completed) {
                todo.completed = completed;
            }
        });
    };
    /*
    指定长度和基数
    */
    $scope.generateID = function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        radix = radix || chars.length;
        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;
            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };
    /*
    $scope.clickInput=function(t){
    t.completed=!t.completed;
    $scope.remainingCount = $filter('filter')($scope.todos, {completed: false}).length;
    };
    */
}]);