import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const gitPublishFailedSchema: SpruceErrors.NodeAutoupgrader.GitPublishFailedSchema  = {
	id: 'gitPublishFailed',
	namespace: 'NodeAutoupgrader',
	name: 'GIT_PUBLISH_FAILED',
	    fields: {
	            /** . */
	            'packagePath': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(gitPublishFailedSchema)

export default gitPublishFailedSchema
