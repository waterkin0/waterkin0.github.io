// document.body.style.overflow = 'hidden';
function loadImage(){
  $("body").getNiceScroll().resize();
}

window.addEventListener("DOMContentLoaded", function() {
  const html            = document.querySelector("html");
  const navBtn          = document.querySelector(".navbar-btn");
  const navList         = document.querySelector(".navbar-list");
  const backToTopFixed  = document.querySelector(".back-to-top-fixed");
  const navigationbar   = document.querySelector(".navbar");
  const back_ground     = document.querySelector(".root-container");
  const headerr         = document.querySelector(".header-content");
  let lastTop           = 0;
  let localtheme        = window.localStorage.getItem('theme') || '';

  localtheme && html.classList.add(localtheme)

  function IsPC(){  
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
    var flag = true;  
    for (var v = 0; v < Agents.length; v++) {  
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
    }  
    return flag;  
  }
  
  // img.addEventListener("load",function() {
  //   $("body").getNiceScroll().resize();
  // });
  
  function endLoading() {
    if(IsPC()){
      setTimeout(function(){
        headerr.classList.add("show");
      },800);
    }
    $("body").niceScroll({
      cursorcolor: "#424242",//滚动条颜色
      cursoropacitymin: 0,//当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
      cursoropacitymax: 0.9,// 当滚动条是显示状态时改变透明度, 值范围 1 到 
      cursorwidth: '1.5vh',//滚动条宽度
      zindex: 999,//滚动条图层
      hwacceleration: true, //激活硬件加速
      // cursorborderradius: "30px", // 滚动条圆角（像素）
    });
    document.body.style.overflow = 'auto';
    document.getElementById('loading-box').classList.add("loaded");
  }
  window.addEventListener('load',endLoading);
  window.setTimeout(function(){
    document.body.style.overflow = 'auto';
    document.getElementById('loading-box').classList.add("loaded");
  },5000);
  
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

  $("a.toc-link").click(function (ev) {
    ev.preventDefault();//阻止其原本行为
    $("html, body").animate({//设置动画
      scrollTop: $(decodeURI($(this).attr("href"))).offset().top - 67//因为我有header长度，所以跳转的地方要低一点
    }, {
      duration: 500,//跳转时间
      easing: "swing"//动画运行方式
    });
  });

  var day = "background-image: url(https://raw.iqiq.io/waterkin0/images/main/blog_base/day.jpg)"
  var night = "background-image: url(https://raw.iqiq.io/waterkin0/images/main/blog_base/night.jpg)"
  if(window.localStorage.getItem('theme') == 'theme-light')
    back_ground.setAttribute("style", day)
  else
    back_ground.setAttribute("style", night)

  // theme light click
  document.querySelector('#theme-light').addEventListener('click', function () {
    html.classList.remove('theme-dark')
    html.classList.add('theme-light')
    back_ground.setAttribute("style", day)
    window.localStorage.setItem('theme', 'theme-light')// 保存本地的光/暗主题，保证跟换页面时主题不变
  })

  // theme dark click
  document.querySelector('#theme-dark').addEventListener('click', function () {
    html.classList.remove('theme-light')
    html.classList.add('theme-dark')
    back_ground.setAttribute("style", night)
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