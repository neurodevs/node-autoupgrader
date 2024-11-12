import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const uncommittedChangesSchema: SpruceErrors.NodeAutoupgrader.UncommittedChangesSchema  = {
	id: 'uncommittedChanges',
	namespace: 'NodeAutoupgrader',
	name: 'UNCOMMITTED_CHANGES',
	    fields: {
	            /** . */
	            'packagePaths': {
	                type: 'text',
	                isRequired: true,
	                isArray: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(uncommittedChangesSchema)

export default uncommittedChangesSchema
