function darken(x) {
  
  x.style.boxShadow="0px 0px 100px black inset"
  x.style.transition = "all 0.25s"
}
function normal(x) {
  x.style.boxShadow="none";
  x.style.transition = "all 0.25s"
}

//filter as you type
function filter(element) {
  var value = $(element).val();

  $("#theList > .masonry-item").each(function() {
      if ($(this).text().search(value) > -1) {
          $(this).show();
      }
      else {
          $(this).hide();
      }
  });
}
