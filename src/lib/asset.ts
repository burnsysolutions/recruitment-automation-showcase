/** A file from public/, wherever the site is served from (GitHub Pages puts it under a folder). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
