function loadSoundcloud(id,el){
  var url = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" +
  id +
  "&amp;color=666666&amp;show_artwork=false&amp;auto_play=false" +
  "&amp;hide_related=false&amp;visual=false&amp;show_user=false&amp;show_reposts=false";

  var i = document.createElement("iframe");
  i.src = url;
  i.scrolling = "auto";
  i.frameborder = "0";
  i.width = "100%";
  i.height = "20px";
  $(document.getElementById(el)).append(i);
};

// Check for browser support of event handling capability
// if (window.addEventListener)
// window.addEventListener("load", createIframe, false);
// else if (window.attachEvent)
// window.attachEvent("onload", createIframe);
// else window.onload = createIframe;
