;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-checkbox" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M511.676635 63.939241c-247.276826 0-447.735347 200.461591-447.735347 447.738417 0 247.279896 200.458521 447.740464 447.735347 447.740464 247.281943 0 447.741487-200.459544 447.741487-447.740464C959.418123 264.400832 758.958578 63.939241 511.676635 63.939241zM415.313937 731.573881l-52.448536-52.446489-0.347924 0.344854L221.806735 538.76355l52.768831-52.765761 140.393517 140.390447L748.953713 292.402583l52.766784 52.768831L415.313937 731.573881z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-checkbox1" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M512 72.064c242.688 0 439.936 197.376 439.936 439.936 0 242.624-197.248 440-439.936 440-242.624 0-439.936-197.376-439.936-440S269.312 72.064 512 72.064M512 32C246.912 32 32 246.912 32 512c0 265.024 214.912 480 480 480 265.024 0 480-214.976 480-480C992 246.912 777.024 32 512 32L512 32z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)