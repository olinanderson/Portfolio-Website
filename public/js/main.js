(function ($) {
  "use strict";
  // Navbar
  const nav = $("nav");
  const navHeight = nav.outerHeight();

  // Canvas ------------------------------
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particlesArray;

  var particleColor1 = "#eb4034";
  var particleColor2 = "#2ed9bc";
  var particleColor3 = "#2b2bd9";
  var rgbValues = "38, 38, 38";
  var scrollHeight = 0;
  var fillValue = 0;

  var mouseSize = 120;

  // Get mouse position
  let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / mouseSize) * (canvas.width / mouseSize),
  };

  window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y + scrollHeight;
  });

  // Create particle
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    // Drawing individual particles
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    // check particle position, check mouse position, move the particle, draw the particle
    update() {
      // check if the particle is still within the canvas
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // check collision detection - mouse position / particle position
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      let collision = distance < mouse.radius + this.size;

      if (collision) {
        var normalX = -dx / distance;
        var normalY = -dy / distance;

        const dot = this.directionX * normalX + this.directionY * normalY;

        this.directionX = this.directionX - 2 * dot * normalX;
        this.directionY = this.directionY - 2 * dot * normalY;

        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
          this.x += 10;
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
          this.x -= 10;
        }
        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
          this.y += 10;
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
          this.y -= 10;
        }
      }

      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  // Connect lines to each particle
  const connect = () => {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = 0; b < particlesArray.length; b++) {
        let distance =
          (particlesArray[a].x - particlesArray[b].x) *
            (particlesArray[a].x - particlesArray[b].x) +
          (particlesArray[a].y - particlesArray[b].y) *
            (particlesArray[a].y - particlesArray[b].y);

        if (distance < (canvas.width / 7) * (canvas.height / 7)) {
          opacityValue = 1 - distance / 20000;
          ctx.strokeStyle = "rgba(" + rgbValues + ", " + opacityValue + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  };

  // create particle array
  const init = () => {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 10000;
    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 3 + 1;
      let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
      let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
      let directionX = (Math.random() + -Math.random()) / 2; // Random number between -1 and 1
      let directionY = (Math.random() + -Math.random()) / 2;
      console.log("directionX:", directionX);
      console.log("directionY:", directionY);
      fillValue = Math.random();
      if (fillValue <= 1 / 3) {
        particlesArray.push(
          new Particle(x, y, directionX, directionY, size, particleColor1)
        );
      }
      if (fillValue > 1 / 3 && fillValue < 2 / 3) {
        particlesArray.push(
          new Particle(x, y, directionX, directionY, size, particleColor2)
        );
      }
      if (fillValue >= 2 / 3) {
        particlesArray.push(
          new Particle(x, y, directionX, directionY, size, particleColor3)
        );
      }
    }
  };

  // animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }

    connect();
  };

  // resize event
  window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = (canvas.height / mouseSize) * (canvas.height / mouseSize);
    init();
  });

  // mouse out event
  window.addEventListener("mouseout", () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  init();
  animate();

  // Form logic
  var loading = false;

  const form = document.getElementById("contact-form");

  const sendMail = async (mail) => {
    //1.
    fetch(window.location.origin + "/send", {
      method: "post", //2.
      body: mail, //3.
    }) // Handle success
      .then((response) => response.json()) // convert to json
      .then((json) => {
        $("#contact").html("<h3>" + json.message + "</h3>");
      }) //print data to console
      .catch((err) => console.log("Request Failed", err)); // Catch errors
  };

  const formEvent = form.addEventListener("submit", (e) => {
    loading = true;
    LoadingDots();

    e.preventDefault();

    let mail = new FormData(form);

    sendMail(mail);
  });

  const LoadingDots = () => {
    if (loading) {
      $("#contact").html("<h3 id='loading'>Loading</h3>");
      setInterval(() => {
        $("#loading").append(".");
        i++;

        if (i == 4) {
          $("#loading").html(originalText);
          i = 0;
        }
      }, 500);
    }
  };

  $(".navbar-toggler").on("click", function () {
    if (!$("#mainNav").hasClass("navbar-reduce")) {
      $("#mainNav").addClass("navbar-reduce");
    }
  });

  // Preloader
  $(window).on("load", function () {
    if ($("#preloader").length) {
      $("#preloader")
        .delay(100)
        .fadeOut("slow", function () {
          $(this).remove();
        });
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  /*--/ Star ScrollTop /--*/
  $(".scrolltop-mf").on("click", function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      1000
    );
  });

  /*--/ Star Counter /--*/
  $(".counter").counterUp({
    delay: 15,
    time: 2000,
  });

  /*--/ Star Scrolling nav /--*/
  $('a.js-scroll[href*="#"]:not([href="#"])').on("click", function () {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        $("html, body").animate(
          {
            scrollTop: target.offset().top - navHeight + 5,
          },
          1000,
          "easeInOutExpo"
        );
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $(".js-scroll").on("click", function () {
    $(".navbar-collapse").collapse("hide");
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $("body").scrollspy({
    target: "#mainNav",
    offset: navHeight,
  });
  /*--/ End Scrolling nav /--*/

  /*--/ Navbar Menu Reduce /--*/
  $(window).trigger("scroll");
  $(window).on("scroll", function () {
    var pixels = 50;
    var top = mouseSize;
    scrollHeight = $(window).scrollTop();

    if ($(window).scrollTop() > pixels) {
      $(".navbar-expand-md").addClass("navbar-reduce");
      $(".navbar-expand-md").removeClass("navbar-trans");
    } else {
      $(".navbar-expand-md").addClass("navbar-trans");
      $(".navbar-expand-md").removeClass("navbar-reduce");
    }
    if ($(window).scrollTop() > top) {
      $(".scrolltop-mf").fadeIn(1000, "easeInOutExpo");
    } else {
      $(".scrolltop-mf").fadeOut(1000, "easeInOutExpo");
    }
  });

  /*--/ Star Typed /--*/
  if ($(".text-slider").length == 1) {
    var typed_strings = $(".text-slider-items").text();
    var typed = new Typed(".text-slider", {
      strings: typed_strings.split(","),
      typeSpeed: 80,
      loop: true,
      backDelay: 1100,
      backSpeed: 30,
    });
  }

  /*--/ Testimonials owl /--*/
  $("#testimonial-mf").owlCarousel({
    margin: 20,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
    },
  });

  // Portfolio Description
  $(".work-box").on("click", () => {
    console.log("clicked on the work box");
  });

  // Title animation
  var titleString = "</>----------------------------------";
  setInterval(() => {
    titleString =
      titleString[titleString.length - 1] + titleString.slice(0, -1);

    // $("#title").html(titleString);
  }, 500);
})(jQuery);
