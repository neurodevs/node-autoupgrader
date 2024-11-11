import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface TscFailedErrorOptions extends SpruceErrors.NodeAutoupgrader.TscFailed, ISpruceErrorOptions {
	code: 'TSC_FAILED'
}
export interface SpruceUpgradeFailedErrorOptions extends SpruceErrors.NodeAutoupgrader.SpruceUpgradeFailed, ISpruceErrorOptions {
	code: 'SPRUCE_UPGRADE_FAILED'
}

type ErrorOptions =  | TscFailedErrorOptions  | SpruceUpgradeFailedErrorOptions 

export default ErrorOptions
