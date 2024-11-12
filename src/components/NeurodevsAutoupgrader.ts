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

    private packagePaths = [
        this.createPath('node-lsl'),
        this.createPath('node-xdf'),
    ]

    private createPath(packageName: string) {
        return `${homedir()}/dev/${packageName}`
    }
}
