import { execSync } from 'child_process'
import { chdir } from 'process'
import { assertOptions } from '@sprucelabs/schema'
import { buildLog } from '@sprucelabs/spruce-skill-utils'
import SpruceError from '../errors/SpruceError'
import { Autoupgrader, AutoupgraderConstructor } from '../types'

export default class SpruceAutoupgrader implements Autoupgrader {
    public static Class?: AutoupgraderConstructor

    public static chdir = chdir
    public static execSync = execSync

    protected currentGitChanges = ''
    private packagePaths!: string[]
    private uncommittedPaths!: string[]
    private currentPackagePath!: string
    private currentError!: Error
    private log = buildLog('SpruceAutoupgrader')

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

    protected assertNoUncommittedChanges() {
        this.searchForUncommitted()
        this.throwIfUncommitted()
    }

    private searchForUncommitted() {
        this.uncommittedPaths = this.packagePaths.filter((path) => {
            this.currentPackagePath = path
            this.changeDirectoryToCurrentPackage()
            this.checkForGitChanges()
            return this.hasGitChanges
        })
    }

    private throwIfUncommitted() {
        if (this.uncommittedPaths.length > 0) {
            throw new SpruceError({
                code: 'UNCOMMITTED_CHANGES',
                packagePaths: this.uncommittedPaths,
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
        this.log.info('Upgrading package:', this.currentPackagePath)

        this.changeDirectoryToCurrentPackage()
        this.trySpruceUpgrade()
        this.checkForGitChanges()

        if (this.hasGitChanges) {
            this.tryTypeValidation()
            this.tryNpmVersionPatch()
            this.tryGitPublish()
            this.tryNpmPublish()
        }
    }

    private changeDirectoryToCurrentPackage() {
        this.chdir(this.currentPackagePath)
    }

    protected trySpruceUpgrade() {
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

    protected tryTypeValidation() {
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

    protected tryNpmVersionPatch() {
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

    protected tryGitPublish() {
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

    private tryNpmPublish() {
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
        this.execSync(command, {})
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
