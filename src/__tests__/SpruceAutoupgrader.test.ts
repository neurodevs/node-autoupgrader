import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
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

    private static SpruceAutoupgrader() {
        return SpruceAutoupgrader.Create()
    }
}
