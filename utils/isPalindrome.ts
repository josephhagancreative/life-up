export const isPalindrome = (num: number) => {
  const str = num.toString()
  return str === str.split("").reverse().join("") && str.length >= 3
}
