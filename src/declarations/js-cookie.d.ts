declare module 'js-cookies' {
    const Cookies: {
        get: any;
        getItem(name: string): string;
    };
    export default Cookies;
}
