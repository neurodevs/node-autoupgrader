import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface UncommittedChangesErrorOptions extends SpruceErrors.NodeAutoupgrader.UncommittedChanges, ISpruceErrorOptions {
	code: 'UNCOMMITTED_CHANGES'
}
export interface TypeValidationFailedErrorOptions extends SpruceErrors.NodeAutoupgrader.TypeValidationFailed, ISpruceErrorOptions {
	code: 'TYPE_VALIDATION_FAILED'
}
export interface SpruceUpgradeFailedErrorOptions extends SpruceErrors.NodeAutoupgrader.SpruceUpgradeFailed, ISpruceErrorOptions {
	code: 'SPRUCE_UPGRADE_FAILED'
}
export interface NpmVersionPatchFailedErrorOptions extends SpruceErrors.NodeAutoupgrader.NpmVersionPatchFailed, ISpruceErrorOptions {
	code: 'NPM_VERSION_PATCH_FAILED'
}
export interface NpmPublishFailedErrorOptions extends SpruceErrors.NodeAutoupgrader.NpmPublishFailed, ISpruceErrorOptions {
	code: 'NPM_PUBLISH_FAILED'
}
export interface GitPublishFailedErrorOptions extends SpruceErrors.NodeAutoupgrader.GitPublishFailed, ISpruceErrorOptions {
	code: 'GIT_PUBLISH_FAILED'
}

type ErrorOptions =  | UncommittedChangesErrorOptions  | TypeValidationFailedErrorOptions  | SpruceUpgradeFailedErrorOptions  | NpmVersionPatchFailedErrorOptions  | NpmPublishFailedErrorOptions  | GitPublishFailedErrorOptions 

export default ErrorOptions
