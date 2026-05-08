// ============================================================
//  main.js — JavaScript for Hogwarts & Hogsmeade Website
//  Features: Cart, Quiz, Modals, Newsletter & Hamburger Menu
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  // Always start from the top (home page)
  window.location.hash = "";
  window.scrollTo(0, 0);


  // ----------------------------------------------------------
  // RESTORE SAVED DATA FROM LOCAL STORAGE
  // ----------------------------------------------------------
  // Restore user name / sorting house greeting
  var savedName = localStorage.getItem("userName");
  if (savedName) {
    var greetingSpan = document.querySelector(".user-greeting span");
    if (greetingSpan) {
      greetingSpan.textContent = savedName;
    }
  }

  // Restore sorting house result
  var savedHouse = localStorage.getItem("sortingHouse");
  if (savedHouse && quizForm) {
    var houseNames = { G: "Gryffindor", H: "Hufflepuff", R: "Ravenclaw", S: "Slytherin" };
    var houseEmojis = { G: "🦁", H: "🦡", R: "🦅", S: "🐍" };
    var houseMessages = {
      G: "Brave at heart! You belong in Gryffindor!",
      H: "Loyal and true! Welcome to Hufflepuff!",
      R: "Wit beyond measure! Welcome to Ravenclaw!",
      S: "Cunning and ambitious! Welcome to Slytherin!"
    };
    // Note: quiz result will be displayed after quiz form is set up (section 3)
  }

  // Restore newsletter subscription state
  var isSubscribed = localStorage.getItem("newsletterSubscribed");
  if (isSubscribed === "true") {
    var nlInput = document.querySelector(".newsletter-form input");
    var nlBtn = document.querySelector(".newsletter-form button");
    if (nlInput && nlBtn) {
      nlInput.placeholder = "✅ Already Subscribed!";
      nlInput.disabled = true;
      nlBtn.textContent = "Subscribed ✓";
      nlBtn.disabled = true;
      nlBtn.style.background = "#4ade80";
      nlBtn.style.color = "#0f172a";
    }
  }


  // ----------------------------------------------------------
  // 2. CART SYSTEM — Quantity controls + Add to Cart
  // ----------------------------------------------------------
  // Load saved cart count from localStorage (or start at 0)
  var cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
  var cartDisplay = document.querySelector(".nav-cart");

  // If there are saved cart items, show them immediately
  if (cartCount > 0 && cartDisplay) {
    cartDisplay.textContent = "🧺 Cart (" + cartCount + ")";
  }

  // Plus (+) buttons — increase quantity
  var plusButtons = document.querySelectorAll(".product-card:not(.rec-item) .qty-btn.plus");
  plusButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var qtySpan = btn.parentElement.querySelector(".qty-count");
      var currentQty = parseInt(qtySpan.textContent);
      qtySpan.textContent = currentQty + 1;
    });
  });

  // Minus (−) buttons — decrease quantity (minimum 0)
  var minusButtons = document.querySelectorAll(".product-card:not(.rec-item) .qty-btn.minus");
  minusButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var qtySpan = btn.parentElement.querySelector(".qty-count");
      var currentQty = parseInt(qtySpan.textContent);
      if (currentQty > 0) {
        qtySpan.textContent = currentQty - 1;
      }
    });
  });

  // Add to Cart buttons
  var addToCartButtons = document.querySelectorAll(".product-card:not(.rec-item) .add-to-cart-btn");
  addToCartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Get quantity from the same product card
      var productCard = button.closest(".product-card");
      var qtySpan = productCard.querySelector(".qty-count");
      var qty = parseInt(qtySpan.textContent);

      // Don't add if quantity is 0
      if (qty === 0) {
        alert("Please select at least 1 item using the + button!");
        return;
      }

      // Add to cart total and save to localStorage
      cartCount = cartCount + qty;
      localStorage.setItem("cartCount", cartCount);
      if (cartDisplay) {
        cartDisplay.textContent = "🧺 Cart (" + cartCount + ")";
      }

      // Show "Added!" feedback
      var originalText = button.textContent;
      button.textContent = "✓ Added " + qty + " item(s)!";
      button.style.background = "#4ade80";
      button.style.color = "#0f172a";

      setTimeout(function () {
        button.textContent = originalText;
        button.style.background = "";
        button.style.color = "";
      }, 1500);

      // Reset quantity back to 0
      qtySpan.textContent = "0";
    });
  });


  // ----------------------------------------------------------
  // 3. SORTING CEREMONY QUIZ
  // ----------------------------------------------------------
  var quizForm = document.getElementById("sorting-form");

  if (quizForm) {
    quizForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // House names and messages
      var houseNames = { G: "Gryffindor", H: "Hufflepuff", R: "Ravenclaw", S: "Slytherin" };
      var houseEmojis = { G: "🦁", H: "🦡", R: "🦅", S: "🐍" };
      var houseMessages = {
        G: "Brave at heart! You belong in Gryffindor!",
        H: "Loyal and true! Welcome to Hufflepuff!",
        R: "Wit beyond measure! Welcome to Ravenclaw!",
        S: "Cunning and ambitious! Welcome to Slytherin!"
      };

      // Count votes for each house
      var votes = { G: 0, H: 0, R: 0, S: 0 };
      var answeredCount = 0;

      for (var i = 1; i <= 5; i++) {
        var selected = document.querySelector('input[name="q' + i + '"]:checked');
        if (selected) {
          votes[selected.value] = votes[selected.value] + 1;
          answeredCount++;
        }
      }

      // Need at least 3 answers
      if (answeredCount < 3) {
        alert("🧙 Please answer at least 3 questions!");
        return;
      }

      // Find the house with most votes
      var topHouse = "G";
      var topVotes = 0;

      for (var house in votes) {
        if (votes[house] > topVotes) {
          topVotes = votes[house];
          topHouse = house;
        }
      }

      // Show the result
      var resultName = houseNames[topHouse];
      var resultEmoji = houseEmojis[topHouse];
      var resultMessage = houseMessages[topHouse];

      // Save house result to localStorage
      localStorage.setItem("sortingHouse", topHouse);

      // Remove old result if it exists
      var oldResult = document.getElementById("quiz-result");
      if (oldResult) {
        oldResult.remove();
      }

      // Create result box
      var resultBox = document.createElement("div");
      resultBox.id = "quiz-result";
      resultBox.className = "quiz-result-box";
      resultBox.innerHTML = "<div class='result-emoji'>" + resultEmoji + "</div>" +
        "<h2 class='result-house'>" + resultName + "!</h2>" +
        "<p class='result-message'>" + resultMessage + "</p>" +
        "<button class='retake-btn' id='retake-quiz'>⚡ Retake Quiz</button>";

      quizForm.appendChild(resultBox);

      // Update greeting text and save to localStorage
      var greeting = document.querySelector(".user-greeting span");
      if (greeting) {
        greeting.textContent = resultName + " Student";
        localStorage.setItem("userName", resultName + " Student");
      }

      // Show recommended products for the user's house
      showRecommendedProducts(resultName);

      // Retake Quiz button — clear result and reset radio buttons
      var retakeBtn = document.getElementById("retake-quiz");
      retakeBtn.addEventListener("click", function () {
        resultBox.remove();

        // Uncheck all radio buttons
        var radios = document.querySelectorAll("input[type='radio']");
        radios.forEach(function (radio) {
          radio.checked = false;
        });

        // Reset greeting and clear localStorage
        if (greeting) {
          greeting.textContent = "Witch / Wizard";
        }
        localStorage.removeItem("sortingHouse");
        localStorage.removeItem("userName");

        // Hide recommended section
        var recSection = document.getElementById("recommended");
        if (recSection) {
          recSection.style.display = "none";
        }

        // Scroll back to first question
        var firstQuestion = document.querySelector(".question-item");
        if (firstQuestion) {
          firstQuestion.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }


  // ----------------------------------------------------------
  // 4. MODAL — Close on backdrop click or ESC key
  // ----------------------------------------------------------
  var modals = document.querySelectorAll(".modal");

  modals.forEach(function (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        window.location.hash = "";
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      window.location.hash = "";
    }
  });


  // ----------------------------------------------------------
  // 5. NEWSLETTER — Simple email validation
  // ----------------------------------------------------------
  var newsletterBtn = document.querySelector(".newsletter-form button");
  var newsletterInput = document.querySelector(".newsletter-form input");

  if (newsletterBtn && newsletterInput) {
    newsletterBtn.addEventListener("click", function () {
      var email = newsletterInput.value.trim();

      if (email === "") {
        alert("🦉 Please enter your email first!");
        return;
      }

      if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
        alert("✉️ Please enter a valid email address.");
        return;
      }

      // Show success and save subscription to localStorage
      localStorage.setItem("newsletterSubscribed", "true");
      localStorage.setItem("newsletterEmail", email);
      newsletterInput.value = "";
      newsletterInput.placeholder = "✅ Subscribed!";
      newsletterBtn.textContent = "Subscribed ✓";
      newsletterBtn.disabled = true;
      newsletterBtn.style.background = "#4ade80";
      newsletterBtn.style.color = "#0f172a";

      alert("📜 Welcome to the Daily Prophet, " + email + "!");
    });
  }


  // ----------------------------------------------------------
  // 6. NAVBAR — Shrink on scroll
  // ----------------------------------------------------------
  var navbar = document.querySelector("nav");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 80) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });


  // ----------------------------------------------------------
  // 7. HAMBURGER MENU — Toggle mobile nav
  // ----------------------------------------------------------
  var hamburger = document.querySelector(".hamburger");
  var navLinksContainer = document.querySelector(".nav-links");

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navLinksContainer.classList.toggle("open");
    });

    // Close menu when a link is clicked
    var links = navLinksContainer.querySelectorAll("a");
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        navLinksContainer.classList.remove("open");
      });
    });
  }


  // ----------------------------------------------------------
  // 8. HOUSE CARDS — Show alert & scroll to quiz
  // ----------------------------------------------------------
  var houseCards = document.querySelectorAll(".house-card");

  houseCards.forEach(function (card) {
    card.addEventListener("click", function (event) {
      event.preventDefault();

      var houseName = card.querySelector(".house-name").textContent;
      alert("🏰 " + houseName + " — Take the Sorting Quiz below!");

      var quizSection = document.querySelector("#sorting-ceremony");
      if (quizSection) {
        quizSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });


  // ----------------------------------------------------------
  // 9. BACK TO TOP BUTTON
  // ----------------------------------------------------------
  var backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  // ----------------------------------------------------------
  // 10. SCROLL REVEAL — Show elements when they come in view
  // ----------------------------------------------------------
  var revealElements = document.querySelectorAll(".reveal");

  window.addEventListener("scroll", function () {
    revealElements.forEach(function (el) {
      var elementTop = el.getBoundingClientRect().top;
      var windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 50) {
        el.classList.add("visible");
      }
    });
  });


  // ----------------------------------------------------------
  // 11. FORM VALIDATION — Login & Signup Modals
  // ----------------------------------------------------------
  var forms = document.querySelectorAll(".modal-content form");

  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var inputs = form.querySelectorAll("input[required]");
      var allValid = true;

      inputs.forEach(function (input) {
        if (input.value.trim() === "") {
          allValid = false;
          input.style.boxShadow = "0 0 0 2px #ef4444";
          setTimeout(function () {
            input.style.boxShadow = "";
          }, 2000);
        }
      });

      if (allValid) {
        var nameInput = form.querySelector("input[type='text']");
        var userName = nameInput ? nameInput.value.trim() : "Wizard";
        window.location.hash = "";

        // Save user name to localStorage
        localStorage.setItem("userName", userName);
        alert("🧙 Welcome, " + userName + "! Your magical journey begins.");

        var greeting = document.querySelector(".user-greeting span");
        if (greeting) {
          greeting.textContent = userName;
        }
      }
    });
  });


  // ----------------------------------------------------------
  // 12. SHOW RECOMMENDED PRODUCTS BASED ON HOUSE
  // ----------------------------------------------------------
  function showRecommendedProducts(houseName) {
    var recSection = document.getElementById("recommended");
    var recTitle = document.getElementById("rec-title");
    var allRecItems = document.querySelectorAll(".rec-item");

    // Hide all recommended items first
    allRecItems.forEach(function (item) {
      item.style.display = "none";
    });

    // Show only items matching the user's house
    allRecItems.forEach(function (item) {
      if (item.getAttribute("data-house") === houseName) {
        item.style.display = "";
      }
    });

    // Update title and show section
    if (recTitle) {
      recTitle.textContent = "Recommended for " + houseName;
    }
    if (recSection) {
      recSection.style.display = "";
    }

    // Wire up +/- buttons for recommended items
    var recPlusBtns = recSection.querySelectorAll(".qty-btn.plus");
    recPlusBtns.forEach(function (btn) {
      btn.onclick = function () {
        var qtySpan = btn.parentElement.querySelector(".qty-count");
        var currentQty = parseInt(qtySpan.textContent);
        qtySpan.textContent = currentQty + 1;
      };
    });

    var recMinusBtns = recSection.querySelectorAll(".qty-btn.minus");
    recMinusBtns.forEach(function (btn) {
      btn.onclick = function () {
        var qtySpan = btn.parentElement.querySelector(".qty-count");
        var currentQty = parseInt(qtySpan.textContent);
        if (currentQty > 0) {
          qtySpan.textContent = currentQty - 1;
        }
      };
    });

    // Wire up Add to Cart buttons for recommended items
    var recCartBtns = recSection.querySelectorAll(".add-to-cart-btn");
    recCartBtns.forEach(function (button) {
      button.onclick = function () {
        var productCard = button.closest(".product-card");
        var qtySpan = productCard.querySelector(".qty-count");
        var qty = parseInt(qtySpan.textContent);

        if (qty === 0) {
          alert("Please select at least 1 item using the + button!");
          return;
        }

        cartCount = cartCount + qty;
        localStorage.setItem("cartCount", cartCount);
        if (cartDisplay) {
          cartDisplay.textContent = "🧺 Cart (" + cartCount + ")";
        }

        var originalText = button.textContent;
        button.textContent = "✓ Added " + qty + " item(s)!";
        button.style.background = "#4ade80";
        button.style.color = "#0f172a";

        setTimeout(function () {
          button.textContent = originalText;
          button.style.background = "";
          button.style.color = "";
        }, 1500);

        qtySpan.textContent = "0";
      };
    });

    // Scroll to recommended section
    recSection.scrollIntoView({ behavior: "smooth" });
  }


  // ----------------------------------------------------------
  // 13. HOGWARTS 3D MAP — Location Info Cards
  // ----------------------------------------------------------
  // This object stores info about each Hogwarts location
  // Each key matches the id passed from onclick in HTML
  var locationData = {
    "great-hall": {
      icon: "🏰",
      title: "The Great Hall",
      image: "images/locations/great-hall.png",
      text: "The Great Hall is the main gathering area in Hogwarts Castle. It is used for daily meals, special events, and important announcements. The ceiling is bewitched to look like the sky outside, and the four long house tables run along its length.",
      fact: "⚡ Fun Fact: The Great Hall can seat all students and staff — over 1,000 people!"
    },
    "astronomy": {
      icon: "🔭",
      title: "Astronomy Tower",
      image: "images/locations/astronomy.png",
      text: "The tallest tower in Hogwarts Castle. Astronomy classes are held here at midnight, where students study the stars and planets. It offers the best view of the Hogwarts grounds and surrounding mountains.",
      fact: "⚡ Fun Fact: This is where Dumbledore's final confrontation with Draco took place."
    },
    "quidditch": {
      icon: "🧹",
      title: "Quidditch Pitch",
      image: "images/locations/quidditch.png",
      text: "The Quidditch pitch is an oval-shaped arena surrounded by tall stands for spectators. It is where all Hogwarts Quidditch matches are played. The pitch is located on the opposite side of the castle from the Forbidden Forest.",
      fact: "⚡ Fun Fact: Harry Potter became the youngest Seeker in a century in his first year!"
    },
    "library": {
      icon: "📚",
      title: "Hogwarts Library",
      image: "images/locations/library.png",
      text: "The Hogwarts Library has tens of thousands of books on thousands of shelves. It includes a Restricted Section containing books on dark magic that require special permission to access. Madam Pince is the strict librarian.",
      fact: "⚡ Fun Fact: Hermione Granger spent more time in the library than any other student!"
    },
    "dungeon": {
      icon: "🧪",
      title: "The Dungeons",
      image: "images/locations/dungeon.png",
      text: "Located beneath the castle, the Dungeons house the Potions classroom where Professor Snape (and later Slughorn) taught. The Slytherin common room is also located in the dungeons, beneath the Black Lake.",
      fact: "⚡ Fun Fact: The Dungeons are always cold — even in summer!"
    },
    "forest": {
      icon: "🌲",
      title: "The Forbidden Forest",
      image: "images/locations/forest.png",
      text: "A dark, dense forest on the edge of Hogwarts grounds. It is home to many magical creatures including centaurs, unicorns, thestrals, and giant spiders. Students are forbidden from entering — though some still do.",
      fact: "⚡ Fun Fact: Hagrid frequently visits the forest to care for its creatures."
    },
    "lake": {
      icon: "🌊",
      title: "The Black Lake",
      image: "images/locations/lake.png",
      text: "A large lake on the Hogwarts grounds, home to a giant squid, merpeople, and grindylows. First-year students cross the lake in boats on their very first night at Hogwarts. The second Triwizard Task was held here.",
      fact: "⚡ Fun Fact: The Slytherin common room has windows looking into the lake!"
    },
    "hagrid": {
      icon: "🛖",
      title: "Hagrid's Hut",
      image: "images/locations/hagrid.png",
      text: "A small wooden house on the edge of the Forbidden Forest where Rubeus Hagrid, the Keeper of Keys and Grounds (and later Professor of Care of Magical Creatures), lives with his dog Fang.",
      fact: "⚡ Fun Fact: Hagrid kept a baby dragon named Norbert hidden in his hut!"
    }
  };

  // Make these functions available globally (so onclick in HTML can call them)
  window.showLocationInfo = function (locationId) {
    var data = locationData[locationId];
    if (!data) return;

    // Update the info card content
    document.getElementById("info-icon").textContent = data.icon;
    document.getElementById("info-title").textContent = data.title;
    document.getElementById("info-text").textContent = data.text;
    document.getElementById("info-fact").textContent = data.fact;

    // Update the info card image
    var infoImage = document.getElementById("info-image");
    if (data.image) {
      infoImage.src = data.image;
      infoImage.alt = data.title;
      infoImage.style.display = "block";
    } else {
      infoImage.style.display = "none";
    }

    // Show the info card
    var card = document.getElementById("location-info-card");
    card.style.display = "block";

    // Remove 'active' class from all buttons
    var allBtns = document.querySelectorAll(".location-btn");
    allBtns.forEach(function (btn) {
      btn.classList.remove("active");
    });

    // Add 'active' class to the clicked button
    var clickedBtn = document.getElementById("loc-" + locationId);
    if (clickedBtn) {
      clickedBtn.classList.add("active");
    }

    // Scroll the info card into view
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  window.closeLocationInfo = function () {
    var card = document.getElementById("location-info-card");
    card.style.display = "none";

    // Remove 'active' class from all buttons
    var allBtns = document.querySelectorAll(".location-btn");
    allBtns.forEach(function (btn) {
      btn.classList.remove("active");
    });
  };

}); // end of DOMContentLoaded