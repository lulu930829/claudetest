module.exports = {
  '*.{js,jsx,ts,tsx,vue}': ['eslint --fix', 'prettier --write'],
  '*.{css,scss,less}': ['prettier --write'],
  '*.{md,json}': ['prettier --write'],
  '*.{png,jpg,jpeg,gif,svg}': ['imagemin-lint-staged'],
}