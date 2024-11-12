import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const npmVersionPatchFailedSchema: SpruceErrors.NodeAutoupgrader.NpmVersionPatchFailedSchema  = {
	id: 'npmVersionPatchFailed',
	namespace: 'NodeAutoupgrader',
	name: 'NPM_VERSION_PATCH_FAILED',
	    fields: {
	            /** . */
	            'packagePath': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(npmVersionPatchFailedSchema)

export default npmVersionPatchFailedSchema
