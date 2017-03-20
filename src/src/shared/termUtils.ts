import { removeBracketsContent } from './stringUtils';

export function areTheSameValues(correctValue: string, userValue: string) {
  correctValue = correctValue.toLocaleLowerCase();
  userValue = userValue.toLocaleLowerCase();

  return correctValue === userValue ||
         removeBracketsContent(correctValue) === removeBracketsContent(userValue) ||
         removeBracketsContent(correctValue).trim() === removeBracketsContent(userValue).trim();
}
