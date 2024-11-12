import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface TscFailedErrorOptions extends SpruceErrors.NodeAutoupgrader.TscFailed, ISpruceErrorOptions {
	code: 'TSC_FAILED'
}
export interface SpruceUpgradeFailedErrorOptions extends SpruceErrors.NodeAutoupgrader.SpruceUpgradeFailed, ISpruceErrorOptions {
	code: 'SPRUCE_UPGRADE_FAILED'
}
export interface GitPublishFailedErrorOptions extends SpruceErrors.NodeAutoupgrader.GitPublishFailed, ISpruceErrorOptions {
	code: 'GIT_PUBLISH_FAILED'
}

type ErrorOptions =  | TscFailedErrorOptions  | SpruceUpgradeFailedErrorOptions  | GitPublishFailedErrorOptions 

export default ErrorOptions
