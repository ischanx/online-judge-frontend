import micromatch from 'micromatch'

export default {
  '*.{ts,js,vue}': (files) => {
    // from `files` filter those _NOT_ matching `*test.js`
    const match = micromatch.not(files, '**/components.d.ts')
    return `eslint --fix ${ match.join(' ') }`
  },
  '*.{sass,scss,css,less,html,json,md}': (files) => {
    return `prettier --write ${ files.join(' ') }`
  },
}