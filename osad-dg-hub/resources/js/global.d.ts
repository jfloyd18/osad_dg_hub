// In: resources/js/global.d.ts

import { Config } from 'ziggy-js';

declare global {
    // This tells TypeScript about the global 'route()' function provided by Ziggy
    function route(name: string, params?: any, absolute?: boolean, config?: Config): string;
}

// This line is needed to make the file a proper module.
export {};