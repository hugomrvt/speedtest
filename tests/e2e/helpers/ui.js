function modernStartButton(page) {
  return page.locator("#start-button");
}

function classicStartButton(page) {
  return page.locator("#startStopBtn");
}

function neoStartButton(page) {
  return page.locator("#start-button");
}

function neoBrand(page) {
  return page.locator(".brand");
}

module.exports = {
  modernStartButton,
  classicStartButton,
  neoStartButton,
  neoBrand
};
