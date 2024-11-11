import { assertOptions } from '@sprucelabs/schema'

export default class SpruceAutoupgrader implements Autoupgrader {
    public static Class?: AutoupgraderConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async run(packagePaths: string[]) {
        assertOptions({ packagePaths }, ['packagePaths'])
    }
}

export interface Autoupgrader {
    run(packagePaths: string[]): Promise<void>
}

export type AutoupgraderConstructor = new () => Autoupgrader
