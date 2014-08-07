// var app = angular.module('hightlighter', []);
var simple_colors = [
	'00ffff',
	'7fffd4',
	'f0ffff',
	'f5f5dc',
	'ffe4c4',
	'000000',
	'ffebcd',
	'0000ff',
	'8a2be2',
	'a52a2a',
	'deb887',
	'5f9ea0',
	'7fff00',
	'd2691e',
	'ff7f50',
	'6495ed',
	'fff8dc',
	'dc143c',
	'00ffff',
	'00008b',
	'008b8b',
	'b8860b',
	'a9a9a9',
	'006400',
	'bdb76b',
	'8b008b',
	'556b2f',
	'ff8c00',
	'9932cc',
	'8b0000',
	'e9967a',
	'8fbc8f',
	'483d8b',
	'2f4f4f',
	'00ced1',
	'9400d3',
	'ff1493',
	'00bfff',
	'696969',
	'1e90ff',
	'd19275',
	'b22222',
	'fffaf0',
	'228b22',
	'ff00ff',
	'dcdcdc',
	'f8f8ff',
	'ffd700',
	'daa520',
	'808080',
	'008000',
	'adff2f',
	'f0fff0',
	'ff69b4',
	'cd5c5c',
	'4b0082',
	'fffff0',
	'f0e68c',
	'e6e6fa',
	'fff0f5',
	'7cfc00',
	'fffacd',
	'add8e6',
	'f08080',
	'e0ffff',
	'fafad2',
	'd3d3d3',
	'90ee90',
	'ffb6c1',
	'ffa07a',
	'20b2aa',
	'87cefa',
	'8470ff',
	'778899',
	'b0c4de',
	'ffffe0',
	'00ff00',
	'32cd32',
	'faf0e6',
	'ff00ff',
	'800000',
	'66cdaa',
	'0000cd',
	'ba55d3',
	'9370d8',
	'3cb371',
	'7b68ee',
	'00fa9a',
	'48d1cc',
	'c71585',
	'191970',
	'f5fffa',
	'ffe4e1',
	'ffe4b5',
	'ffdead',
	'000080',
	'fdf5e6',
	'808000',
	'6b8e23',
	'ffa500',
	'ff4500',
	'da70d6',
	'eee8aa',
	'98fb98',
	'afeeee',
	'd87093',
	'ffefd5',
	'ffdab9',
	'cd853f',
	'ffc0cb',
	'dda0dd',
	'b0e0e6',
	'800080',
	'ff0000',
	'bc8f8f',
	'4169e1',
	'8b4513',
	'fa8072',
	'f4a460',
	'2e8b57',
	'fff5ee',
	'a0522d',
	'c0c0c0',
	'87ceeb',
	'6a5acd',
	'708090',
	'fffafa',
	'00ff7f',
	'4682b4',
	'd2b48c',
	'008080',
	'd8bfd8',
	'ff6347',
	'40e0d0',
	'ee82ee',
	'd02090',
	'f5deb3',
	'ffffff',
	'f5f5f5',
	'ffff00',
	'9acd32'
];

var app = angular.module('highlighter', ['ui.bootstrap', "ngAnimate", "ngTouch", "ngRoute","ui.router", 'contenteditable']);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});


/**
 * Services that persists and retrieves TODOs from localStorage
 */
app.factory('highLightStorage', function () {
		'use strict';

		var STORAGE_ID = 'highLightStorage';

		return {
			get: function () {
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},

			put: function (todos) {
				localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
			}
		};
	});


app.controller('HighlightCtrl', function($scope, highLightStorage) {

	var allHightLights = $scope.allHightLights = highLightStorage.get();
	$scope.newHighlight = '';
	$scope.text = "Enter yo text";
	$scope.cutXFirstCharacters = 37;


	$scope.addHighlight = function () {
		var newHighlight = $scope.newHighlight.trim();
		if (!newHighlight.length) {
			return;
		}

		allHightLights.push({
			text: newHighlight,
			active: true,
			color: simple_colors[Math.floor(Math.random() * simple_colors.length)],
			"font-size": "14px",
			"style": "default" //line
		});

		$scope.newHighlight = '';
	};

	// $scope.$watch('text', function(newValue, oldValue) {
	// 	$scope.text = "Enter yo text2";
 //   	});

   	$scope.contentChanged = function () {
		// $scope.text = " asdfasdf asdf asdasdasdadasdasdasdasdf sadf<div> Enter yo </div> text2";
		// var lines = $scope.text.split("\n");
		var cutText = cutLines($scope.text);
		$scope.text = highlightText(cutText, ["JECreateNTuple"]);
   	};

   	function cutLines(text) {
   		var lines = text.split("</div>");
		for (var i = 0; i < lines.length; i++) {
			lines[i]= lines[i].substr($scope.cutXFirstCharacters);
			lines[i]= "<div>"+lines[i];
		}
		return lines.join("</div>");
   	}


   	function highlightText(text, highlightings) {
		for (var i = 0; i < highlightings.length; i++) {
			var highlight = highlightings[i];
			if (highlight.length < 3) continue;
			var item = simple_colors[Math.floor(Math.random() * simple_colors.length)];
			if (highlight == "planId=") {
				text = replaceAll(highlight, '<div style="font-size:20px;background-color: #' + item + '">' + highlight + '</div>', text);
			}else{
				text = replaceAll(highlight, '<span style="background-color: #' + item + '">' + highlight + '</span>', text);
			}

		}

		return text;
		// <span style="background-color: #FFFF00">Yellow text.</span>

	}

	function replaceAll(find, replace, str) {
		return str.replace(new RegExp(find, 'g'), replace);
	}

});

// var cutXFirstCharacters = 37;

// // Highligts
// var highlightings = window.localStorage.getItem("highlightings");

// document.addEventListener('DOMContentLoaded', function() {

// 	var editor = document.getElementById("editor");
// 	var hightlightsInput = document.getElementById("hightlights");
// 	hightlightsInput.value = highlightings;

// 	var origText;
// 	editor.addEventListener("input", function() {
// 		origText = editor.innerHTML;

// 		var lines = origText.split("\n");
// 		for (var i = 0; i < lines.length; i++) {
// 			lines[i]= lines[i].substr(cutXFirstCharacters);
// 		}
// 		origText = lines.join("\n");

// 		textChanged();
// 	}, false);

// 	hightlightsInput.addEventListener("input", function() {
// 		highlightings = hightlightsInput.value;
// 		window.localStorage.setItem("highlightings", highlightings);
// 		textChanged();
// 		// alert(document.getElementById("editor").innerHTML);
// 	}, false);

// 	function textChanged() {
// 		// editor.innerHTML = highlightText(origText, highlightings.split(","));
// 	}

// 	function highlightText(text, highlightings) {
// 		for (var i = 0; i < highlightings.length; i++) {
// 			var highlight = highlightings[i];
// 			if (highlight.length < 3) continue;
// 			var item = simple_colors[Math.floor(Math.random() * simple_colors.length)];
// 			if (highlight == "planId=") {
// 				text = replaceAll(highlight, '<div style="font-size:20px;background-color: #' + item + '">' + highlight + '</div>', text);
// 			}else{
// 				text = replaceAll(highlight, '<span style="background-color: #' + item + '">' + highlight + '</span>', text);
// 			}

// 		}

// 		return text;
// 		// <span style="background-color: #FFFF00">Yellow text.</span>

// 	}

// 	function replaceAll(find, replace, str) {
// 		return str.replace(new RegExp(find, 'g'), replace);
// 	}

// });