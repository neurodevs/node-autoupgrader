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
    private currentError!: Error

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
        this.tryToRunGitPublish()
        this.runNpmPublish()
    }

    private changeDirectoryToCurrentPackage() {
        this.chdir(this.currentPackagePath)
    }

    protected tryToRunSpruceUpgrade() {
        try {
            this.runSpruceUpgrade()
        } catch (err: any) {
            this.currentError = err.message
            this.throwSpruceUpgradeFailed()
        }
    }

    private runSpruceUpgrade() {
        this.execCommand('spruce upgrade')
    }

    private throwSpruceUpgradeFailed() {
        this.throwSpruceError('SPRUCE_UPGRADE_FAILED')
    }

    private tryToRunTsc() {
        try {
            this.runTsc()
        } catch (err: any) {
            this.currentError = err.message
            this.throwTscFailed()
        }
    }

    private runTsc() {
        this.execCommand('tsc --noEmit')
    }

    private throwTscFailed() {
        this.throwSpruceError('TSC_FAILED')
    }

    private tryToRunGitPublish() {
        try {
            this.runGitPublish()
        } catch (err: any) {
            this.currentError = err.message
            this.throwGitPublishFailed()
        }
    }

    private runGitPublish() {
        this.execCommand('git add .')
        this.execCommand('git commit -m "patch: autoupgrade"')
        this.execCommand('git push')
    }

    private throwGitPublishFailed() {
        this.throwSpruceError('GIT_PUBLISH_FAILED')
    }

    private runNpmPublish() {
        this.execCommand('npm publish')
    }

    private throwSpruceError(code: SpruceError['options']['code']) {
        throw new SpruceError({
            code,
            packagePath: this.currentPackagePath,
            originalError: this.currentError,
        })
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
