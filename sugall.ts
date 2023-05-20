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
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { hostname, pathname, search } = new URL(request.url);

		const response = fetch(`https://booru.sugall.com${pathname}${search}`, {
			...request,
			cf: {
				cacheTtl: 31536000,
				cacheEverything: true
			}
		});
		

		//return response;
		return new HTMLRewriter()
			.on("article.withleft > section#commentlistimage", {
				element(element: HTMLElement) {
					element.remove();
				}
			})
			.transform(await response);
	}
};
