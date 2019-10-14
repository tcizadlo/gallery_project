var resizeId;
window.addEventListener('resize', function() {
  clearTimeout(resizeId);
  resizeId = setTimeout(doneResizing, 500);
});

function doneResizing() {
  whenScreenSizeChanged();
}
function whenScreenSizeChanged() {
  var x = window.innerWidth;
  x = x - window.innerWidth / 10;
  //console.log(window.innerWidth+", "+ x);
  console.log('x: ' + window.innerWidth + ', ' + x);
  // document.getElementById("galleryArea").innerHTML = img_gallery_tile_flex("medium");
  // calculate_image_rows(x, 270);

  galleryHeight = calculate_image_rows(x, 200);
  console.log('gallery size:  ' + x + ' X ' + galleryHeight);
  document.getElementById('galleryArea').innerHTML = img_gallery_grid();
}
var galleryHTML = '';

function img_gallery_grid_origial() {
  sum_width = 0;
  galleryRowPosition = 0;
  galleryHTML = '<div class="row_' + galleryRowArray[0] + ' galleryRow">'; // initialise first row of images
  for (i = 0; i < galleryItems.length; i++) {
    if (i > 0) {
      if (galleryRowArray[i - 1] != galleryRowArray[i]) {
        galleryHTML +=
          '<div class="row_' + galleryRowArray[i] + ' galleryRow">'; // new
      }
    }
    galleryHTML +=
      ' <div class="galleryRowItem box_' +
      i +
      '"  style="padding: 10px; width: ' +
      galleryItems[i].width * galleryScaleArray[i] +
      'px;">';
    galleryHTML +=
      '  <a href="' +
      galleryItems[i].src +
      '" class="photo-item" data-fancybox="gallery" data-caption="' +
      galleryItems[i].title +
      '">';
    galleryHTML +=
      '   <img src="' +
      galleryItems[i].msrc +
      '" alt="Image" class="img-fluid" style="height: ' +
      galleryItems[i].height * galleryScaleArray[i] +
      'px;">';
    galleryHTML += '   <div class="photo-text-more">';
    galleryHTML +=
      '       <h3 class="heading" style="background-color: rgba(0, 0, 0, 0.6);">' +
      galleryItems[i].title +
      '</h3>';
    galleryHTML += '      <span class="icon icon-search"></span>';
    galleryHTML += '    </div>';
    galleryHTML += '  </a>';
    galleryHTML += '  </div>';
    sum_width += galleryItems[i].width * galleryScaleArray[i];
    if (galleryRowArray[i] != galleryRowArray[i + 1]) {
      galleryHTML += ' </div>'; // close off the row div
      sum_width = 0; // reset the width for new row
      //galleryRowPosition += galleryItems[i].height*galleryScaleArray[i];
    }
  }
  return galleryHTML;
}

function img_gallery_grid() {
  sum_width = 0;
  galleryRowPosition = 0;
  galleryHTML = '<div class="row_' + galleryRowArray[0] + ' galleryRow">'; // initialise first row of images
  for (i = 0; i < galleryItems.length; i++) {
    if (i > 0) {
      if (galleryRowArray[i - 1] != galleryRowArray[i]) {
        galleryHTML +=
          '<div class="row_' + galleryRowArray[i] + ' galleryRow">'; // new
      }
    }
    galleryHTML +=
      ' <div class="galleryRowItem box_' +
      i +
      '"  width: ' +
      galleryItems[i].width * galleryScaleArray[i] +
      'px;">';
    galleryHTML +=
      '  <a href="' +
      galleryItems[i].src +
      '" class="photo-item" data-fancybox="gallery" data-caption="' +
      galleryItems[i].title +
      '">';
    galleryHTML +=
      '   <img src="' +
      galleryItems[i].msrc +
      '" alt="Image" class="img-fluid" style="height: ' +
      galleryItems[i].height * galleryScaleArray[i] +
      'px;">';
    galleryHTML += '   <div class="photo-text-more">';
    galleryHTML +=
      '       <h3 class="heading" style="background-color: rgba(0, 0, 0, 0.6);">' +
      galleryItems[i].title +
      '</h3>';
    // galleryHTML += '      <span class="icon icon-search"></span>';
    galleryHTML += '    </div>';
    galleryHTML += '  </a>';
    galleryHTML += '  </div>';
    sum_width += galleryItems[i].width * galleryScaleArray[i];
    if (galleryRowArray[i] != galleryRowArray[i + 1]) {
      galleryHTML += ' </div>'; // close off the row div
      sum_width = 0; // reset the width for new row
      //galleryRowPosition += galleryItems[i].height*galleryScaleArray[i];
    }
  }
  return galleryHTML;
}

galleryRowArray = new Array(galleryItems.length);
galleryScaleArray = new Array(galleryItems.length);

var imageGap = 4; // matches the "mysterious 4px gap between images" padding for individual image boxes

function calculate_image_rows(row_width_target, image_height_target) {
  var row_width_sum = 0;
  var current_row = 0;
  var number_images_in_row = 0;
  var next_i = 0;
  var hackVar = 0;
  var totalGalleryHeight = 0;
  if (row_width_target < 600) {
    //for small screens
    image_height_target = image_height_target / 2;
  }

  for (i = 0; i < galleryItems.length; i++) {
    imgScale = 1 / galleryItems[i].height;
    galleryItems[i].height *= imgScale;
    galleryItems[i].width *= imgScale;
    scaled_width = galleryItems[i].width * image_height_target;
    if ((scaled_width + 20) / 2 > row_width_target) {
      //for small screens * wide thumbnail images
      scaled_width = (galleryItems[i].width * image_height_target) / 2;
    }
    row_width_sum += scaled_width;
    number_images_in_row += 1;
    //console.log("i= "+i+" sum= "+row_width_sum);
    if (row_width_sum >= row_width_target) {
      under_guess = row_width_sum - row_width_target - scaled_width;
      over_guess = row_width_sum - row_width_target;
      //console.log(over_guess + ", " + under_guess);
      if (over_guess + under_guess > 0) {
        //under_guess was closer
        //console.log("lower");
        next_i = -1; // need to back up i loop to pick up image not used
        number_images_in_row -= 1;
        row_scale =
          (row_width_target - (number_images_in_row - 1) * imageGap) /
          (row_width_sum - scaled_width);
        extra_image = 0;
      } else {
        //console.log("higher");
        row_scale =
          (row_width_target - (number_images_in_row - 1) * imageGap) /
          row_width_sum;
        next_i = 0;
        extra_image = 1;
      }
      //console.log("i= "+i+" number_images_in_row= "+ number_images_in_row + " next_i= " + next_i);
      for (
        j = i - number_images_in_row + extra_image;
        j < i + extra_image;
        j++
      ) {
        //console.log(j + ":  " + number_images_in_row  + ":  " + galleryItems[j].width);
        //galleryItems[j].width *= row_scale;
        //galleryItems[j].height *= row_scale;
        galleryRowArray[j] = current_row;
        galleryScaleArray[j] = row_scale * image_height_target;
      }
      //console.log(number_images_in_row+", "+row_width_sum);
      number_images_in_row = 0;
      current_row += 1;
      row_width_sum = 0;
      i = i + next_i;
      totalGalleryHeight += row_scale * image_height_target + imageGap;
      continue;
    } else if (i == galleryItems.length - 1) {
      //last (partial) row
      for (j = i - number_images_in_row + 1; j <= i; j++) {
        //console.log(j + ":  " + number_images_in_row);
        //console.log(galleryItems[j].msrc);
        //galleryItems[j].width *= row_scale;
        //galleryItems[j].height *= row_scale;
        galleryRowArray[j] = current_row;
        galleryScaleArray[j] = image_height_target;
      }
      totalGalleryHeight += image_height_target + imageGap;
    }
  }
  //console.log(galleryRowArray);
  //console.log(galleryScaleArray);
  return totalGalleryHeight;
}
