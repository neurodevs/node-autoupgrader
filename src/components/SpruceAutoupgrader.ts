import { execSync } from 'child_process'
import { chdir } from 'process'
import { assertOptions } from '@sprucelabs/schema'

export default class SpruceAutoupgrader implements Autoupgrader {
    public static Class?: AutoupgraderConstructor

    public static chdir = chdir
    public static execSync = execSync

    private packagePaths!: string[]
    private currentPackagePath!: string

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async run(packagePaths: string[]) {
        assertOptions({ packagePaths }, ['packagePaths'])
        this.packagePaths = packagePaths

        for (const path of this.packagePaths) {
            this.currentPackagePath = path
            this.upgradePackage()
        }
    }

    private upgradePackage() {
        this.chdir(this.currentPackagePath)
        this.execSync('spruce upgrade', { stdio: 'inherit' })
    }

    private get chdir() {
        return SpruceAutoupgrader.chdir
    }

    private get execSync() {
        return SpruceAutoupgrader.execSync
    }
}

export interface Autoupgrader {
    run(packagePaths: string[]): Promise<void>
}

export type AutoupgraderConstructor = new () => Autoupgrader
