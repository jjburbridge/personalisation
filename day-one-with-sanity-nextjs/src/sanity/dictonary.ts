// eslint-disable-next-line @typescript-eslint/no-require-imports
const dictionary = require("../../public/strings.json");
export const getStringTranslation = (key: string, language: string) => {
  return dictionary[key][language] || dictionary[key]["en"];
};
