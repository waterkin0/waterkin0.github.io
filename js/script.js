window.addEventListener("DOMContentLoaded", function() {
  const html            = document.querySelector("html");
  const navBtn          = document.querySelector(".navbar-btn");
  const navList         = document.querySelector(".navbar-list");
  const backToTopFixed  = document.querySelector(".back-to-top-fixed");
  const navigationbar   = document.querySelector(".navbar");
  const back_ground     = document.querySelector(".root-container");
  let lastTop           = 0;
  let theme             = window.localStorage.getItem('theme') || '';

  theme && html.classList.add(theme)

  if(window.localStorage.getItem('theme') == 'theme-dark')
    back_ground.setAttribute("style","background-image: url(https://s2.loli.net/2022/07/13/8OEKadVl4wY3omH.jpg)")
  else
    back_ground.setAttribute("style","background-image: url(https://s2.loli.net/2022/07/06/qDeLO1IijPA3EbC.jpg)")
  

  const goScrollTop = () => {
    let currentTop = getScrollTop()
    let speed = Math.floor(-currentTop / 10)
    if (currentTop > lastTop) {
      return lastTop = 0
    }
    let distance = currentTop + speed;
    lastTop = distance;
    document.documentElement.scrollTop = distance;
    distance > 0 && window.requestAnimationFrame(goScrollTop)
  }

  const Navigationbar = (top) => {
    let Top = top || getScrollTop()
    if (Top >= 100) {
      navigationbar.classList.add("show")
    } else {
      navigationbar.classList.remove("show")
    }
  }

  const toggleBackToTopBtn = (top) => {
    let Top = top || getScrollTop()
    if (Top >= 460) {          //460是banner的高度
      backToTopFixed.classList.add("show")
    } else {
      backToTopFixed.classList.remove("show")
    }
  }

  // theme light click
  document.querySelector('#theme-light').addEventListener('click', function () {
    html.classList.remove('theme-dark')
    html.classList.add('theme-light')
    back_ground.setAttribute("style","background-image: url(https://s2.loli.net/2022/07/06/qDeLO1IijPA3EbC.jpg)")
    window.localStorage.setItem('theme', 'theme-light')// 保存本地的光/暗主题，保证跟换页面时主题不变
  })

  // theme dark click
  document.querySelector('#theme-dark').addEventListener('click', function () {
    html.classList.remove('theme-light')
    html.classList.add('theme-dark')
    back_ground.setAttribute("style","background-image: url(https://s2.loli.net/2022/07/13/8OEKadVl4wY3omH.jpg)")
    window.localStorage.setItem('theme', 'theme-dark')
  })

  // // theme auto click
  // document.querySelector('#theme-auto').addEventListener('click', function() {
  //   html.classList.remove('theme-light')
  //   html.classList.remove('theme-dark')
  //   window.localStorage.setItem('theme', '')
  // })

  // mobile nav click
  navBtn.addEventListener("click", function () {
    html.classList.toggle("show-mobile-nav");
    this.classList.toggle("active");
  });

  // mobile nav link click
  navList.addEventListener("click", function (e) {
    if (e.target.nodeName == "A" && html.classList.contains("show-mobile-nav")) {
      navBtn.click()
    }
  })

  // click back to top
  backToTopFixed.addEventListener("click", function () {
    lastTop = getScrollTop()
    goScrollTop()
  });

  window.addEventListener("scroll", function () {
    Navigationbar()
  }, { passive: true });

  window.addEventListener("scroll", function () {
    toggleBackToTopBtn()
  }, { passive: true });

  /** handle lazy bg iamge */
  handleLazyBG();
});

/**
 * 获取当前滚动条距离顶部高度
 *
 * @returns 距离高度
 */
function getScrollTop () {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
}

function querySelectorArrs (selector) {
  return Array.from(document.querySelectorAll(selector))
}


function handleLazyBG () {
  const lazyBackgrounds = querySelectorArrs('[background-image-lazy]')
  let lazyBackgroundsCount = lazyBackgrounds.length
  if (lazyBackgroundsCount > 0) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function({ isIntersecting, target }) {
        if (isIntersecting) {
          let img = target.dataset.img
          if (img) {
            target.style.backgroundImage = `url(${img})`
          }
          lazyBackgroundObserver.unobserve(target)
          lazyBackgroundsCount --
        }
        if (lazyBackgroundsCount <= 0) {
          lazyBackgroundObserver.disconnect()
        }
      })
    })

    lazyBackgrounds.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground)
    })
  }
}