// Init Function for when window loads.
$(document).ready(function(){
  var webview = document.getElementById("adcall1");

  // For the webview call, which only works on the desktop, force the user 
  // agent to be an android handset
  try {
    webview.setUserAgentOverride("Mozilla/5.0 (Linux; U; Android 2.2; en-us; DROID2 GLOBAL Build/S273) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533");
  }
  catch (err) {
    // no-op - on the mobile device, the webview object doesn't have the 
    // method as it isn't supported..
  }

  // Force an ad call for the XHR section
  loadAdThroughXHR();

  // Add a message handler to receive content from the sandbox page
  window.addEventListener("message", receiveMessageFromSandbox, false);

  // Add a handler for the close button for the sandbox page
  $('#close').click(function(){
      $('#landingpage').slideToggle('slow');
      $('#close').hide();
  });
});

// Functions to load ads through XHR

function loadAdThroughXHR() {

    var url = 'http://a.jumptap.com/a/ads?f=xhtml&mt-tt=ri&v=v3050&pub=po&q=hackmatch&site=po_proxytest_wap_site&spot=po_proxytest_wap_site_banner&template=iphone';

    $('#adContent').html('');
    $.ajax({
        url: url,
        context: document.body
    }).done(function (response) {
            var adContent = response.replace('a href', 'a target="_blank" href');

            // Add id and alt to banner tag
            adContent = adContent.replace('img src="http://i',
                'img alt="Loading..." class="creative" id="bannerImg" src="http://i');

            // Add id 1x1 pixel tag
            adContent = adContent.replace('img src="http://pixel',
                'img id="pixelImg" src="http://i');

            // Load the content.  The images will probably fail
            $('#adContent').html(adContent);

            // Go fetch the images.
            chrome.runtime.getPlatformInfo(function (platformInfo) {
                if (platformInfo.os != 'cordova-ios') {
                    getImageContent('#bannerImg');
                    getImageContent('#pixelImg');
                }
            });
        });
}

function getImageContent(imgId) {
    var url = $(imgId).attr('src');
    if (!url)
        return;
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url, true);

    // Must include this line - specifies the response type we want
    xmlHTTP.responseType = 'arraybuffer';

    xmlHTTP.onload = function (e) {

        var arr = new Uint8Array(this.response);

        // Convert the int array to a binary string
        // We have to use apply() as we are converting an *array*
        // and String.fromCharCode() takes one or more single values, not
        // an array.
        var raw = String.fromCharCode.apply(null, arr);
        var b64 = btoa(raw);
        var dataURL = "data:image/jpeg;base64," + b64;
        $(imgId).attr('src', dataURL);
    };

    xmlHTTP.send();
}

// Utility Function to handle messages from the sandbox ad page.
function receiveMessageFromSandbox(event) {
    document.getElementById('landingpage').contentWindow.postMessage(event.data,'*');
    $('#close').show();
    $('#landingpage').slideToggle('slow');
}
