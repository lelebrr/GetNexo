import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date().or(z.string()),
        category: z.string(),
        featured: z.boolean().default(false),
        image: z.string().optional(),
        lang: z.enum(['pt', 'en', 'es', 'fr']).default('pt'),
    }),
});

export const collections = { blog };
