// export const extractFileNameFromURL = ({URL, headerSubstring}) => {
//   return URL.replace(headerSubstring, "");
// }

export function titleCase(stringInput) {
  if (!stringInput) return stringInput;
  return stringInput.replace(stringInput[0], stringInput[0].toUpperCase());
}
