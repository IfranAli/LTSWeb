export class IdentitySingleton {
    private static instance: IdentitySingleton;
    private nextID = 0;

    private constructor() { }

    public static getInstance(): IdentitySingleton {
        if (!IdentitySingleton.instance) {
            IdentitySingleton.instance = new IdentitySingleton();
        }

        return IdentitySingleton.instance;
    }

    public getNextID(): number {
        return this.nextID++;
    }
}