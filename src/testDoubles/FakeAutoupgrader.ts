export default class FakeAutoupgrader {
    public static numCallsToConstructor = 0
    public static callsToRun: string[][] = []

    public constructor() {
        FakeAutoupgrader.numCallsToConstructor++
    }

    public async run(packagePaths: string[]) {
        this.callsToRun.push(packagePaths)
    }

    public get callsToRun() {
        return FakeAutoupgrader.callsToRun
    }

    public static resetTestDouble() {
        FakeAutoupgrader.numCallsToConstructor = 0
        FakeAutoupgrader.callsToRun = []
    }
}
