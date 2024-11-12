import { ExecSyncOptions } from 'child_process'
import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import SpruceAutoupgrader, {
    Autoupgrader,
} from '../components/SpruceAutoupgrader'

export default class SpruceAutoupgraderTest extends AbstractSpruceTest {
    private static instance: Autoupgrader

    protected static async beforeEach() {
        await super.beforeEach()

        this.fakeChdir()
        this.fakeExecSync()

        this.instance = this.SpruceAutoupgrader()
    }

    @test()
    protected static async canCreateSpruceAutoupgrader() {
        assert.isTruthy(this.instance)
    }

    @test()
    protected static async runThrowsWithMissingRequiredOptions() {
        // @ts-ignore
        const err = await assert.doesThrowAsync(() => this.instance.run())

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['packagePaths'],
        })
    }

    @test()
    protected static async callsChdirForEachPackagePath() {
        await this.run()

        assert.isEqualDeep(
            this.callsToChdir,
            this.packagePaths,
            'Should call chdir(path) for each package!\n'
        )
    }

    @test()
    protected static async callsSpruceUpgradeForEachPackagePath() {
        await this.run()

        const expected = [
            this.createSpruceUpgradeCall(),
            this.createSpruceUpgradeCall(),
        ] as CallToExecSync[]

        debugger

        assert.isEqualDeep(
            [this.callsToExecSync[0], this.callsToExecSync[6]],
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
    protected static async callsTscForEachPackagePath() {
        await this.run()

        const expected = [
            this.createTscCall(),
            this.createTscCall(),
        ] as CallToExecSync[]

        assert.isEqualDeep(
            [this.callsToExecSync[1], this.callsToExecSync[7]],
            expected,
            'Should call execSync() for each package with the following options!\n'
        )
    }

    @test()
    protected static async throwsIfTypeValidationFails() {
        this.setThrowOnExecSync()
        this.skipToTypeValidation()

        const err = await assert.doesThrowAsync(() => this.run())

        errorAssert.assertError(err, 'TYPE_VALIDATION_FAILED', {
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
                this.callsToExecSync[2],
                this.callsToExecSync[3],
                this.callsToExecSync[4],
            ],
            expected,
            'Should call execSync() for each package with the following options!\n'
        )
    }

    @test()
    protected static async throwsIfGitPublishFails() {
        this.setThrowOnExecSync()
        this.skipToGitPublish()

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
            [this.callsToExecSync[5], this.callsToExecSync[11]],
            expected,
            'Should call execSync() for each package with the following options!\n'
        )
    }

    @test()
    protected static async throwsIfNpmPublishFails() {
        this.setThrowOnExecSync()
        this.skipToNpmPublish()

        const err = await assert.doesThrowAsync(() => this.run())

        errorAssert.assertError(err, 'NPM_PUBLISH_FAILED', {
            packagePath: this.packagePaths[0],
            originalError: this.fakeExecSyncError,
        })
    }

    private static async run() {
        await this.instance.run(this.packagePaths)
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
        }
    }

    private static setThrowOnExecSync() {
        SpruceAutoupgrader.execSync = () => {
            throw new Error(this.fakeExecSyncError)
        }
    }

    private static skipToTypeValidation() {
        this.skipTryToRunSpruceUpgrade()
    }

    private static skipToGitPublish() {
        this.skipToTypeValidation()
        this.skipTryToRunTypeValidation()
    }

    private static skipToNpmPublish() {
        this.skipToGitPublish()
        this.skipTryToRunGitPublish()
    }

    private static skipTryToRunSpruceUpgrade() {
        // @ts-ignore
        this.instance.tryToRunSpruceUpgrade = () => {}
    }

    private static skipTryToRunTypeValidation() {
        // @ts-ignore
        this.instance.tryToRunTypeValidation = () => {}
    }

    private static skipTryToRunGitPublish() {
        // @ts-ignore
        this.instance.tryToRunGitPublish = () => {}
    }

    private static createSpruceUpgradeCall() {
        return this.formatCommand('spruce upgrade')
    }

    private static createTscCall() {
        return this.formatCommand('tsc --noEmit')
    }

    private static createNpmPublishCall() {
        return this.formatCommand('npm publish')
    }

    private static formatCommand(command: string) {
        return {
            command,
            options: { stdio: 'inherit' },
        } as CallToExecSync
    }

    private static readonly fakeExecSyncError = 'Unexpected error in execSync'

    private static readonly packagePaths = [generateId(), generateId()]

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
