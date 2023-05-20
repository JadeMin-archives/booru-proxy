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
				element(element) {
					const src = element.getAttribute('src')!;
					// if "//(hostname)/(...)"
					const originSrc = new URL(src.startsWith('//')? `https:${src}` : src);

					// if "(...)//(path)"
					if(originSrc.pathname.startsWith('//')) {
						element.setAttribute('src', `/${originSrc.pathname.slice(1)}`);
					} else {
						element.setAttribute('src', `/${originSrc.pathname}`);
					}
				}
			})
			.on(`[href*="//${origin.hostname}/"]`, {
				element(element) {
					const href = element.getAttribute('href')!;
					// if "//(hostname)/(...)"
					const originHref = new URL(href.startsWith('//')? `https:${href}` : href);
					
					// if "(...)//(path)"
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
