export const passwordGenerator = (options) => {
    let maximumLength = options?.maximumLength ?? 12;
    let minimumLength = options?.minimumLength ?? 8;
    let length = options?.length ?? 10;
    let isNumberRequired = options?.isNumberRequired ?? false;
    let isLowerCaseRequired = options?.isLowerCaseRequired ?? false;
    let isUpperCaseRequired = options?.isUpperCaseRequired ?? false;
    let isSpecialSymbolRequired = options?.isSpecialSymbolRequired ?? false;

    if( ( minimumLength && !maximumLength ) || ( !minimumLength && maximumLength ) ) {
        length = getRandomInt(minimumLength, maximumLength); // non-constant length would cause password to be harder to guess
      }
      let seedArray = new Uint32Array(1);
      let newPassword = self.crypto.getRandomValues(seedArray);


      return newPassword
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}