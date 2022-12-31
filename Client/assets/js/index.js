(function ($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function (e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function () {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };

    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function (e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function () {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function (e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

})(jQuery); // End of use strict

//Include booster.js
function loadScript(url, type = 'text/javascript') {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = type;
  script.src = url;
  script.defer;
  head.appendChild(script);
}

// On dom load
document.addEventListener('DOMContentLoaded', () => {
  // author badge :)
  var author = '<div style="position: fixed;bottom: 0;right: 20px;background-color: #fff;box-shadow: 0 4px 8px rgba(0,0,0,.05);border-radius: 3px 3px 0 0;font-size: 12px;padding: 5px 10px;">By <a href="https://www.instagram.com/cabrera.evil">@cabrera-evil</a> &nbsp;&bull;&nbsp; <a href="https://www.buymeacoffee.com/cabreraevil">Buy me a Coffee</a></div>';
  $("body").append(author);
  
  // Get token from local storage
  const token = localStorage.getItem('token');
  const admin = document.getElementsByClassName('admin-panel');

  // Select User Name label and update with logged user's data
  if (token) {
    // Set user role
    const role = JSON.parse(localStorage.getItem('user')).role;

    // Redirect to dashboard if we have a token (it's already logged)
    if (window.location.pathname == '/index.html' || window.location.pathname == '/register.html' || window.location.pathname == '/forgot.html') {
      window.location.href = '/../../dashboard.html'
    }

    // Validate if user is admin
    if (window.location.pathname != 'index.html' || window.location.pathname != 'register.html' || window.location.pathname != 'forgot.html') {
      // Display admin panel if user is admin
      if (role == 'ADMIN_ROLE') {
        for(var i = 0; i < admin.length; i++) {
          admin[i].style.display = 'block';
        }
      }
      else {
        for(var i = 0; i < admin.length; i++) {
          admin[i].style.display = 'none';
        }
      }
    }

    // Redirect to dashboard if isn't admin
    if (window.location.pathname == '/admin_users.html' && role != 'ADMIN_ROLE') {
      window.location.href = '/../../dashboard.html';
    }

    // Set user data in header
    const userName = document.getElementById('lbl-username');
    userName.innerText = JSON.parse(localStorage.getItem('user')).name;

    // Import other scripts
    loadScript("/assets/js/Home/header.js");
    loadScript("/assets/js/Home/summary.js");

    // Import other scripts
    if (window.location.pathname == '/subjects.html') {
      loadScript("/assets/js/Components/subjects.js");
    }
    else if (window.location.pathname == '/evaluations.html') {
      loadScript("/assets/js/Components/evaluations.js");
    }
    else if (window.location.pathname == '/admin_users.html') {
      loadScript("/assets/js/Components/users.js");
    }
  }
  // Redirect to login if we don't have a token
  else if (window.location.pathname != '/index.html' && window.location.pathname != '/register.html' && window.location.pathname != '/forgot.html') {
    window.location.href = '/../../index.html';
  }
});