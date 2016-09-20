;(function(){

'use strict';

angular.module('HTMLTemplates', []).run(['$templateCache', function($templateCache) {

  $templateCache.put('modal/drawapi-modal.tpl.html', '<div class="vico-modal"><div class="modal-header"><h3 class="modal-title">{{api.name}}</h3>{{api.description}}</div><div class="modal-body"><div class="form-group" ng-class="{\'has-error\': error && !param.optional && !param.value}" ng-repeat="param in api.params"><label for="title" class="control-label">{{param.name}}{{param.optional ? "(optional)" : ""}}:</label><input type="text" class="form-control" ng-model="param.value" placeholder="{{param.description}}"></div></div><div class="modal-footer"><button type="button" class="btn btn-success" ng-click="save()">{{modify ? "Modify" : "Add"}}</button><button type="button" class="btn btn-default" ng-click="cancel()">Close</button></div></div>');

  $templateCache.put('modal/save-modal.tpl.html', '<div class="vico-modal"><div class="modal-header"><h4 class="modal-title">Save This Canvas</h4></div><div class="modal-body"><div class="form-group"><label for="title" class="control-label">제목:</label><input type="text" class="form-control" ng-model="title" placeholder="제목 없는 캔버스"></div></div><div class="modal-footer"><button type="button" class="btn btn-success" ng-click="save()">Save</button><button type="button" class="btn btn-default" ng-click="cancel()">Close</button></div></div>');

  $templateCache.put('editor/index.ejs', '<div class="scrollable"><div class="vico-edit-panel"><div class="vico-editor"><div class="header"><label>Source Code:</label><span>Select a theme:</span><div class="btn-group" uib-dropdown><button id="btnSelectTheme" type="button" class="btn btn-default" uib-dropdown-toggle>{{editor.theme}}<span class="caret"></span></button><ul class="dropdown-menu dropdown-menu-right" uib-dropdown-menu role="menu" aria-labelledby="btnSelectTheme"><li ng-repeat="a in editor.themes" role="menuitem"><a ng-click="editor.selectTheme(a)">{{a}}</a></li></ul></div></div><div class="body"><div class="vico-codemirror" ui-codemirror="{onLoad : cmLoadded}" ui-codemirror-opts="cmOptions" ng-model="currentCanvas.code"></div></div></div><div style="width: 100%; position: relative; height: 50px; line-height: 50px"><label>Input Data:</label></div><div class="vico-input-area"><textarea class="vico-textarea" ng-model="currentCanvas.input"></textarea></div><div style="width: 80%; margin: auto; margin-top: 25px; margin-bottom: 25px"><button type="button" class="btn btn-primary btn-lg btn-block" ng-click="uploadCanvas()">Upload</button></div><pageslide ps-open="designerOpen" ps-size="400px" ps-zindex="100" ps-key-listener="true" ps-click-outside="false" ps-auto-close="true"><div class="vico-designer-view" ng-controller="DesignerCtrl"><div class="vico-designer" ng-init="loadDrawApiList()"><div class="btn-group" uib-dropdown><button id="btnAddStructure" type="button" class="btn btn-primary" uib-dropdown-toggle>Add Structure<span class="caret"></span></button><ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="btnAddStructure"><li role="menuitem" ng-repeat="(type, api) in drawApiList"><div class="item" ng-click="addStructure(type)"><img class="picture" alt="{{type}}" ng-src="/images/{{type}}.png"><span>{{api.lavel}}</span></div></li></ul></div><hr><div class="structure-list"><div class="item" ng-repeat="item in currentCanvas.structures"><img class="picture" alt="{{item.type}}" ng-src="/images/{{item.type}}.png" ng-class="{active: selectedStructure.id === item.id}" ng-click="selectStructure(item)"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true" ng-click="removeStructure(item)"></span><lavel>{{item.id}}</lavel></div></div><hr><div ng-show="selectedStructure && selectedGutter"><div class="btn-group" uib-dropdown><button id="btnAddDraw" type="button" class="btn btn-default" uib-dropdown-toggle>Add Draw<span class="caret"></span></button><ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="btnAddDraw"><li role="menuitem" ng-repeat="api in drawApiList[selectedStructure.id].apis"><a ng-click="openAddDrawApiModal(api)" popover-trigger="\'mouseenter\'" popover-placement="left" uib-popover="{{api.description}}">{{api.name}}</a></li></ul></div><div class="list-group drawapi-list"><div ng-repeat="draw in selectedGutter.draws | filter: drawListFilter"><a ng-click="openModifyDrawApiModal(draw)" class="list-group-item">{{drawApiToString(draw)}}<span class="glyphicon glyphicon-remove" aria-hidden="true" ng-click="removeDrawApi(draw)"></span></a></div></div></div><button type="button" class="btn btn-danger" style="position: absolute; bottom: 20px; right: 20px" ng-click="removeSelectedGutterMarker()" ng-show="selectedGutter">Remove</button></div></div></pageslide></div></div>');

  $templateCache.put('home/index.ejs', '<div class="fill" ng-controller="CanvasManagerCtrl" ng-init="initCanvas()"><nav class="navbar navbar-inverse vico-navbar"><div class="section vico-navbar-header"><a class="navbar-brand" ng-click="canvasListOpen = !canvasListOpen"><span class="glyphicon glyphicon-menu-hamburger"></span></a><a class="navbar-text title" ng-click="openSaveModal()">{{currentCanvas.title || "제목 없는 캔버스"}}</a></div><div class="section vico-navbar-container"><span class="navbar-btn vico-btn-save" ng-class="{enable: isChanged()}" ng-click="saveCanvas()">Save</span></div></nav><pageslide ps-open="canvasListOpen" ps-side="left" ps-push="true" ps-size="290px" ps-click-outside="false" ps-key-listener="true"><div class="vico-canvas-list" id="slider-canvas-list"><div class="vico-canvas-list-header"><span>검색기능넣기</span></div><div class="vico-canvas-list-container"><div class="scrollable"><div style="padding: 20px"><a class="btn icon-btn btn-default btn-lg btn-block" ng-click="newCanvas()"><span class="glyphicon btn-glyphicon glyphicon-plus img-circle text-success"></span>새 캔버스</a></div><div class="section-bar">Current Canvas</div><div class="vico-list"><div class="vico-list-container"><div class="vico-list-item"><span class="thumb"></span><span class="title" style="padding-right: 60px">{{currentCanvas.title || "제목 없는 캔버스"}}</span><span class="date">no unsaved changes</span><span class="vico-btn-save" ng-class="{enable: isChanged()}" ng-click="saveCanvas()">Save</span></div></div></div><div class="section-bar" ng-init="loadSavedCanvas()" ng-show="savedCanvas.length">Saved Canvas</div><div class="vico-list" ng-repeat="item in savedCanvas"><div class="vico-list-container"><div class="vico-list-item" ng-class="{active: isActiveItem(item)}" ng-click="setSavedCanvas(item)"><span class="thumb"></span><span class="title">{{item.title || "제목 없는 캔버스"}}</span><span class="date">{{item.updateDate | vicoDate}}</span><span class="remove glyphicon glyphicon-remove" ng-click="removeSavedCanvas(item)"></span></div></div></div><div class="section-bar" ng-init="loadExamples()" ng-show="examples.length">Examples</div><div class="vico-list" ng-repeat="item in examples"><div class="vico-list-container"><div class="vico-list-item" ng-click="setExample(item)"><span class="thumb"></span><span class="title">{{item.title || "제목 없는 캔버스"}}</span><span class="date">예시</span></div></div></div></div></div></div></pageslide><div class="vico-container"><div ui-view="container" class="fill"></div></div></div>');

  $templateCache.put('viewer/index.ejs', '<div class="fill"><div class="vico-canvas-view" id="resizer-container" ng-click="keydown()"><div id="resizer-top-content" ng-init="initCanvas()"></div><div id="resizer-bottom-content"><div class="scrollable"><div class="vico-codemirror" ui-codemirror="{onLoad : cmLoadded}" ui-codemirror-opts="cmOptions" ng-model="code"></div><div class="footer"><button style="margin-left: 10px" type="button" class="btn btn-primary btn-lg" ng-click="btnStepClk()">Step</button><button style="margin-left: 10px" type="button" class="btn btn-primary btn-lg" ng-click="btnNextClk()">Next</button></div></div></div><div class="mc-resizer" id="content-resizer" resizer="horizontal" resizer-height="16" resizer-container="#resizer-container" resizer-top="#resizer-top-content" resizer-bottom="#resizer-bottom-content" resizer-bottom-height="250"></div></div></div>');

}]);

})();