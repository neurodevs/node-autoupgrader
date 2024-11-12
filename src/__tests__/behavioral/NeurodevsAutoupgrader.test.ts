import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import NeurodevsAutoupgrader from '../../components/NeurodevsAutoupgrader'
import { Autoupgrader } from '../../types'

export default class NeurodevsAutoupgraderTest extends AbstractSpruceTest {
    private static instance: Autoupgrader

    protected static async beforeEach() {
        await super.beforeEach()
        this.instance = this.NeurodevsAutoupgrader()
    }

    @test()
    protected static async canCreateNeurodevsAutoupgrader() {
        assert.isTruthy(this.instance)
    }

    private static NeurodevsAutoupgrader() {
        return NeurodevsAutoupgrader.Create()
    }
}
