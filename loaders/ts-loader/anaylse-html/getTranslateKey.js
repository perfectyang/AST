
function getTranslateKey (source) {
  let result = {}
  const reg = /(\$|\.)t\((\'|\")([^\)\'\"]+)(\'|\")(,([^\)\'\"]+))?\)/gm
  const matchKey
  while(matchKey = reg.exec(source)) {
    result[matchKey[3]] = matchKey[3]
  }

  return result
}

module.exports = getTranslateKey
