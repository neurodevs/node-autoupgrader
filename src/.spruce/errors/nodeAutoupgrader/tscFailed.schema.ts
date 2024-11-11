import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const tscFailedSchema: SpruceErrors.NodeAutoupgrader.TscFailedSchema  = {
	id: 'tscFailed',
	namespace: 'NodeAutoupgrader',
	name: 'TSC_FAILED',
	    fields: {
	            /** . */
	            'packagePath': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(tscFailedSchema)

export default tscFailedSchema
