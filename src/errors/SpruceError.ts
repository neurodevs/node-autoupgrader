import BaseSpruceError from '@sprucelabs/error'
import ErrorOptions from '#spruce/errors/options.types'

export default class SpruceError extends BaseSpruceError<ErrorOptions> {
    /** an easy to understand version of the errors */
    public friendlyMessage(): string {
        const { options } = this
        let message
        switch (options?.code) {
            case 'SPRUCE_UPGRADE_FAILED':
                message = `Command "spruce upgrade" failed for package: ${options?.packagePath}!`
                break

            case 'TSC_FAILED':
                message = `Command "tsc --noEmit" failed for package: ${options?.packagePath}!`
                break

            case 'GIT_PUBLISH_FAILED':
                message = `
                    \n Git publish failed for package: ${options?.packagePath}!
                    \n Original error: ${options?.originalError}
                `
                break

            default:
                message = super.friendlyMessage()
        }

        const fullMessage = options.friendlyMessage
            ? options.friendlyMessage
            : message

        return fullMessage
    }
}
