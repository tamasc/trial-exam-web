'use strict';

var app = (function () {
  var fireApp = function () {
    ajax.getList(view.renderList);
    document.getElementById('submit').addEventListener('click', function () {
      var message = document.querrySelector('textarea').value;
      var shift = document.querrySelector('#shift').value;
      var dataToSend = {
        "shift": shift,
        "text": message
      };
      view.showMessage(dataToSend.shift);
      ajax.post(dataToSend, view.showdecodedMessage);
    });
  };

  return {
    fire: fireApp
  }
})();

var ajax = (function () {
  var open = function (request, url, dataToSend, callback) {
    var data;
    var xhr = new XMLHttpRequest();
    xhr.open(request, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(dataToSend);
    xhr.onreadystatechange = function (rsp) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
       data = JSON.parse(xhr.response);
       callback(data);
      }
    };
  };

  var getList = function (callback) {
    var request = 'GET';
    var url = 'http://localhost:3000/decode/all';
    var dataToSend = '';
    var callback = view.renderList;
    open(request, url, dataToSend, callback);
  };

  var post = function (data, callback) {
    var request = 'POST';
    var url = 'http://localhost:3000/decode';
    var callback = view.showMessage;
    open(request, url, dataToSend, callback);
  };

  return {
    list: getList,
    post: post,
  }
})();

var view = (function () {
  var renderList = function (allMessages) {
    var list = document.querrySelector('ol');
    allMessages.forEach(function (item, index) {
      var listItem = document.createElement('li');
      listItem.innerText = item[index];
		});
	}

  var showMessage = function (message) {
    var submittedText = document.getElementById('submittedText');
    submittedText.innerText = message;
  };

  var showdecodedMessage = function (message) {
    var decodedText = document.getElementById('decodedText');
    decodedText.innerText = message.text;
  };

  return {
    renderList: renderList,
    showMessage: showMessage,
    showdecodedMessage: showdecodedMessage
  }
})();
