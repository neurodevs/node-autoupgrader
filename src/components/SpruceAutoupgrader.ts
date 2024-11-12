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
    protected currentGitChanges = ''
    private currentError!: Error

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async run(packagePaths: string[]) {
        assertOptions({ packagePaths }, ['packagePaths'])
        this.packagePaths = packagePaths

        this.assertNoUncommittedChanges()
        this.upgradePackages()
    }

    private assertNoUncommittedChanges() {
        const uncommittedPaths = this.packagePaths.filter((path) => {
            this.currentPackagePath = path
            this.checkForGitChanges()
            return this.hasGitChanges
        })

        if (uncommittedPaths.length) {
            throw new SpruceError({
                code: 'UNCOMMITTED_CHANGES',
                packagePaths: uncommittedPaths,
            })
        }
    }

    protected checkForGitChanges() {
        this.currentGitChanges = this.execSync('git status --porcelain', {
            encoding: 'utf-8',
        })
    }

    private upgradePackages() {
        for (const path of this.packagePaths) {
            this.currentPackagePath = path
            this.upgradePackage()
        }
    }

    private upgradePackage() {
        this.changeDirectoryToCurrentPackage()
        this.tryToRunSpruceUpgrade()
        this.checkForGitChanges()

        if (this.hasGitChanges) {
            this.tryToRunTypeValidation()
            this.tryToRunNpmVersionPatch()
            this.tryToRunGitPublish()
            this.tryToRunNpmPublish()
        }
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

    protected tryToRunTypeValidation() {
        try {
            this.runTypeValidation()
        } catch (err: any) {
            this.currentError = err.message
            this.throwTypeValidationFailed()
        }
    }

    private runTypeValidation() {
        this.execCommand('tsc --noEmit')
    }

    private throwTypeValidationFailed() {
        this.throwSpruceError('TYPE_VALIDATION_FAILED')
    }

    protected tryToRunNpmVersionPatch() {
        try {
            this.runNpmVersionPatch()
        } catch (err: any) {
            this.currentError = err.message
            this.throwNpmVersionPatchFailed()
        }
    }

    private runNpmVersionPatch() {
        this.execCommand('npm version patch --no-git-tag-version')
    }

    private throwNpmVersionPatchFailed() {
        this.throwSpruceError('NPM_VERSION_PATCH_FAILED')
    }

    protected tryToRunGitPublish() {
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

    private tryToRunNpmPublish() {
        try {
            this.runNpmPublish()
        } catch (err: any) {
            this.currentError = err.message
            this.throwNpmPublishFailed()
        }
    }

    private runNpmPublish() {
        this.execCommand('npm publish --access public')
    }

    private throwNpmPublishFailed() {
        this.throwSpruceError('NPM_PUBLISH_FAILED')
    }

    private throwSpruceError(code: any) {
        throw new SpruceError({
            code,
            packagePath: this.currentPackagePath,
            originalError: this.currentError,
        })
    }

    private execCommand(command: string) {
        this.execSync(command, { stdio: 'inherit' })
    }

    private get hasGitChanges() {
        return this.currentGitChanges.trim().length > 0
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
