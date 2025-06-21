import * as schema from './image.schema';
export declare const db: import("drizzle-orm/neon-http").NeonHttpDatabase<typeof schema> & {
    $client: import("@neondatabase/serverless").NeonQueryFunction<false, false>;
};
export { images } from './image.schema';
export type { ImageRecord, NewImageRecord } from './image.schema';
