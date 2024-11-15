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
    private originalConsoleLog = console.log

    protected constructor() {
        this.setLogFilter()
    }

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async run(packagePaths: string[]) {
        assertOptions({ packagePaths }, ['packagePaths'])
        this.packagePaths = packagePaths

        this.assertNoUncommittedChanges()
        await this.upgradePackages()
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

    private async upgradePackages() {
        await Promise.all(
            this.packagePaths.map(async (path) => {
                this.currentPackagePath = path
                await this.upgradePackage()
            })
        )
    }

    private async upgradePackage() {
        this.logUpgradingPackage()

        this.changeDirectoryToCurrentPackage()
        this.upgradePackageDependencies()
        this.checkForGitChanges()

        if (this.hasGitChanges) {
            this.logChangesDetected()
            this.assertTypesPassing()
            this.incrementPackageVersion()
            this.commitAllChanges()
            this.publishPackage()
        } else {
            this.logNoChangesDetected()
        }
    }

    private changeDirectoryToCurrentPackage() {
        this.chdir(this.currentPackagePath)
    }

    protected upgradePackageDependencies() {
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

    protected assertTypesPassing() {
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

    protected incrementPackageVersion() {
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

    protected commitAllChanges() {
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

    protected publishPackage() {
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

    private logUpgradingPackage() {
        this.log.info('Upgrading package:', this.currentPackagePath)
    }

    private logChangesDetected() {
        this.log.info(
            'Changes detected, upgrading package:',
            this.currentPackagePath
        )
    }

    private logNoChangesDetected() {
        this.log.info(
            'No changes detected, skipping upgrade:',
            this.currentPackagePath
        )
    }

    private setLogFilter() {
        console.log = (...args) => {
            const message = args.join(' ')
            if (message.includes('SpruceAutoupgrader')) {
                this.originalConsoleLog(...args)
            }
        }
    }
}
