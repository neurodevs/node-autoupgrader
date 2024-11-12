import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const npmPublishFailedSchema: SpruceErrors.NodeAutoupgrader.NpmPublishFailedSchema  = {
	id: 'npmPublishFailed',
	namespace: 'NodeAutoupgrader',
	name: 'NPM_PUBLISH_FAILED',
	    fields: {
	            /** . */
	            'packagePath': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(npmPublishFailedSchema)

export default npmPublishFailedSchema
