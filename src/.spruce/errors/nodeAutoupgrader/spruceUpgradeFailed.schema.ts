import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const spruceUpgradeFailedSchema: SpruceErrors.NodeAutoupgrader.SpruceUpgradeFailedSchema  = {
	id: 'spruceUpgradeFailed',
	namespace: 'NodeAutoupgrader',
	name: 'SPRUCE_UPGRADE_FAILED',
	    fields: {
	            /** . */
	            'packagePath': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(spruceUpgradeFailedSchema)

export default spruceUpgradeFailedSchema
