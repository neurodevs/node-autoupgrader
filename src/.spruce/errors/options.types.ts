import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface SpruceUpgradeFailedErrorOptions extends SpruceErrors.NodeAutoupgrader.SpruceUpgradeFailed, ISpruceErrorOptions {
	code: 'SPRUCE_UPGRADE_FAILED'
}

type ErrorOptions =  | SpruceUpgradeFailedErrorOptions 

export default ErrorOptions
