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
            { command: 'spruce upgrade', options: { stdio: 'inherit' } },
            { command: 'spruce upgrade', options: { stdio: 'inherit' } },
        ] as CallToExecSync[]

        assert.isEqualDeep(
            [this.callsToExecSync[0], this.callsToExecSync[2]],
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
        })
    }

    @test()
    protected static async callsTscForEachPackagePath() {
        await this.run()

        const expected = [
            { command: 'tsc --noEmit', options: { stdio: 'inherit' } },
            { command: 'tsc --noEmit', options: { stdio: 'inherit' } },
        ] as CallToExecSync[]

        assert.isEqualDeep(
            [this.callsToExecSync[1], this.callsToExecSync[3]],
            expected,
            'Should call execSync() for each package with the following options!\n'
        )
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
            throw new Error('Unexpected error in execSync')
        }
    }

    private static async run() {
        await this.instance.run(this.packagePaths)
    }

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
