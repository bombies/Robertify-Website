export class ImageParams {
    constructor(private searchParams?: URLSearchParams) {
    }

    get(param: string, defaultResult?: string): string {
        const def = defaultResult ?? ""
        if (!this.searchParams) return def
        return this.searchParams.get(param) ?? def
    }
}