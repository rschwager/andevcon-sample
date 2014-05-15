// Init Function for when window loads.
$(document).ready(function(){
  // Load an ad
  loadAdThroughXHR();

});

function loadAdThroughXHR() {

    var url = 'http://a.jumptap.com/a/ads?f=xhtml&mt-tt=ri&v=v3050&pub=po&q=hackmatch&site=po_proxytest_wap_site&spot=po_proxytest_wap_site_banner';

    $('#adContent').html('');
    $.ajax({
        url: url,
        context: document.body
    }).done(function (response) {
            // Load the content.
            $('#adContent').html(response);

            // Add a handler to handle the click through the parent
            var anchor = document.getElementsByTagName('a')[0];
              anchor.onclick = function(){
                window.parent.postMessage(anchor.getAttribute('href'),'*');
                return false;
            };
        });
}
