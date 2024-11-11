import { execSync } from 'child_process'
import { chdir } from 'process'
import { assertOptions } from '@sprucelabs/schema'
import SpruceError from '../errors/SpruceError'

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
        this.changeDirectoryToCurrentPackage()
        this.tryToRunSpruceUpgrade()
        this.tryToRunTsc()
        this.runGit()
    }

    private changeDirectoryToCurrentPackage() {
        this.chdir(this.currentPackagePath)
    }

    protected tryToRunSpruceUpgrade() {
        try {
            this.runSpruceUpgrade()
        } catch {
            this.throwSpruceUpgradeFailed()
        }
    }

    private runSpruceUpgrade() {
        this.execCommand('spruce upgrade')
    }

    private throwSpruceUpgradeFailed() {
        throw new SpruceError({
            code: 'SPRUCE_UPGRADE_FAILED',
            packagePath: this.currentPackagePath,
        })
    }

    private tryToRunTsc() {
        try {
            this.runTsc()
        } catch {
            this.throwTscFailed()
        }
    }

    private runTsc() {
        this.execCommand('tsc --noEmit')
    }

    private throwTscFailed() {
        throw new SpruceError({
            code: 'TSC_FAILED',
            packagePath: this.currentPackagePath,
        })
    }

    private runGit() {
        this.execCommand('git add .')
        this.execCommand('git commit -m "patch: autoupgrade"')
        this.execCommand('git push')
    }

    private execCommand(command: string) {
        this.execSync(command, { stdio: 'inherit' })
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
