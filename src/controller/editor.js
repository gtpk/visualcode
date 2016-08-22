;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.controller('editorCtrl', function ($scope, $cookies, workSpace) {
    $scope.isCollapsed = false;
    
    $scope.data = workSpace.data;
    $scope.selected = workSpace.selected;

    var editor;

    $scope.cmOptions = {
      indentWithTabs: true,
      mode: "text/x-c++src",
      styleActiveLine: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      lineWrapping: true,
      gutters: ["CodeMirror-linenumbers", "breakpoints"]
    };

    $scope.theme = 'default';

    $scope.themes = ['default', 'bespin', 'blackboard', 'cobalt',
    'dracula', 'eclipse', 'erlang-dark', 'the-matrix', 'zenburn'];



    $scope.selectTheme = function (theme) {
      $scope.theme = theme;
      editor.setOption("theme", theme);
    };


    $scope.cmLoadded = function (cm) {
      editor = cm;

      editor.on("gutterClick", function(cm, n) {
        var marker = $scope.getMarker(n);

        var bp;

        if (!marker) {
          marker = $scope.makeMarker(n);
          bp = {line: n, draws: {}, marker: marker}
          workSpace.data.breaks.push(bp);
          workSpace.isChanged = true;
        }
        else {
          bp = $scope.findBreakpointByMarker(marker);
        }

        workSpace.selected.line = n;
        $scope.selectBreakpoint(bp);

        $scope.designerOpen = true;
        $scope.$apply();
      });

      editor.on('keyup', function () {
        workSpace.isChanged = true;
        if (workSpace.selected.breakpoint) {
          var isMarker = false;
          $scope.getEachMarkers(function (marker) {
            if (marker === workSpace.selected.breakpoint.marker) {
              isMarker = true;
            }
          });
          if (!isMarker) {
            delete workSpace.selected.breakpoint;
            $scope.$apply();
          }
        }
      });

    };
   

    $scope.makeMarker = function (line) {
      var marker = document.createElement("div");
      marker.setAttribute("class", "breakpoint");
      marker.innerHTML = "●";
      editor.setGutterMarker(line, "breakpoints", marker); 

      return marker;
    };


    $scope.getMarker = function (line) {
      var info = editor.lineInfo(line);
      if (!info) {
        return;
      }

      if (!info.gutterMarkers) {
        return;
      }

      return info.gutterMarkers.breakpoints;
    };


    $scope.findBreakpointByMarker = function (marker) {
      var ret;
      workSpace.data.breaks.some(function (bp) {
        if (bp.marker === marker) {
          ret = bp;
          return true;
        }
      });
      return ret;
    };


    $scope.selectBreakpoint = function (bp) {
      workSpace.selected.breakpoint = bp;

      workSpace.data.breaks.forEach(function (bp) {
        bp.marker.setAttribute("class", "breakpoint");
      });
      bp.marker.setAttribute("class", "breakpoint active");
    };

    $scope.onInputChanged = function () {
      workSpace.isChanged = true;
    };


    $scope.upload = function () {
      console.log('upload');
    };

    $scope.removeBreakpoint = function (bp) {
      workSpace.data.breaks.splice(
        workSpace.data.breaks.indexOf(bp), 1);
      editor.setGutterMarker($scope.getMarkerLine(bp.marker),
        "breakpoints", null);
    };

    
    $scope.getMarkerLine = function (marker) {
      for (var i = editor.firstLine(); i <= editor.lastLine(); i++) {
        if ($scope.getMarker(i) === marker) {
          return i;
        }
      }
      return -1;
    };


    $scope.syncMarkersAndBreaks = function () {
      var temp = [];
      while (workSpace.data.breaks.length) {
        var bp = workSpace.data.breaks.pop();
        var line = $scope.getMarkerLine(bp.marker);
        if (line != -1) {
          bp.line = line;
          temp.push(bp);
        }
      }

      while (temp.length) {
        workSpace.data.breaks.push(temp.pop());
      }
    };


    $scope.getEachMarkers = function (callback) {
      editor.eachLine(function (lineinfo) {
        if (!lineinfo.gutterMarkers) {
          return;
        }
        callback(lineinfo.gutterMarkers.breakpoints);
      });
    };


    $scope.$on('editorCtrl.redrawBreakpoints', function () {
      editor.clearGutter('breakpoints');
      editor.setValue(workSpace.data.code);

      workSpace.data.breaks.forEach(function (bp) {
        var marker = $scope.makeMarker(bp.line);
        bp.marker = marker;
      });
    });

    $scope.$on('editorCtrl.syncMarkersAndBreaks', function () {
      $scope.syncMarkersAndBreaks();
    });

  });

})(angular);

