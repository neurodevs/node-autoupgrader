import { homedir } from 'os'
import { Autoupgrader, AutoupgraderConstructor } from '../types'
import SpruceAutoupgrader from './SpruceAutoupgrader'

export default class NeurodevsAutoupgrader implements Autoupgrader {
    public static Class?: AutoupgraderConstructor

    private spruce: Autoupgrader

    protected constructor(spruce: Autoupgrader) {
        this.spruce = spruce
    }

    public static Create() {
        const spruce = SpruceAutoupgrader.Create()
        return new (this.Class ?? this)(spruce)
    }

    public async run() {
        await this.spruce.run(this.packagePaths)
    }

    private packageNames = [
        'node-autoupgrader',
        'node-biometrics',
        'node-csv',
        'node-file-checker',
        'node-file-loader',
        'node-lsl',
        'node-mangled-names',
        'node-neuropype',
        'node-server-plots',
        'node-signal-processing',
        'node-task-queue',
        'node-xdf',
    ]

    private packagePaths = this.packageNames.map(this.createPath)

    private createPath(packageName: string) {
        return `${homedir()}/dev/${packageName}`
    }
}
