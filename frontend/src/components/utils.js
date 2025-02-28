// utils.js
export function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  
  export function getSnippet(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '... Read more';
  }
  
  export const tagColors = [
    '#FF6F61', // coral
    '#6B5B95', // purple
    '#88B04B', // green
    '#F7CAC9', // pink
    '#92A8D1', // light blue
    '#955251', // brownish
    '#B565A7', // violet
    '#009B77', // teal
  ];
  
  export function getColorForTag(tag) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % tagColors.length;
    return tagColors[index];
  }