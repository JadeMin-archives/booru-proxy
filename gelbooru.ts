/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
console.clear();



export default {
	async fetch(request: Request, env: {}, ctx: ExecutionContext): Promise<Response> {
		const req = new URL(request.url);
		const origin = new URL(`https://gelbooru.com${req.pathname}${req.search}`);
		
		const response = await fetch(origin.href, {
			cf: {
				cacheTtl: 31560000,
				cacheEverything: true
			}
		});


		return new HTMLRewriter()
			.on(`[src*="//${origin.hostname}/"]`, {
				element(element: { getAttribute: (arg0: string) => any; setAttribute: (arg0: string, arg1: string) => void; }) {
					const src = element.getAttribute('src');
					const originSrc = new URL(src.startsWith('//')? `https:${src}` : src);

					if(originSrc.pathname.startsWith('//')) {
						element.setAttribute('src', `/${originSrc.pathname.slice(1)}`);
					} else {
						element.setAttribute('src', `/${originSrc.pathname}`);
					}
				}
			})
			.on(`[href*="//${origin.hostname}/"]`, {
				element(element: { getAttribute: (arg0: string) => any; setAttribute: (arg0: string, arg1: string) => void; }) {
					const href = element.getAttribute('href');
					const originHref = new URL(href.startsWith('//')? `https:${href}` : href);
					
					if(originHref.pathname.startsWith('//')) {
						element.setAttribute('href', `/${originHref.pathname.slice(1)}`);
					} else {
						element.setAttribute('href', `/${originHref.pathname}`);
					}
				}
			})
			.transform(response);
	}
};
