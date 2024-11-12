import { homedir } from 'os'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import NeurodevsAutoupgrader from '../../components/NeurodevsAutoupgrader'
import SpruceAutoupgrader from '../../components/SpruceAutoupgrader'
import FakeAutoupgrader from '../../testDoubles/FakeAutoupgrader'
import { Autoupgrader } from '../../types'

export default class NeurodevsAutoupgraderTest extends AbstractSpruceTest {
    private static instance: Autoupgrader

    protected static async beforeEach() {
        await super.beforeEach()

        SpruceAutoupgrader.Class = FakeAutoupgrader
        FakeAutoupgrader.resetTestDouble()

        this.instance = this.NeurodevsAutoupgrader()
    }

    @test()
    protected static async canCreateNeurodevsAutoupgrader() {
        assert.isTruthy(this.instance)
    }

    @test()
    protected static async createsSpruceAutoupgrader() {
        await this.run()
        assert.isEqual(FakeAutoupgrader.numCallsToConstructor, 1)
    }

    @test()
    protected static async callsSpruceAutoupgraderWithCorrectPackages() {
        await this.run()
        assert.isEqualDeep(FakeAutoupgrader.callsToRun[0], this.packagePaths)
    }

    private static async run() {
        await this.instance.run()
    }

    private static createPath(packageName: string) {
        return `${homedir()}/dev/${packageName}`
    }

    private static readonly packagePaths = [
        this.createPath('node-lsl'),
        this.createPath('node-xdf'),
    ]

    private static NeurodevsAutoupgrader() {
        return NeurodevsAutoupgrader.Create()
    }
}
