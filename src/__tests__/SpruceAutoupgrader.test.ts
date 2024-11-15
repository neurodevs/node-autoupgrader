import { ExecSyncOptions } from 'child_process'
import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import SpruceAutoupgrader from '../components/SpruceAutoupgrader'
import { Autoupgrader } from '../types'

export default class SpruceAutoupgraderTest extends AbstractSpruceTest {
    private static instance: Autoupgrader

    protected static async beforeEach() {
        await super.beforeEach()

        this.fakeChdir()
        this.fakeExecSync()
        this.fakeGitStatusResponse = '' as Buffer & string

        this.instance = this.SpruceAutoupgrader()
    }

    @test()
    protected static async canCreateSpruceAutoupgrader() {
        assert.isTruthy(this.instance)
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        // @ts-ignore
        const err = await assert.doesThrowAsync(() => this.instance.run())

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['packagePaths'],
        })
    }

    @test()
    protected static async throwsForPackagesWithUncommittedChanges() {
        this.fakeGitStatusResponse = 'M fake.ts' as Buffer & string

        const err = await assert.doesThrowAsync(() => this.run(false))

        errorAssert.assertError(err, 'UNCOMMITTED_CHANGES', {
            packagePaths: this.packagePaths,
        })

        assert.isEqualDeep(this.callsToChdir, this.packagePaths)
    }

    @test()
    protected static async callsChdirForEachPackage() {
        await this.run()

        assert.isEqualDeep(
            this.callsToChdir,
            this.packagePaths,
            'Should call chdir(path) for each package!\n'
        )
    }

    @test()
    protected static async callsSpruceUpgradeForEachPackage() {
        await this.run()

        const expected = [
            this.createSpruceUpgradeCall(),
            this.createSpruceUpgradeCall(),
        ] as CallToExecSync[]

        assert.isEqualDeep(
            [this.callsToExecSync[0], this.callsToExecSync[8]],
            expected,
            'Should call execSync() for each package with the following options!\n'
        )
    }

    @test()
    protected static async throwsIfSpruceUpgradeFails() {
        this.setThrowOnExecSync()

        const err = await assert.doesThrowAsync(() => this.run())

        errorAssert.assertError(err, 'SPRUCE_UPGRADE_FAILED', {
            packagePath: this.packagePaths[0],
            originalError: this.fakeExecSyncError,
        })
    }

    @test()
    protected static async checksForGitChangesForEachPackage() {
        await this.run()

        const expected = [
            this.createGitStatusCall(),
            this.createGitStatusCall(),
        ] as CallToExecSync[]

        assert.isEqualDeep(
            [this.callsToExecSync[1], this.callsToExecSync[9]],
            expected,
            'Should call execSync() for each package with the following options!\n'
        )
    }

    @test()
    protected static async skipsRestOfUpgradeIfNoGitChanges() {
        this.fakeGitStatusResponse = '' as Buffer & string
        this.skipAssertNoUncommittedChanges()
        this.skipToCheckForGitChanges()

        await this.run(false)

        assert.isEqualDeep(
            this.callsToExecSync.length,
            2,
            'Should only upgrade package if git changes!\n'
        )
    }

    @test()
    protected static async callsTypeValidationForEachPackage() {
        await this.run()

        const expected = [
            this.createTscCall(),
            this.createTscCall(),
        ] as CallToExecSync[]

        assert.isEqualDeep(
            [this.callsToExecSync[2], this.callsToExecSync[10]],
            expected,
            'Should call execSync() for each package with the following options!\n'
        )
    }

    @test()
    protected static async throwsIfTypeValidationFails() {
        this.setThrowOnExecSync()
        this.skipToAssertTypesPassing()

        const err = await assert.doesThrowAsync(() => this.run())

        errorAssert.assertError(err, 'TYPE_VALIDATION_FAILED', {
            packagePath: this.packagePaths[0],
            originalError: this.fakeExecSyncError,
        })
    }

    @test()
    protected static async callsNpmVersionPatchForEachPackage() {
        await this.run()

        const expected = [
            this.createNpmVersionPatchCall(),
            this.createNpmVersionPatchCall(),
        ] as CallToExecSync[]

        assert.isEqualDeep(
            [this.callsToExecSync[3], this.callsToExecSync[11]],
            expected,
            'Should call execSync() for each package with the following options!\n'
        )
    }

    @test()
    protected static async throwsIfNpmVersionPatchFails() {
        this.setThrowOnExecSync()
        this.skipToIncrementPackageVersion()

        const err = await assert.doesThrowAsync(() => this.run())

        errorAssert.assertError(err, 'NPM_VERSION_PATCH_FAILED', {
            packagePath: this.packagePaths[0],
            originalError: this.fakeExecSyncError,
        })
    }

    @test()
    protected static async callsGitPublishForEachPackage() {
        await this.run()

        const expected = [
            this.formatCommand('git add .'),
            this.formatCommand('git commit -m "patch: autoupgrade"'),
            this.formatCommand('git push'),
        ] as CallToExecSync[]

        assert.isEqualDeep(
            [
                this.callsToExecSync[4],
                this.callsToExecSync[5],
                this.callsToExecSync[6],
            ],
            expected,
            'Should call execSync() for each package with the following options!\n'
        )
    }

    @test()
    protected static async throwsIfGitPublishFails() {
        this.setThrowOnExecSync()
        this.skipToCommitAllChanges()

        const err = await assert.doesThrowAsync(() => this.run())

        errorAssert.assertError(err, 'GIT_PUBLISH_FAILED', {
            packagePath: this.packagePaths[0],
            originalError: this.fakeExecSyncError,
        })
    }

    @test()
    protected static async callsNpmPublishForEachPackage() {
        await this.run()

        const expected = [
            this.createNpmPublishCall(),
            this.createNpmPublishCall(),
        ] as CallToExecSync[]

        assert.isEqualDeep(
            [this.callsToExecSync[7], this.callsToExecSync[15]],
            expected,
            'Should call execSync() for each package with the following options!\n'
        )
    }

    @test()
    protected static async throwsIfNpmPublishFails() {
        this.setThrowOnExecSync()
        this.skipToPublishPackage()

        const err = await assert.doesThrowAsync(() => this.run())

        errorAssert.assertError(err, 'NPM_PUBLISH_FAILED', {
            packagePath: this.packagePaths[0],
            originalError: this.fakeExecSyncError,
        })
    }

    private static async run(shouldSkipAndSet = true) {
        if (shouldSkipAndSet) {
            this.skipNoUncommittedChangesAndSetFakeGitStatus()
        }
        await this.instance.run(this.packagePaths)
    }

    private static skipNoUncommittedChangesAndSetFakeGitStatus() {
        this.skipAssertNoUncommittedChanges()
        this.setFakeGitStatus()
    }

    private static fakeChdir() {
        this.callsToChdir = []

        SpruceAutoupgrader.chdir = (path: string) => {
            this.callsToChdir.push(path)
        }
    }

    private static fakeExecSync() {
        this.callsToExecSync = []

        // @ts-ignore
        SpruceAutoupgrader.execSync = (
            command: string,
            options?: ExecSyncOptions
        ) => {
            this.callsToExecSync.push({ command, options })
            return this.fakeGitStatusResponse
        }
    }

    private static setThrowOnExecSync() {
        SpruceAutoupgrader.execSync = () => {
            throw new Error(this.fakeExecSyncError)
        }
    }

    private static skipToCheckForGitChanges() {
        this.skipUpgradePackageDependencies()
    }

    private static skipToAssertTypesPassing() {
        this.skipToCheckForGitChanges()
        this.skipCheckForGitChanges()
        // @ts-ignore
        this.instance.currentGitChanges = 'M fake.ts'
    }

    private static skipToIncrementPackageVersion() {
        this.skipToAssertTypesPassing()
        this.skipAssertTypesPassing()
    }

    private static skipToCommitAllChanges() {
        this.skipToIncrementPackageVersion()
        this.skipIncrementPackageVersion()
    }

    private static skipToPublishPackage() {
        this.skipToCommitAllChanges()
        this.skipCommitAllChanges()
    }

    private static skipAssertNoUncommittedChanges() {
        // @ts-ignore
        this.instance.assertNoUncommittedChanges = () => {}
    }

    private static skipCheckForGitChanges() {
        // @ts-ignore
        this.instance.checkForGitChanges = () => {}
    }

    private static skipUpgradePackageDependencies() {
        // @ts-ignore
        this.instance.upgradePackageDependencies = () => {}
    }

    private static skipAssertTypesPassing() {
        // @ts-ignore
        this.instance.assertTypesPassing = () => {}
    }

    private static skipIncrementPackageVersion() {
        // @ts-ignore
        this.instance.incrementPackageVersion = () => {}
    }

    private static skipCommitAllChanges() {
        // @ts-ignore
        this.instance.commitAllChanges = () => {}
    }

    private static createSpruceUpgradeCall() {
        return this.formatCommand('spruce upgrade')
    }

    private static createGitStatusCall() {
        return {
            command: 'git status --porcelain',
            options: { encoding: 'utf-8' },
        } as CallToExecSync
    }

    private static createTscCall() {
        return this.formatCommand('tsc --noEmit')
    }

    private static createNpmVersionPatchCall() {
        return this.formatCommand('npm version patch --no-git-tag-version')
    }

    private static createNpmPublishCall() {
        return this.formatCommand('npm publish --access public')
    }

    private static formatCommand(command: string) {
        return {
            command,
            options: {},
        } as CallToExecSync
    }

    private static setFakeGitStatus() {
        this.fakeGitStatusResponse = this.fakeGitStatus
    }

    private static readonly packagePaths = [generateId(), generateId()]
    private static readonly fakeExecSyncError = 'Unexpected error in execSync'
    private static readonly fakeGitStatus = 'M fake.ts' as Buffer & string

    private static fakeGitStatusResponse = '' as Buffer & string
    private static callsToChdir: string[] = []
    private static callsToExecSync: CallToExecSync[] = []

    private static SpruceAutoupgrader() {
        return SpruceAutoupgrader.Create()
    }
}

export interface CallToExecSync {
    command: string
    options?: ExecSyncOptions
}
