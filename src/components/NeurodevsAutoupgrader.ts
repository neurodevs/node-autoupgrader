import { Autoupgrader, AutoupgraderConstructor } from '../types'

export default class NeurodevsAutoupgrader implements Autoupgrader {
    public static Class?: AutoupgraderConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async run(_packagePaths: string[]) {}
}
