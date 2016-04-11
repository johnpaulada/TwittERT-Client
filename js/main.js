(function() {

    var handler     = document.getElementById('handle');
    var counter     = document.getElementById('count');
    var requester   = document.getElementById('request');
    var progressBar = document.getElementById('bar');
    var textArea    = document.getElementById('texto');

    requester.addEventListener("click", function(){
        progressBar.style.display = "block";
        textArea.value = '';
        getTweets(handler.value, parseInt(counter.value));
    });

    /**
     * Get Tweets.
     *
     * @param {string} Twitter handle/username
     * @param {string} tweet count
     *
     * @returns {undefined}
     */
    function getTweets(handle, count) {
        makeRequest('http://localhost:8000/tweets?handle=' + handle + '&count=' + count, function(json) {
            var main = document.getElementById('main');

            main.innerHTML = '<br>Tweets Retrieved: ' + json.tweets.length + '<br><br>';

            json.tweets.forEach(function(element, index, array) {
                textArea.value += element.text + "\n";
                progressBar.setAttribute('value', (0.5 + index / array.length) + '');
            });

            progressBar.style.display = "none";
        }, function() {
            console.log('You suck.');
        });
    }

    /**
     * Make request using fetch.
     *
     * @param {string}   url
     * @param {Function} success function
     * @param {Function} fail function
     *
     * @returns {undefined}
     */
    function makeRequest(url, success, fail) {
        var myHeaders = new Headers();

        var initializer = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };

        var myRequest = new Request(url, initializer);

        fetch(myRequest).then(function(response) {
            var contentType = response.headers.get("content-type");

            if(contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(success);
            } else {
                fail();
            }
        });
    }

})();