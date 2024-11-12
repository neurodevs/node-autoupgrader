import BaseSpruceError from '@sprucelabs/error'
import ErrorOptions from '#spruce/errors/options.types'

export default class SpruceError extends BaseSpruceError<ErrorOptions> {
    /** an easy to understand version of the errors */
    public friendlyMessage(): string {
        const { options } = this
        let message
        switch (options?.code) {
            case 'SPRUCE_UPGRADE_FAILED':
                message = `Spruce upgrade failed for package: ${options?.packagePath}!`
                break

            case 'TYPE_VALIDATION_FAILED':
                message = `Type validation failed for package: ${options?.packagePath}!`
                break

            case 'GIT_PUBLISH_FAILED':
                message = `Git publish failed for package: ${options?.packagePath}!`
                break

            case 'NPM_PUBLISH_FAILED':
                message = `Npm publish failed for package: ${options?.packagePath}!`
                break

            case 'NPM_VERSION_PATCH_FAILED':
                message = `Npm version patch failed for package: ${options?.packagePath}!`
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
