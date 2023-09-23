export const removeSpaces = (str: string) => {
  return str.split(' ').filter(s => s).join(' ');
}