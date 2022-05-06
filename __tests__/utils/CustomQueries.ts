export const queryByContent = (content: string) => {
    return queryAllByContent(content)[0];
}
export const queryAllByContent = (content: string) => document.querySelectorAll(`[data-content=${content}]`)

