const uploadBox = document.querySelector(".upload-box"),
  fileInput = uploadBox.querySelector("input"),
  previewImg = uploadBox.querySelector(".preview"),
  logo = uploadBox.querySelector(".logo"),
  widthInput = document.querySelector(".width input"),
  heightInput = document.querySelector(".height input"),
  ratioInput = document.querySelector(".ratio input"),
  qualityInput = document.querySelector(".quality input"),
  downloadBtn = document.querySelector(".download-btn"),
  currentSize = document.querySelector(".current .file_size"),
  currentPixels = document.querySelector(".current .pixels"),
  newSize = document.querySelector(".new .file_size"),
  newPixels = document.querySelector(".new .pixels"),
  quality_range = document.querySelector("#quality_range"),
  quality_value = document.querySelector("#quality_value"),
  fileType = document.querySelector("#file_type"),
  currFileType = document.querySelector(".current .type"),
  newFileType = document.querySelector(".new .type"),
  helperText = document.querySelector(".helperText"),
  removeIcon = document.querySelector(".upload-box span");

let canvas, imgQuality, ogImageRatio, mimeType;

uploadBox.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0]; // getting first user selected file
  if (!file) return; // return if user hasn't selected any file
  previewImg.src = URL.createObjectURL(file); // passing selected file url to preview img src

  previewImg.addEventListener("load", () => {
    logo.style.display = "none";
    currentSize.textContent = readableBytes(file.size);
    currentPixels.textContent = `${previewImg.naturalWidth} x ${previewImg.naturalHeight} pixels`;
    mimeType = file.type.split("/")[1] === "jpeg" ? "jpg" : "png";
    changeImageType();
    currFileType.textContent = `.${mimeType}`;
    widthInput.value = previewImg.naturalWidth;
    heightInput.value = previewImg.naturalHeight;
    ogImageRatio = previewImg.naturalWidth / previewImg.naturalHeight;
    document.querySelector(".wrapper").classList.add("active");
    changePixels();
  });
});

widthInput.addEventListener("input", (e) => {
  const height = ratioInput.checked
    ? widthInput.value / ogImageRatio
    : heightInput.value;
  heightInput.value = Math.floor(height);
  debounce(changePixels);
});

heightInput.addEventListener("input", (e) => {
  const width = ratioInput.checked
    ? heightInput.value * ogImageRatio
    : widthInput.value;
  widthInput.value = Math.floor(width);

  debounce(changePixels);
});

downloadBtn.addEventListener("click", () => {
  // downloadBtn.innerText = "Downloading file...";
  const a = document.createElement("a");

  // passing canvas data url as href value of <a> element
  let url = canvas.toDataURL(
    `image/${mimeType === "jpg" ? "jpeg" : mimeType}`,
    imgQuality
  );
  a.href = url;
  a.download = new Date().getTime(); // passing current time as download value
  // document.body.appendChild(a);
  a.click(); // clicking <a> element so the file download
  // downloadBtn.innerText = "Download";
  // a.remove();
});

function changePixels() {
  if (
    !Number(widthInput.value) ||
    !Number(heightInput.value) ||
    widthInput.value.length > 4 ||
    heightInput.value.length > 4
  ) {
    validation();
  } else {
    removeValidation();
    newPixels.textContent = `${widthInput.value} x ${heightInput.value} pixels`;

    canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // if quality checkbox is checked, pass 0.5 to imgQuality else pass 1.0
    // 1.0 is 100% quality where 0.5 is 50% of total. you can pass from 0.1 - 1.0
    // setting canvas height & width according to the input values
    canvas.width = widthInput.value;
    canvas.height = heightInput.value;

    // drawing user selected image onto the canvas
    ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
    newSize.textContent = "";
    newSize.classList.add("loader");
    downloadBtn.textContent = "Calculating...";
    downloadBtn.style.background = "#afafaf";
    downloadBtn.disabled = true;
    downloadBtn.style.cursor = "none";

    canvas.toBlob(
      (blob) => {
        newSize.classList.remove("loader");
        downloadBtn.textContent = "Download";
        downloadBtn.style.background = "#927dfc";
        downloadBtn.disabled = false;
        downloadBtn.style.cursor = "pointer";

        newSize.textContent = readableBytes(blob?.size);
      },
      `image/${mimeType === "jpg" ? "jpeg" : mimeType}`,
      imgQuality
    );
  }
}

function readableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

quality_range.addEventListener("input", changeQualityRange);

fileType.addEventListener("change", (e) => {
  mimeType = e.target.value;
  changeImageType();
});

async function changeQualityRange(e) {
  let value = e?.target.value || quality_range.value;
  quality_value.textContent = `Quality: ${value}% (${
    value > 79 ? "High" : value > 49 ? "Medium" : "Low"
  })`;
  imgQuality = value / 100;
  debounce(changePixels);
}

function changeImageType() {
  if (mimeType === "png") {
    quality_range.value = 100;
    quality_range.disabled = true;
    quality_value.style.color = "#afafaf";
    helperText.style.display = "block";
  } else {
    quality_range.value = 80;
    quality_range.disabled = false;
    quality_value.style.color = "black";
    helperText.style.display = "none";
  }
  changeQualityRange();
  fileType.value = mimeType;
  newFileType.textContent = `.${mimeType}`;
}

removeIcon.addEventListener("click", (e) => {
  document.querySelector(".wrapper").classList.remove("active");
  previewImg.src = null;
  logo.style.display = "block";
  e.stopPropagation();
});

let debounceId;
function debounce(cb) {
  debounceId && clearTimeout(debounceId);
  debounceId = setTimeout(cb, 500);
}

function validation() {
  document.querySelector(".validation").style.display = "block";
}

function removeValidation() {
  document.querySelector(".validation").style.display = "none";
}
