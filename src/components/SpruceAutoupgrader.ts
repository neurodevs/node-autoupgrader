export default class SpruceAutoupgrader implements Autoupgrader {
    public static Class?: AutoupgraderConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface Autoupgrader {}

export type AutoupgraderConstructor = new () => Autoupgrader
