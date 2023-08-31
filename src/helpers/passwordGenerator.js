export const passwordGenerator = (options) => {
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercase = uppercase.toLowerCase();
    let numbers = '0123456789';
    let specialCharacters = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let maximumLength = options?.maximumLength ?? 12;
    let minimumLength = options?.minimumLength ?? 8;
    let length = options?.length ?? 10;
    let isNumberRequired = options?.isNumberRequired ?? false;
    let isLowerCaseRequired = options?.isLowerCaseRequired ?? true;
    let isUpperCaseRequired = options?.isUpperCaseRequired ?? false;
    let isSpecialSymbolRequired = options?.isSpecialSymbolRequired ?? false;

    if( ( minimumLength && !maximumLength ) || ( !minimumLength && maximumLength ) ) {
        length = getRandomInt(minimumLength, maximumLength); // non-constant length would cause password to be harder to guess
      }


    let categoryArray = self.crypto.getRandomValues(new Uint32Array(length))
    categoryArray = Array.from(categoryArray, value => value % 4);

    let password  = "";

    categoryArray.forEach(category =>{
        if (category == 0){
            password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
        }
        else if(category == 1){
            password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
        }
        else if(category == 2){
            password += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));
        }
        else{
            password += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }

    });


    return password
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}