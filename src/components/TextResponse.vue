<template>
    <div class="markdown-content" v-html="renderedResponse"></div>
</template>

<script>    
    export default {
        name: 'text-response',
        props: ['response'],
        computed: {
            renderedResponse() {
                // Return empty string if response is null, undefined, or not a string
                if (!this.response || typeof this.response !== 'string') {
                    return '';
                }
                
                let formatted = this.response;

                // Define inline styles
                const styles = {
                    h1: 'font-size: 1.8em; font-weight: bold; margin-bottom: 0.5em; margin-top: 1em;',
                    h2: 'font-size: 1.5em; font-weight: bold; margin-bottom: 0.4em; margin-top: 1em;',
                    h3: 'font-size: 1.3em; font-weight: bold; margin-bottom: 0.3em; margin-top: 0.5em;',
                    orbitHeading: 'font-size: 1.3em; font-weight: bold; margin-bottom: 0.5em; margin-top: 1em; color: #3273dc;',
                    p: 'margin-bottom: 1em; line-height: 1.6;',
                    ul: 'margin-bottom: 1em; padding-left: 2em; list-style-type: disc;',
                    ol: 'margin-bottom: 1em; padding-left: 2em; list-style-type: decimal;',
                    li: 'margin-bottom: 0.5em;',
                    blockquote: 'border-left: 4px solid #ddd; padding-left: 1em; color: #666; margin: 1em 0;',
                    code: 'font-family: monospace; background-color: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; font-size: 0.9em;',
                    pre: 'background-color: #f5f5f5; padding: 1em; border-radius: 5px; overflow-x: auto; margin: 1em 0;',
                    strong: 'font-weight: bold;',
                    em: 'font-style: italic;'
                };

                // Headings - process these first to avoid conflicts
                formatted = formatted
                    .replace(/^### (.*?)$/gm, `<h3 style="${styles.h3}">$1</h3>`)
                    .replace(/^## (.*?)$/gm, `<h2 style="${styles.h2}">$1</h2>`)
                    .replace(/^# (.*?)$/gm, `<h1 style="${styles.h1}">$1</h1>`);
                
                // Handle specific patterns like "SSO-800-SSO-DD Orbit" as subheadings
                formatted = formatted.replace(
                    /^(SSO-\d+-SSO-\w+.*)$/gm, 
                    `<h3 style="${styles.orbitHeading}">$1</h3>`
                );
                
                // Lists
                const ulRegex = /^\* (.*?)$/gm;
                const olRegex = /^\d+\. (.*?)$/gm;
                
                // Convert unordered lists with inline styles
                if (formatted.match(ulRegex)) {
                    let inList = false;
                    formatted = formatted.replace(ulRegex, (match, item) => {
                        if (!inList) {
                            inList = true;
                            return `<ul style="${styles.ul}"><li style="${styles.li}">` + item + '</li>';
                        }
                        return `<li style="${styles.li}">` + item + '</li>';
                    });
                    // Close any open lists
                    if (inList) {
                        formatted = formatted + '</ul>';
                    }
                }
                
                // Convert ordered lists with inline styles
                if (formatted.match(olRegex)) {
                    let inList = false;
                    formatted = formatted.replace(olRegex, (match, item) => {
                        if (!inList) {
                            inList = true;
                            return `<ol style="${styles.ol}"><li style="${styles.li}">` + item + '</li>';
                        }
                        return `<li style="${styles.li}">` + item + '</li>';
                    });
                    // Close any open lists
                    if (inList) {
                        formatted = formatted + '</ol>';
                    }
                }
                
                // Blockquotes with inline styles
                formatted = formatted.replace(
                    /^> (.*?)$/gm,
                    `<blockquote style="${styles.blockquote}">$1</blockquote>`
                );
                
                // Code blocks with inline styles
                formatted = formatted.replace(
                    /```([\s\S]*?)```/g,
                    `<pre style="${styles.pre}"><code style="${styles.code}">$1</code></pre>`
                );
                
                // Inline formatting with inline styles
                formatted = formatted
                    .replace(/\*\*(.*?)\*\*/g, `<strong style="${styles.strong}">$1</strong>`) // Bold
                    .replace(/__(.*?)__/g, `<strong style="${styles.strong}">$1</strong>`) // Bold (alternative)
                    .replace(/\*(.*?)\*/g, `<em style="${styles.em}">$1</em>`) // Italic
                    .replace(/_(.*?)_/g, `<em style="${styles.em}">$1</em>`) // Italic (alternative)
                    .replace(/`(.*?)`/g, `<code style="${styles.code}">$1</code>`); // Inline code
                
                // Paragraphs and line breaks
                formatted = formatted
                    .replace(/\n\n/g, `</p><p style="${styles.p}">`) // Paragraphs
                    .replace(/\n/g, ''); // Line breaks
                
                // Wrap in paragraphs if not already wrapped
                if (!formatted.startsWith('<h1') && 
                    !formatted.startsWith('<h2') && 
                    !formatted.startsWith('<h3') && 
                    !formatted.startsWith('<ul') && 
                    !formatted.startsWith('<ol') && 
                    !formatted.startsWith('<blockquote')) {
                    formatted = `<p style="${styles.p}">${formatted}</p>`;
                }
                
                return formatted;
            }
        }
    }
</script>

<style>
/* Only minimal global styling - most styling is now inline */
.markdown-content {
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    color: #333;
    line-height: 1.6;
}
</style>