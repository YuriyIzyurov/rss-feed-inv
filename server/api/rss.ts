import Parser from 'rss-parser';

export default defineEventHandler(
    async (event) => {
        const body = await readBody(event);
        try {
            const parser = new Parser();
            const feed = await parser.parseURL(body.url);

            return {
                status: 200,
                data: {
                    ...(feed as any),
                    rss: body.url,
                },
                error: null,
            };
        } catch (error: any) {
            return {
                status: 500,
                data: null,
                error: error?.message || 'Что-то пошло не так',
            };
        }
    }
);