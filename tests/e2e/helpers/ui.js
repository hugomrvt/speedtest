function startButton(page) {
  return page.locator("#start-button");
}

function brand(page) {
  return page.locator(".logo");
}

module.exports = {
  startButton,
  brand
};
