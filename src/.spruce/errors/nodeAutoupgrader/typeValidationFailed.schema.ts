import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const typeValidationFailedSchema: SpruceErrors.NodeAutoupgrader.TypeValidationFailedSchema  = {
	id: 'typeValidationFailed',
	namespace: 'NodeAutoupgrader',
	name: 'TYPE_VALIDATION_FAILED',
	    fields: {
	            /** . */
	            'packagePath': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(typeValidationFailedSchema)

export default typeValidationFailedSchema
