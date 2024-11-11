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
        let passedPaths: string[] = []

        SpruceAutoupgrader.chdir = (path: string) => {
            passedPaths.push(path)
        }

        const packagePaths = [generateId(), generateId()]
        await this.instance.run(packagePaths)

        assert.isEqualDeep(
            passedPaths,
            packagePaths,
            'Should call chdir(path) for each package!\n'
        )
    }

    private static SpruceAutoupgrader() {
        return SpruceAutoupgrader.Create()
    }
}
