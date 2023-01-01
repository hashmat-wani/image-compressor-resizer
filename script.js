const uploadBox = document.querySelector(".upload-box"),
  fileInput = uploadBox.querySelector("input"),
  previewImg = uploadBox.querySelector("img"),
  widthInput = document.querySelector(".width input"),
  heightInput = document.querySelector(".height input"),
  ratioInput = document.querySelector(".ratio input"),
  qualityInput = document.querySelector(".quality input"),
  downloadBtn = document.querySelector(".download-btn");

let ogImageRatio;

uploadBox.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0]; // getting first user selected file
  if (!file) return; // return if user hasn't selected any file
  previewImg.src = URL.createObjectURL(file); // passing selected file url to preview img src

  previewImg.addEventListener("load", () => {
    // once img loaded
    widthInput.value = previewImg.naturalWidth;
    heightInput.value = previewImg.naturalHeight;
    ogImageRatio = previewImg.naturalWidth / previewImg.naturalHeight;
    document.querySelector(".wrapper").classList.add("active");
  });
});

widthInput.addEventListener("input", () => {
  // getting height according to the ratio checkbox status
  const height = ratioInput.checked
    ? widthInput.value / ogImageRatio
    : heightInput.value;
  heightInput.value = Math.floor(height);
});

heightInput.addEventListener("input", () => {
  // getting width according to the ratio checkbox status
  const width = ratioInput.checked
    ? heightInput.value * ogImageRatio
    : widthInput.value;
  widthInput.value = Math.floor(width);
});

downloadBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const a = document.createElement("a");
  const ctx = canvas.getContext("2d");

  // if quality checkbox is checked, pass 0.5 to imgQuality else pass 1.0
  // 1.0 is 100% quality where 0.5 is 50% of total. you can pass from 0.1 - 1.0
  const imgQuality = qualityInput.checked ? 0.6 : 1.0;

  // setting canvas height & width according to the input values
  canvas.width = widthInput.value;
  canvas.height = heightInput.value;

  // drawing user selected image onto the canvas
  ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);

  // passing canvas data url as href value of <a> element
  a.href = canvas.toDataURL("image/jpeg", imgQuality);
  a.download = new Date().getTime(); // passing current time as download value
  a.click(); // clicking <a> element so the file download
});
