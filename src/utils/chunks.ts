
export function sortElementInnerText(element: HTMLElement, className: string, index: number) {

    // Get the text content of the element
    const text = element.innerHTML;
    const regexPattern = /(.+)\s?<([a-z]+)>\s?(.+)/gi


    // Create arrays to store the sorted characters and spans
    const sortedChars: HTMLElement[] = [];

    let matches = [...text.matchAll(regexPattern)][0];
    const firstSentence = matches[1];
    const tagElement = matches[2]
    const secondSentence = matches[3]


    const sortSentence = (char: string) => {
        let returnValue = null;
        if (char === ' ') {
            // If the character is a space, add it to the sortedChars array as text content
            returnValue = document.createTextNode(' ') as any;
        } else {
            // Otherwise, create a new span for the character and add it to the sortedChars array
            const charSpan = document.createElement('span');
            charSpan.style.display = 'inline-block';
            charSpan.className = `${className} ${index === 0 ? "active" : ""}`;
            charSpan.textContent = char;
            returnValue = charSpan
        }
        return returnValue
    }


    for (let i = 0; i < firstSentence.length; i++) {
        const char = firstSentence[i];
        const charSpan = sortSentence(char)
        sortedChars.push(charSpan);
    }
    const newTagEl = document.createElement(tagElement) as HTMLBRElement
    sortedChars.push(newTagEl)
    for (let i = 0; i < secondSentence.length; i++) {
        const char = secondSentence[i];
        const charSpan = sortSentence(char)
        sortedChars.push(charSpan);
    }

    // console.log(sortedChars)






    // Replace the original text element with the sortedWords array
    element.innerHTML = "";
    for (let i = 0; i < sortedChars.length; i++) {
        element.appendChild(sortedChars[i])
    }


    // Return the baseInnerText and sortedChars array
    return {
        baseInnerHTML: text,
        element: element,
        sortedChars: sortedChars
    };
}