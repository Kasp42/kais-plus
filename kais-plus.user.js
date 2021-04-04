// ==UserScript==
// @name         Kais+
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://kais-shop.ru/*
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL  https://raw.githubusercontent.com/Kasp42/kais-plus/main/kais-plus.user.js
// @updateURL    https://raw.githubusercontent.com/Kasp42/kais-plus/main/kais-plus.user.js
// ==/UserScript==

(function() {
  'use strict';

  if($('.catalog-element-wrapper').length)
  {
    var jq_article = $('.catalog-element-article');
    jq_article.append('<div class="js-img-button-container"></div>');

    var s_article = jq_article.find('.catalog-element-article-value').text().trim();
    var jq_img_container = $('.js-img-button-container');
    var a_image = [];
    $('.catalog-element-gallery-pictures a[data-src]').each(function(i_img)
    {
      var jq_this = $(this);
      var jq_img = jq_this.find('img[role="presentation"]');
      var jq_button = $('<button data-name="'+s_article+'--'+(i_img+1)+'.png">IMG '+(i_img+1)+'</button>')
      if(jq_img.length === 0)
      {
        checkElement(jq_this,'img[role="presentation"]').then((element) => {
          var jq_img = jq_this.find('img[role="presentation"]');
          jq_button.data('img',getBase64Image(jq_img.get(0)));
        });
      }
      else
      {
        jq_button.data('img',getBase64Image(jq_img.get(0)));
      }
      jq_button.on('click',function()
      {
        var s_img = $(this).data('img');
        if(s_img)
        {
          var a = document.createElement("a");
          a.href = "data:image/png;base64," + s_img;
          a.download = $(this).data('name');
          a.click();
        }
        else
        {
          alert('NO IMG');
        }
      });
      jq_img_container.append(jq_button);
    });

    $('.catalog-element-purchase-counter-control input').val(1000).trigger('change');
  }
  else
  {
    var a_item_list = [];
    var jq_item_list = $('.catalog-section-item');
    jq_item_list.each(function()
    {
      var jq_this = $(this);
      var jq_name = jq_this.find('.catalog-section-item-name');
      var a_name = jq_name.text().trim().split(' Арт: ');
      var s_article = a_name[0].trim();
      jq_this.find('.catalog-section-item-base').append('<div class="js-img-button-container"></div>');
      var jq_img_container = jq_this.find('.js-img-button-container');
      jq_this.find('.catalog-section-item-image-block .catalog-section-item-image-wrapper img').each(function(i_img)
      {
        var jq_this_img = $(this);
        var jq_button = $('<button data-name="'+s_article+'--'+(i_img+1)+'.png">IMG '+(i_img+1)+'</button>');
        if(jq_this_img.filter('[src$=".svg"]').length > 0)
        {
          jq_button.data('img',jq_this_img.data('original').replace('/resize_cache','').replace('/450_450_0',''));
        }
        else
        {
          jq_button.data('img',s_img);
        }
        jq_button.on('click',function()
        {
          var jq_button_this = $(this);
          var s_img = jq_button_this.data('img');
          if(s_img)
          {
            toDataURL(jq_this_img.attr('src').replace('/resize_cache','').replace('/450_450_0',''),function(s_img)
            {
              var a = document.createElement("a");
              a.href = "data:image/png;base64," + s_img;
              a.download = jq_button_this.data('name');
              a.click();
            });
          }
          else
          {
            alert('NO IMG');
          }
        });

        jq_img_container.append(jq_button);
      });

      $('.catalog-section-item-counter-block input').val(1000).trigger('change');
    });
  }
})();

function rafAsync() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve); //faster than set time out
  });
}

function checkElement(jq_base,s_selector) {
  if (jq_base.find(s_selector).length === 0) {
    return rafAsync().then(() => checkElement(jq_base,s_selector));
  } else {
    return Promise.resolve(true);
  }
}

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function toDataURL(src, callback) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL('image/png');
    callback(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}
