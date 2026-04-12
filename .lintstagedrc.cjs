module.exports = {
  '*.{js,jsx,ts,tsx,vue}': ['prettier --write'], // 暂时移除eslint --fix
  '*.{css,scss,less}': ['prettier --write'],
  '*.{md,json}': ['prettier --write'],
  '*.{png,jpg,jpeg,gif,svg}': ['imagemin-lint-staged'],
}