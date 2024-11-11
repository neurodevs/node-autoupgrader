import { chdir } from 'process'
import { assertOptions } from '@sprucelabs/schema'

export default class SpruceAutoupgrader implements Autoupgrader {
    public static Class?: AutoupgraderConstructor
    public static chdir = chdir

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async run(packagePaths: string[]) {
        assertOptions({ packagePaths }, ['packagePaths'])

        for (const path of packagePaths) {
            this.chdir(path)
        }
    }

    private get chdir() {
        return SpruceAutoupgrader.chdir
    }
}

export interface Autoupgrader {
    run(packagePaths: string[]): Promise<void>
}

export type AutoupgraderConstructor = new () => Autoupgrader
